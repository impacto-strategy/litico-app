import axios from "axios";

import AuthService from "./AuthService";

const APIClient = axios.create({
    baseURL: process.env.API_URL || 'http://localhost',
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
                // AuthService.logout().finally(() => {
                //     localStorage.removeItem('_U')
                //     window.location.replace("/login");
                // })
            }
        }
        return Promise.reject(error);
    }
);


export default APIClient
