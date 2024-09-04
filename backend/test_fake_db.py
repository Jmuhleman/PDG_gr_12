import requests
import base64

# Base URL of the Flask application
base_url_plate = 'http://127.0.0.1:5000/api/plate/'
base_url_users = 'http://127.0.0.1:5000/api/users/'
base_url_post_user = 'http://127.0.0.1:5000/api/sign_up/'
base_url_sign_in = 'http://127.0.0.1:5000/api/sign_in'

base_url_admin_sign_in= 'http://127.0.0.1:5000/api/admin/sign_in'

base_url_parking_id = 'http://127.0.0.1:5000/api/parking'
base_url_users_plates= 'http://127.0.0.1:5000/api/users/plates/'
base_url_parking_fares = 'http://127.0.0.1:5000/api/parking/fares'
base_url_parking_id_tarif = 'http://127.0.0.1:5000/api/parking/'
base_url_customer_plate = 'http://127.0.0.1:5000/api/users/plates/'

#jwt_token = '123'
#header, payload, signature = jwt_token.split('.')

def get_plate_data(plate_no):
    """Send a GET request to retrieve data for a given plate number."""
    url = f"{base_url_plate}{plate_no}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            # Successful response
            print(data)
        elif response.status_code == 404:
            print(data.get('status', 'error 404'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

def get_user(id):
    """Send a GET request to retrieve data for a given user"""
    url = f"{base_url_users}{id}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            print(data)

        elif response.status_code == 404:
            print(data.get('status', 'error 404'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

def get_users():
    """Send a GET request to retrieve data for all users"""
    url = f"{base_url_users}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            print(data)

        elif response.status_code == 404:
            print(data.get('status', 'error 404'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

def post_user(new_data):
    """Send POST request to API to sign in a new user"""
    url = f"{base_url_post_user}"

    try:
        response = requests.post(url, json=new_data)
        data = response.json()

        if response.status_code == 201:
            print("User created successfully:")
            print(data.get('user_id'))

        elif response.status_code == 400:
            print(data.get('status', 'Error 400'))

        elif response.status_code == 403:
            print(data.get('status', 'Error 403'))

        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def udpate_password(id, old_password, new_password):
    """Send PATCH request to API to change password for a user"""
    
    url = f"{base_url_users}{id}/change_password"

    try:
        new_data = {}
        new_data['password']     = old_password
        new_data['new_password'] = new_password
        response = requests.patch(url, json=new_data)
        data = response.json()

        if response.status_code == 200:
            print("User password updated:")
            print(data.get('status'))

        elif response.status_code == 403:
            print(data.get('status', 'Error 403'))

        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))

        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def add_plate(id, new_plate):
    """Send POST request to add a plate for a user"""
    
    url = f"{base_url_users}{id}/plate"

    try:
        new_data = {'plate': new_plate}
        response = requests.post(url, json=new_data)
        data = response.json()

        if response.status_code == 201:
            print("Plate number added:")
            print(data.get('status'))

        elif response.status_code == 400:
            print(data.get('status', 'Error 400'))

        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))

        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def remove_plate(id, delete_plate):
    """Send DELETE request to API to delete a plate"""
    
    url = f"{base_url_users}{id}/plate"

    try:
        delete_data = {'plate': delete_plate}
        response = requests.delete(url, json=delete_data)
        data = response.json()

        if response.status_code == 200:
            print("Plate number removed:")
            print(data.get('status'))

        elif response.status_code == 400:
            print(data.get('status', 'Error 400'))

        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))

        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def sign_up(email, password):
    """Send GET customer request to API to sign in"""
    
    url = base_url_sign_in

    try:
        user_data = {'email': email}
        user_data['password'] = password
        response = requests.get(url, json=user_data)
        data = response.json()

        if response.status_code == 200:
            print("User signed in:")
            print(data.get('token'))

        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))
        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def admin_sign_in(email, password):
    """Send POST admin request to API to sign in"""

    url = base_url_admin_sign_in

    try:
        user_data = {'email': email}
        user_data['password'] = password
        response = requests.post(url, json=user_data)
        data = response.json()

        if response.status_code == 200:
            print("User signed in:")
            print(data.get('jwt'))

        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))
        elif response.status_code == 401:
            print(data.get('status', 'Error 401'))
        else:
            print(f"{response.status_code} - {response.text}")

    except requests.RequestException as e:
        print(f"Request error: {e}")

def get_logs():
    """Send a GET request to retrieve logs (pending invoices)"""
    url = f"{base_url_parking_id}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            print(data)

        elif response.status_code == 404:
            print(data.get('status', 'error 404'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

def get_customer_admin():
    """Send a GET request to retrieve the customer from a plate number"""
    url = f"{base_url_customer_plate}WC123"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            print(data)

        elif response.status_code == 404:
            print(data.get('status', 'error 404'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")


def get_fares():
    """Send GET query to API to get parking fares"""

    url = f"{base_url_parking_fares}"

    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            print(data)
        
        elif response.status_code == 404:
            print(data.get('status', 'Error 404'))

        else:
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        print(f"Request error: {e}")

def patch_fares(new_fares):
    """Send PATCH query to API to update parking fares"""

    url = f"{base_url_parking_fares}"

    try:
        response = requests.patch(url, json=new_fares)
        data = response.json()

        if response.status_code == 201:
            print("Fares updated successfully.")
        
        elif response.status_code == 400:
            print(data.get('status', 'Error 400 - Bad Request'))
        
        elif response.status_code == 401:
            print(data.get('status', 'Error 403 - Forbidden'))

        else:
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        print(f"Request error: {e}")



""""
Mock data to query the backend
"""
plate_numbers = [
   'VD12345',
   'QG13123',
   'GE654321'
]

ids = [1, 2, 3, 4]

new_user_data = {
    "lastname": "Doe",
    "firstname": "John",
    "address": {
        "street": "Rte de Cheseaux",
        "number": "1",
        "city": "Yverdon-les-Bains",
        "zip": "1400",
        "country": 'Switzerland'
    },
    "phone": "+41763453456",
    "email": "a@a.ch",
    "password": "SecurePassword123",
    "plate": "BS23454"
}


new_fares = [{
    'parking_id' : 1,
    'name': "le parking du blaireau",
    'fare' : 100},
    {
        'parking_id' : 4,
        'name': "olalal",
        'fare': -2
    }]
# Test cases for query a plate without login

for plate_no in plate_numbers:
    #get_plate_data(plate_no)
    pass
# Test cases for query a user (id)
for id in ids:
    #get_user(id)
    pass

# Test cases for query all users
# get_users()
 

# test case for POST query
# post_user(new_user_data)

# test case for changing password
# udpate_password(1, 'Wayne$123', 'Wayne$123a')

# test case for adding a plate number
# add_plate(1, 'AR123')

# add_plate(1, 'AR123')
# remove_plate(1, 'VD12345')

# test sign_in function
# sign_up('john.wayne@western.ch1', 'Wayne$123')

# test case admin sign in
#admin_sign_in('admin@plateeyes.ch', 'admin')

# test case for pending invoices
# get_logs()

# test customer from plate no
# get_customer_admin()

# test parking fares
#get_fares()
# patch_fares(new_fares)