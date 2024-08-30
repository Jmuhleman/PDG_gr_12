import axios from 'axios';

export async function APIGetRequest({url, setData, setStatus}) {
    await axios.get(url).then(response => {
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        if(error.code === "ERR_NETWORK"){
            setStatus({code:500, text:"Internal Server Error or Network Error"});
        }else{
            setStatus({code:error.response.status, text:error.response.statusText});
        }
        console.error('There was an error fetching the data!', error);
    });
}

export async function APIPostRequest({url, data, setData, setStatus}) {
    await axios.post(url, data).then(response => {
        setStatus({code:response.status, text:response.statusText});
        setData(response.data);
    })
    .catch(error => {
        if(error.code === "ERR_NETWORK"){
            setStatus({code:500, text:"Internal Server Error or Network Error"});
        }else{
            setStatus({code:error.response.status, text:error.response.statusText});
        }
        console.error('There was an error fetching the data!', error);
    });
}

