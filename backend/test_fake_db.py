import requests

# Base URL of the Flask application
base_url = 'http://127.0.0.1:5000/api/plate/'

def get_plate_data(plate_no):
    """Send a GET request to retrieve data for a given plate number."""
    url = f"{base_url}{plate_no}"
    
    try:
        response = requests.get(url)
        
        if response.status_code == 200:
            # Successful response
            data = response.json()
            print(f"Data for plate number {plate_no}:")
            print(data)
        elif response.status_code == 404:
            # Plate number not found
            print(f"Plate number {plate_no} not found.")
        else:
            # Other errors
            print(f"Error: {response.status_code} - {response.text}")
    
    except requests.RequestException as e:
        # Handle request errors
        print(f"Request error: {e}")

# Example plate numbers to query
plate_numbers = [
    'VD123245',
    'VD789012',
    'VD456789',
    'VD678901',
    'VD000000'  # This should result in a 'not found' response
]

for plate_no in plate_numbers:
    get_plate_data(plate_no)
