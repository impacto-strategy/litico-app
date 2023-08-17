import axios from "axios";

const APIClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost:8000',
    withCredentials: true, // required to handle the CSRF token
});

APIClient.defaults.withCredentials = true

/*
 * Add a response interceptor
 */
APIClient.interceptors.response.use(
    (response) => {
        return response;
    },
    function (error) {
        if (
            error.response &&
            [401, 419].includes(error.response.status)
        ) {
            if (
                [401].includes(error.response.status)
            ) {
                console.warn(error.response.status)
            }
        }
        return Promise.reject(error);
    }
);


export default APIClient
