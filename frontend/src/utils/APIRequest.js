import axios from 'axios';

const instance = axios.create({
    withCredentials: true
});

export async function APIGetRequest({ url, setData, setStatus }) {
    try {
        const response = await instance.get(url);
        setStatus({ code: response.status, text: response.statusText });
        setData(response.data);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({ code: 500, text: "Internal Server Error or Network Error" });
        } else if (error.response) {
            setStatus({ code: error.response.status, text: error.response.data.status });
        }
        console.error('There was an error fetching the data!', error);
    }
}

export async function APIPostRequest({ url, data, setData, setStatus }) {
    try {
        const response = await instance.post(url, data);
        setStatus({ code: response.status, text: response.statusText });
        setData(response.data);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({ code: 500, text: "Internal Server Error or Network Error" });
        } else if (error.response) {
            setStatus({ code: error.response.status, text: error.response.data.status });
        }
        console.error('There was an error fetching the data!', error);
    }
}

export async function APIDeleteRequest({ url, setStatus }) {
    try {
        const response = await instance.delete(url);
        setStatus({ code: response.status, text: response.statusText });
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({ code: 500, text: "Internal Server Error or Network Error" });
        } else if (error.response) {
            setStatus({ code: error.response.status, text: error.response.data.status });
        }
        console.error('There was an error fetching the data!', error);
    }
}

export async function APIPatchRequest({ url, data, setStatus }) {
    try {
        const response = await instance.patch(url, data);
        setStatus({ code: response.status, text: response.statusText });
        setData(response.data);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({code:500, text:"Internal Server Error or Network Error"});
        } else if (error.response) {
            setStatus({code:error.response.status, text:error.response.statusText});
        }
        console.error('There was an error fetching the data!', error);
    }
}

export async function APIGetRequestWithoutCredentials({ url, setData, setStatus }) {
    try {
        const response = await axios.get(url);
        setStatus({ code: response.status, text: response.statusText });
        setData(response.data);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({ code: 500, text: "Internal Server Error or Network Error" });
        } else if (error.response) {
            setStatus({ code: error.response.status, text: error.response.data.status });
        }
        console.error('There was an error fetching the data!', error);
    }
}

export async function APIPostRequestWithoutCredentials({ url, data, setData, setStatus }) {
    try {
        const response = await axios.post(url, data);
        setStatus({ code: response.status, text: response.statusText });
        setData(response.data);
    } catch (error) {
        if (error.code === "ERR_NETWORK") {
            setStatus({ code: 500, text: "Internal Server Error or Network Error" });
        } else if (error.response) {
            setStatus({ code: error.response.status, text: error.response.data.status });
        }
        console.error('There was an error fetching the data!', error);
    }
}


