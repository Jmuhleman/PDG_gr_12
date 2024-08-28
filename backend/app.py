from datetime import datetime
from flask import Flask, jsonify
from flask_cors import CORS
import utils


app = Flask(__name__)
CORS(app)




@app.route('/api/plate/<id>', methods=['GET'])
def get_user(id):
    """Handles requests to retrieve user data based on the user ID."""

    try:
        cursor, conn = utils.connect_to_db(utils.db_params)
        query = """
        --------------query here;
        """
        cursor.execute(query, (id,))
        user_data = cursor.fetchone()

        if user_data is None:
            return jsonify({'status': 'User ID not found'}), 404

        column_names = [desc[0] for desc in cursor.description]
        user_dict = dict(zip(column_names, user_data))

        return jsonify(user_dict), 200
    except Exception as e:
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
        SELECT pl.parking_name AS parking, pl.timestamp_in, pl.timestamp_out
        FROM parking_logs pl
        INNER JOIN parking_fares pf ON pl.parking_name = pf.parking_name
        WHERE pl.plate_number = %s
        """

        cursor.execute(query, (plate_no,))
        res = cursor.fetchall()
        # print(f"{res}")
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


if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000", debug=True)
