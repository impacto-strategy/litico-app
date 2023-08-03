import axios from "axios";

const jsonInterceptor: any = (interceptor: (arg0: any) => any) => ([
    (response: { data: any; }) => interceptor(response.data),
    (error: any) => Promise.reject(error),
]);

export const cogccClient = ({interceptor}: { interceptor: any }) => {
    //TODO: Implement stale-while-revalidate using useSWR React Hooks to manage caching and reduce # of requests
    const client = axios.create();
    client.interceptors.response.use(...jsonInterceptor(interceptor));
    return client;
}

