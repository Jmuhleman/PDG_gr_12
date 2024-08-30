from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import utils
import stripe

app = Flask(__name__)
CORS(app)


@app.route('/api/users', methods=['GET'])
def get_users():
    """Handles requests to retrieve all users"""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)
        query = """
        SELECT
            id,
            lastname,
            firstname,
            ARRAY[street, number, city, zip, country] AS address,
            phone,
            email,
            password,
            ARRAY_AGG(plate ORDER BY plate) AS plates
        FROM
            customers
            INNER JOIN plate_numbers ON id = customer_id
        GROUP BY
            id, lastname, firstname, street, number, city, zip, country, phone, email, password;
        """
        cursor.execute(query)
        user_data = cursor.fetchall()
        
        if user_data is None:
            return jsonify({'status': 'No users found'}), 404

        user_dict = utils.format_user(user_data)

        return jsonify(user_dict), 200
    
    except Exception as e:
        return jsonify({'status': str(e)}), 500
    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/users/<id>', methods=['GET'])
def get_user(id):
    """Handles requests to retrieve user data based on the user ID."""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)
        query = """
        SELECT
            id,
            lastname,
            firstname,
            ARRAY[street, number, city, zip, country] AS address,
            phone,
            email,
            password,
            ARRAY_AGG(plate ORDER BY plate) AS plates
        FROM
            customers
            INNER JOIN plate_numbers ON id = customer_id
        WHERE
            id = %s
        GROUP BY
            id,lastname, firstname, street, number, city, zip, country, phone, email, password;
        """
        cursor.execute(query, (id,))
        user_data = cursor.fetchone()

        if user_data is None:
            return jsonify({'status': 'User ID not found'}), 404

        user_dict = utils.format_user(user_data)

        return jsonify(user_dict), 200
    
    except Exception as e:
        return jsonify({'status': str(e)}), 500
    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/sign_up', methods=['POST'])
def set_user():
    """Handles requests to subscribe user data in the DB."""
    data = request.get_json()

    try:

        if not utils.verify_fields(data):
            return jsonify({'status': 'Fields not valid'}), 400
        
        # Connexion à la base de données
        cursor, conn = utils.connect_to_db(utils.db_params)
        
        # vérification de l'unicité de l'email
        query_email = """
        SELECT email
        FROM customers
        """
        cursor.execute(query_email)
        email_ret = cursor.fetchall()
        emails = {row[0] for row in email_ret}
        if data['email'] in emails:
            return jsonify({'status': 'Email already exists'}), 403
              
        # vérification de l'unicité de la plaque
        query_plate = """
        SELECT plate
        FROM plate_numbers
        """
        cursor.execute(query_plate)
        plate_ret = cursor.fetchall()

        plates = {row[0] for row in plate_ret}

        if data['plate'] in plates:
            return jsonify({'status': 'Plate already exists'}), 403

        # insertion dans BD
        query_customer = """
        INSERT INTO customers (firstname, lastname, street, number, city, zip, country, phone, email, password)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        RETURNING id;
        """

        cursor.execute(query_customer, (
            data['firstname'], data['lastname'], data['address']['street'], data['address']['number'], 
            data['address']['city'], data['address']['zip'], data['address']['country'], data['phone'], 
            data['email'], data['password']
        ))

        # Récupération de l'ID du client inséré
        customer_id = cursor.fetchone()[0]

        # Insertion des numéros de plaque dans la table plate_numbers
        query_plate = """
        INSERT INTO plate_numbers (plate, customer_id)
        VALUES (%s, %s);
        """
        
        cursor.execute(query_plate, (data['plate'], customer_id))

        # Commit pour sauvegarder les modifications
        conn.commit()

        return jsonify({'status': 'User created successfully', 'user_id': customer_id}), 201

    except Exception as e:
        if conn:
            conn.rollback()  # En cas d'erreur, on annule les modifications
        return jsonify({'status': str(e)}), 500

    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/plate/<plate_no>', methods=['GET'])
def get_plate(plate_no):
    """Handles requests to retrieve data based on the plate number."""
    conn = None
    try:

        cursor, conn = utils.connect_to_db(utils.db_params)
        query = """
        SELECT logs.id AS id, name AS parking, timestamp_in, timestamp_out
        FROM logs
        INNER JOIN parking ON logs.parking_id = parking.id
        WHERE plate = %s;
        """
        cursor.execute(query, (plate_no,))
        res = cursor.fetchall()

        if not res:
            return jsonify({'status': 'Plate number not found'}), 404

        column_names = [desc[0] for desc in cursor.description]
        results_list = [dict(zip(column_names, row)) for row in res]

        # Format results with plate_number as the key
        formatted_results = {plate_no: []}
        for result in results_list:
            total_minutes = utils.calculate_duration_in_minutes(result['timestamp_in'], result['timestamp_out'])
            amount = utils.get_amount(total_minutes, result['parking'])
            result['duration'] = f"{total_minutes if total_minutes is not None else None:.2f}"
            result['amount'] = amount
            formatted_results[plate_no].append(result)

### a voir avec la team frontend si renvoyer l'ID ici ou le placer dans les données de retour
        return jsonify(formatted_results), 200

    except Exception as e:
        return jsonify({'status': str(e)}), 500

    finally:
        utils.close_connection_db(cursor, conn)

pendingIntent = {}
stripe.api_key = "sk_test_51Pt6wyRvF3tg1R6w1sVcUO1Gfbgc2wJ8Wt5Q9zCyf4c0fg1Aa3EoSpRE6y0CmZGdtTFAqjCLuaCdv7vuQno2aTRF00d1TgZ1wv"

@app.route('/api/create_payment_intent', methods=['POST'])
def async_create_payment_intent():
    data = request.json
    amount = data['amount']
    currency = data['currency']
    tickets = data['ticket_id']
    print(tickets)
    try:
        payment_intent = stripe.PaymentIntent.create(
            amount=int(amount * 100),  # amount should be in cents
            currency=currency
        )
        pendingIntent[payment_intent['client_secret']] = tickets
        return {"clientSecret": payment_intent['client_secret']}, 200
    except Exception as e:
        print(e);
        return jsonify({'status': str(e)}), 500
    
@app.route('/api/finish_payment_intent', methods=['POST'])
def finish_payment_intent():
    try:
        data = request.json
        payment_intent = data['payment_intent']
        client_secret = data['payment_intent_client_secret']
        payment_intent = stripe.PaymentIntent.retrieve(payment_intent)
        if(payment_intent['status'] != 'succeeded'):
            return {"status": "failed"}, 400
        #pendingIntent[client_secret] = [3]
        tickets = pendingIntent[client_secret]

        cursor, conn = utils.connect_to_db(utils.db_params)
        ftickets = '('+str(tickets[0])+')' if len(tickets) == 1 else tuple(tickets)
        query = "DELETE FROM logs WHERE id IN " + ftickets + ";"
        cursor.execute(query)
        conn.commit()
        return {"status": "success"}, 200
    except Exception as e:
        print(e);
        return jsonify({'status': str(e)}), 500

@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello, World!")


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000", debug=True)
