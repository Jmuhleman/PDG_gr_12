from flask import Flask, jsonify
from flask_cors import CORS
from datetime import datetime
import psycopg2
from datetime import timedelta
from decimal import Decimal

app = Flask(__name__)
CORS(app)


db_params = {
    'dbname': 'pdg_db',
    'user': 'postgres',
    'password': 'root',
    'host': 'localhost',
    'port': '5432'
}




def get_fare_db(parking_name):
    """Retrieve fare from the database for a given parking name."""
    conn = None
    cursor = None
    try:
        cursor, conn = connect_to_db(db_params)
        
        query = "SELECT fare FROM parking_fares WHERE parking_name = %s;"
        cursor.execute(query, (parking_name,))
        fare_row = cursor.fetchone()

        if fare_row is None:
            return None
        
        return fare_row[0]
    
    except Exception as e:
        print(f"Error retrieving fare: {e}")
        return None

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()



def calculate_duration_in_minutes(timestamp_in, timestamp_out):
    """Compute duration and convert the amount in minutes"""
    if timestamp_in is None or timestamp_out is None:
        return None
    
    try:
        if isinstance(timestamp_in, str):
            timestamp_in = datetime.fromisoformat(timestamp_in)
        if isinstance(timestamp_out, str):
            timestamp_out = datetime.fromisoformat(timestamp_out)
        
        if not isinstance(timestamp_in, datetime) or not isinstance(timestamp_out, datetime):
            raise ValueError("Timestamps must be datetime objects or ISO formatted strings")
        
        duration = timestamp_out - timestamp_in
        total_minutes = duration.total_seconds() / 60
        return total_minutes

    except (ValueError, TypeError) as e:
        print(f"Error in duration calculation: {e}")
        return None





def get_amount(total_minutes, parking_name):
    """Compute total amount to be paid by customer for a given stay"""
    if total_minutes is None:
        return None

    fare = get_fare_db(parking_name)
    if fare is None:
        return None
    # as we store fares per hours
    amount = fare * total_minutes / 60
    return f"{amount:.2f}"



def connect_to_db(params):
    """Establish connection to DB and return pointer to socket"""
    try:
        conn = psycopg2.connect(**params)
        print("Connection successful")
        cursor = conn.cursor()

        #cursor.execute("SELECT version();")
        #db_version = cursor.fetchone()
        #print(f"Database version: {db_version}")

        return cursor, conn

    except Exception as error:
        print(f"Error connecting to the database: {error}")




def close_connection_db(cursor, conn):
        """Cut off connection to DB"""
        cursor.close()
        conn.close()



@app.route('/api/plate/<plate_no>', methods=['GET'])
def get_plate(plate_no):
    """Handles requests to retrieve data based on the plate number."""
    conn = None
    try:
        
        cursor, conn = connect_to_db(db_params)
        query = """
        SELECT pl.parking_name AS parking, pl.timestamp_in AS in, pl.timestamp_out AS out
        FROM parking_logs pl
        INNER JOIN parking_fares pf ON pl.parking_name = pf.parking_name
        WHERE pl.plate_number = %s
        """

        cursor.execute(query, (plate_no,))
        res = cursor.fetchall()
        #print(f"{res}")
        if not res: 
            return jsonify({'error': 'Plate number not found'}), 404

        column_names = [desc[0] for desc in cursor.description]
        results_list = [dict(zip(column_names, row)) for row in res]

        # Format results with plate_number as the key
        formatted_results = {plate_no: []}
        for result in results_list:
            total_minutes = calculate_duration_in_minutes(result['in'], result['out'])
            amount = get_amount(total_minutes, result['parking'])
            result['duration'] = f"{total_minutes if total_minutes is not None else None:.2f}"
            result['amount'] = amount
            formatted_results[plate_no].append(result)

        return jsonify(formatted_results), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        close_connection_db(cursor, conn)




if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000", debug=True)
