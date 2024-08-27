import axios from 'axios';

export function APIGetRequest({url, setData, setStatus}) {
    axios.get(url).then(response => {
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        console.log(error);
        //setStatue({code:error.response.status, text:error.response.statusText});
        console.error('There was an error fetching the data!', error);
    });
}

export function APIPostRequest({url, data, setData, setStatus}) {
    axios.post(url, data).then(response => {
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        console.error('There was an error fetching the data!', error);
    });
}

