from flask import Flask, jsonify
from flask_cors import CORS
import fake_db
from datetime import datetime

app = Flask(__name__)
CORS(app)

def get_duration(timestamp_in, timestamp_out):
    if timestamp_in is None or timestamp_out is None:
        # Vehicle not entered or not yet exited
        return None
    
    try:
        # Convert string timestamps to datetime objects if they are not already
        if isinstance(timestamp_in, str):
            timestamp_in = datetime.fromisoformat(timestamp_in)
        if isinstance(timestamp_out, str):
            timestamp_out = datetime.fromisoformat(timestamp_out)
        
        # Ensure timestamps are datetime objects
        if not isinstance(timestamp_in, datetime) or not isinstance(timestamp_out, datetime):
            raise ValueError("Timestamps must be datetime objects or ISO formatted strings")
        
        # Calculate the duration
        return str(timestamp_out - timestamp_in)

    except (ValueError, TypeError) as e:
        # Handle cases where timestamps are invalid or conversion fails
        return str(e)

def get_fare_db(parking_name):
    # Replace by an sql query
    
    if parking_name in fake_db.fake_price:
        return fake_db.fake_price[parking_name]
    else:
        return None

from datetime import timedelta
from decimal import Decimal

def get_amount(duration, parking_name):
    if duration is None:
        return None
    
    # Convert duration string to a timedelta object
    try:
        duration_parts = duration.split(":")
        if len(duration_parts) == 3:
            hours, minutes, seconds = map(int, duration_parts)
            duration_td = timedelta(hours=hours, minutes=minutes, seconds=seconds)
        else:
            raise ValueError("Invalid duration format")
        
        # Convert duration to hours in decimal form
        duration_hours = duration_td.total_seconds() / 3600
        
        # Fetch the fare rate from the database and ensure it's a decimal
        fare_rate = get_fare_db(parking_name)
        if fare_rate is None:
            raise ValueError("Parking name not found in database")
        
        fare_rate = Decimal(fare_rate)
        
        return round(fare_rate * Decimal(duration_hours), 2)  # Round to 2 decimal places for currency formatting

    except (ValueError, TypeError) as e:
        # Handle errors during the conversion and calculation
        return str(e)

"""
def get_amount(duration, parking_name):
    return duration * get_fare_db(parking_name)
    hours = psl
"""
@app.route('/api/plate/<plate_no>', methods=['GET'])
def get_plate(plate_no):
    """Handles requests to retrieve data based on the plate number."""
    conn = None
    try:
        """
        # Establish the database connection
        conn = get_db_connection()
        cursor = conn.cursor()

        # Define the SQL query to fetch data for the given plate number
        query = "SELECT * FROM your_table WHERE plate_no = %s"
        
        # Execute the query
        cursor.execute(query, (plate_no,))
        
        # Fetch the result
        result = cursor.fetchone()
        """
        result = fake_db.fake_plates[plate_no]

        result['duration'] = get_duration(result['timestamp_in'], result['timestamp_out'])
        result['amount']   = get_amount(result['duration'], result['parking_name'])

        if result is None:
            return jsonify({'error': 'Plate number not found'}), 204

        # Define the column names (adjust according to your table structure)
        #column_names = [desc[0] for desc in cursor.description]
        
        # Convert the result to a dictionary
        #result_dict = dict(zip(column_names, result))

        # Return the result as a JSON response
        return jsonify(result), 200

    except Exception as e:
        # Handle any errors that occur during the database interaction
        return jsonify({'error': str(e)}), 500

    finally:
        # Close the database connection
        if conn:
            conn.close()





if __name__ == '__main__':
    app.run(host="0.0.0.0", port="5000", debug=True)
