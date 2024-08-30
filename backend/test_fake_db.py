import requests

# Base URL of the Flask application
base_url_plate = 'http://127.0.0.1:5000/api/plate/'
base_url_users = 'http://127.0.0.1:5000/api/users/'
base_url_post_user = 'http://127.0.0.1:5000/api/sign_up/'


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
    """Send DELETE request to API to sign in a new user"""
    
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





