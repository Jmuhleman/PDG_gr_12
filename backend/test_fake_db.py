import requests

# Base URL of the Flask application
base_url = 'http://127.0.0.1:5000/api/plate/'

def get_plate_data(plate_no):
    """Send a GET request to retrieve data for a given plate number."""
    url = f"{base_url}{plate_no}"
    
    try:
        response = requests.get(url)
        data = response.json()

        if response.status_code == 200:
            # Successful response
            print(data)
        elif response.status_code == 404:
            print(data.get('error', 'Unknown error'))

        else:
            # Other errors
            print(f"{response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

""""
Mock data to query the backend
"""
plate_numbers = [
   'VD12345',
   'QG13123',
   'VD12345',
   'GE67890',
   'AG34567'
]

ids = [12, 32, 54, 45]




# Test cases for query a plate without login

for plate_no in plate_numbers:
    get_plate_data(plate_no)


# Test cases for query a user (id)
for id in ids:
    pass










