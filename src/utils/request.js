import axios from 'axios';

const request = axios.create({
    baseURL: "http://localhost:8081",//import.meta.env.VITE_API_URL,
    withCredentials: false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

export default request;