from datetime import datetime
from flask import Flask, jsonify, request
from flask_cors import CORS
import utils

app = Flask(__name__)
CORS(app)


@app.route('/api/users/', methods=['GET'])
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


@app.route('/api/users/<id>/change_password', methods=['PATCH'])
def update_password(id):
    """Handles requests to change the password of a user."""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)
        query = """
            SELECT password
            FROM customers
            WHERE id = %s
        """
        cursor.execute(query, (id,))
        user_data = cursor.fetchone()

        if user_data is None:
            return jsonify({'status': 'User ID not found'}), 404
            
        data = request.get_json()

        if user_data[0] != data['password']:
            return jsonify({'status': 'Incorrect user password'}), 403

        query_customer = """
            UPDATE customers
            SET password = %s
            WHERE id = %s;
        """
        cursor.execute(query_customer, (data['new_password'], id,))

        conn.commit()

        return jsonify({'status': 'User password updated'}), 200    
    
    except Exception as e:
        return jsonify({'status': str(e)}), 500
    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/users/<id>/plate', methods=['POST'])
def add_plate(id):
    """Handles requests to add a plate number."""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)

        query = """
            SELECT customer_id
            FROM plate_numbers
            WHERE customer_id = %s
        """
        cursor.execute(query, (id,))
        user_data = cursor.fetchone()

        if user_data is None:
            return jsonify({'status': 'User ID not found'}), 404
        
        query = """
            SELECT plate
            FROM plate_numbers
            WHERE customer_id = %s
        """
        cursor.execute(query, (id,))
        existing_plates = cursor.fetchall()

        data = request.get_json()
        new_plate = data.get('plate')

        if new_plate in [plate[0] for plate in existing_plates]:
            return jsonify({'status': 'Plate number already exists'}), 400
        
        query = """
            INSERT INTO plate_numbers (plate, customer_id)
            VALUES (%s, %s)
        """
        cursor.execute(query, (new_plate, id))
        conn.commit()
            
        return jsonify({'status': 'Plate number added successfully'}), 201
        
    except Exception as e:
        return jsonify({'status': str(e)}), 500
    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/users/<id>/plate', methods=['DELETE'])
def remove_plate(id):
    """Handles requests to remove a plate number."""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)

        query = """
            SELECT customer_id
            FROM plate_numbers
            WHERE customer_id = %s
        """
        cursor.execute(query, (id,))
        user_data = cursor.fetchone()

        if user_data is None:
            return jsonify({'status': 'User ID not found'}), 404

        query = """
            SELECT plate
            FROM plate_numbers
            WHERE customer_id = %s
        """
        cursor.execute(query, (id,))
        existing_plates = cursor.fetchall()

        if len(existing_plates) == 0:
            return jsonify({'status': 'No plates found'}), 404

        data = request.get_json()
        plate_to_remove = data.get('plate')

        if plate_to_remove not in [plate[0] for plate in existing_plates]:
            return jsonify({'status': 'Plate number not found'}), 404

        if len(existing_plates) == 1:
            return jsonify({'status': 'Cannot delete the only plate'}), 400

        query = """
            DELETE FROM plate_numbers
            WHERE plate = %s AND customer_id = %s
        """
        cursor.execute(query, (plate_to_remove, id))
        conn.commit()

        return jsonify({'status': 'Plate number removed successfully'}), 200

    except Exception as e:
        return jsonify({'status': str(e)}), 500

    finally:
        utils.close_connection_db(cursor, conn)



@app.route('/api/sign_up/', methods=['POST'])
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

        return jsonify(formatted_results), 200

    except Exception as e:
        return jsonify({'status': str(e)}), 500

    finally:
        utils.close_connection_db(cursor, conn)


@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello, World!")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000", debug=True)
"""
    from waitress import serve
    serve(app, host="0.0.0.0", port="5000")
"""