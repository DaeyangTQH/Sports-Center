import axios, { AxiosError, type AxiosResponse } from 'axios';
import { router } from '../router/Routes';
import { toast } from 'react-toastify';

axios.defaults.baseURL = 'http://localhost:8081/api/';

const idle = () => new Promise(resolve => setTimeout(resolve, 1500));
const responseBody = (response: AxiosResponse) => response.data;

axios.interceptors.response.use(async response => {
    await idle();
    return response;
}, (error: AxiosError) => {
    // Kiểm tra xem có error.response không (tránh lỗi khi network error)
    if (error.response) {
        const {status} = error.response;
        switch (status) {
            case 404:
                toast.error('Resource not Found');
                router.navigate('/not-found');
                break;
            case 500:
                toast.error('Internal Server Error');
                router.navigate('/server-error');
                break;
            default:
                toast.error('An unexpected error occurred');
                break;
        }
        return Promise.reject(error.response);
    }
    // Nếu không có response (network error, timeout, etc.)
    return Promise.reject(error);
})

const requests = {
    get: (url: string) => axios.get(url).then(responseBody),
    post: (url: string, body: {}) => axios.post(url, body).then(responseBody),
    put: (url: string, body: {}) => axios.put(url, body).then(responseBody),
    delete: (url: string) => axios.delete(url).then(responseBody),
}

const Store = {
    list: () => requests.get('products'),
    details: (id: number) => requests.get(`products/${id}`)
}

const agent = {
    Store
}

export default agent;