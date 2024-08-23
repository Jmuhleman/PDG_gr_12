import requests

def test_api():
    url = "http://localhost:5000/api/hello"
    response = requests.get(url)

    # Assert the response status code
    assert response.status_code == 200

    # Assert the response content
    assert response.json() == {'message': 'Hello, World!'}

test_api()