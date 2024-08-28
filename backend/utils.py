
from datetime import datetime
import psycopg2


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

        # cursor.execute("SELECT version();")
        # db_version = cursor.fetchone()
        # print(f"Database version: {db_version}")

        return cursor, conn

    except Exception as error:
        print(f"Error connecting to the database: {error}")


def close_connection_db(cursor, conn):
    """Cut off connection to DB"""
    cursor.close()
    conn.close()


