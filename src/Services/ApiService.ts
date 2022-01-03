import axios from "axios";

const APIClient = axios.create({
    baseURL: 'http://localhost',
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
            console.log('LOG OUT')
        }
        return Promise.reject(error);
    }
);


export default APIClient