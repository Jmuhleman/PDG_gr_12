import axios from 'axios';

export function APIGetRequest({url, setResponse}) {
    axios.get(url).then(response => {
        setResponse(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the data!', error);
    });
}

export function APIPostRequest({url, data, setResponse}) {
    axios.post(url, data).then(response => {
        setResponse(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the data!', error);
    });
}

