
from datetime import datetime
import psycopg2

db_params = {
    'dbname': 'pdg_db',
    'user': 'postgres',
    'password': 'root',
    'host': 'localhost',
    'port': '5432'
}

def enumerate_fields(user, fields, fields_address):
    """Extract customer fields according to headers as a dictionary"""
    user_dict = {}

    for i, field in enumerate(fields):
        if field == 'address':
            user_dict['address'] = {fields_address[j]: user[3][j] for j in range(len(fields_address))}
        else:
            user_dict[field] = user[i]
    return user_dict


def format_user(user_data, *args):
    """Format single or multi-user information"""

    fields = ['id', 'lastname', 'firstname', 'address', 'phone', 'email', 'password', 'plates']
    fields_address = ['street', 'number', 'city', 'zip', 'country']
    usr_list = []

    if isinstance(user_data, tuple):
        usr_list = enumerate_fields(user_data, fields, fields_address)

    else:
        var = args[0] if args[0] else fields

        for user in user_data:
            usr_dict = enumerate_fields(user, var, fields_address)   
            usr_list.append(usr_dict)

    return usr_list


def enumerate_parking(user, fields):
    """Extract parking fields according to headers as a dictionary."""
    parking_list = []

    for record in user:
        parking_dict = {fields[i]: record[i] for i in range(len(fields))}
        parking_list.append(parking_dict)
    return parking_list


def format_parking(parking_data):
    """Format parking information"""

    fields = ['parking_id', 'parking_name', 'fare']
    parking_list = enumerate_parking(parking_data, fields)

    return parking_list


def verify_fields(data):
    """Check that all fields of a dictionary are not None values"""
    for key, value in data.items():
        if value is None:
            return False
        if isinstance(value, dict):
            if not verify_fields(value):
                return False
        elif isinstance(value, list):
            for item in value:
                if isinstance(item, dict):
                    if not verify_fields(item):
                        return False
                elif item is None:
                    return False
        else:
            if value is None:
                print(f"Field '{key}' is missing.")
                return False
    return True


def get_fare_db(parking_name):
    """Retrieve fare from the database for a given parking name."""
    conn = None
    cursor = None
    try:
        cursor, conn = connect_to_db(db_params)

        query = """
        SELECT fare
        FROM fares
        INNER JOIN parking ON fares.parking_id = parking.id
        WHERE parking.name = %s;
        """
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


