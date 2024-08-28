import axios from 'axios';

export function APIGetRequest({url, setData, setStatus}) {
    axios.get(url).then(response => {
        console.log(response);
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        console.log(error);
        setStatus({code:error.response.status, text:error.response.statusText});
        console.error('There was an error fetching the data!', error);
    });
}

export function APIPostRequest({url, data, setData, setStatus}) {
    axios.post(url, data).then(response => {
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        setStatus({code:error.response.status, text:error.response.statusText});
        console.error('There was an error fetching the data!', error);
    });
}

