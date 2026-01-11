import axios from 'axios';
import baseURL from './services/_URLProvider';

const request = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default request;