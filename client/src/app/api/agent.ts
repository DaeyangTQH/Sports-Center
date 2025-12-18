import axios, { AxiosError, type AxiosResponse } from 'axios';
import { router } from '../router/Routes';
import { toast } from 'react-toastify';
import type { Product } from '../models/Product';
import basketService from './basketService';
import type { Dispatch } from 'redux';
import type { Basket } from '../models/Basket';

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
    details: (id: number) => requests.get(`products/${id}`),
    types: () => requests.get('products/types').then( types => [{id:0, name:'All'}, ...types]),
    brands: () => requests.get('products/brands').then( brands => [{id: 0, name:'All'}, ...brands]),
    search: (keyword: string) => requests.get(`products?keyword=${keyword}`),
}

const basket = {
    get: async () =>{
        try {
            return await basketService.getBasketFromApi();
        } catch (error) {
            throw new Error('Failed to get basket');
        }
    },   
    addItem: async (item: Product, dispatch: Dispatch) =>{
        try {
            const result = await basketService.addItemToBasket(item, 1, dispatch);
            console.log(result);
            return result.basket;
        } catch (error) {
            throw new Error('Failed to add item to basket');
        }
    },
    removeItem: async (itemId: number, dispatch: Dispatch) =>{
        try {
            return await basketService.remove(itemId, dispatch);
        } catch (error) {
            throw new Error('Failed to remove item from basket');
        }
    },
    increaseItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) =>{
        try {
            return await basketService.increaseItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            throw new Error('Failed to increase item quantity');
        }
    },
    decreaseItemQuantity: async (itemId: number, quantity: number = 1, dispatch: Dispatch) =>{
        try {
            return await basketService.decreaseItemQuantity(itemId, quantity, dispatch);
        } catch (error) {
            throw new Error('Failed to decrease item quantity');
        }
    },
    deleteBasket: async (basketId: string) =>{
        try {
            return await basketService.deleteBasket(basketId);
        } catch (error) {
            throw new Error('Failed to delete basket');
        }
    },
    setBasket: async (basket: Basket, dispatch: Dispatch) =>{
        try {
            return await basketService.setBasket(basket, dispatch);
        } catch (error) {
            throw new Error('Failed to set basket');
        }
    },
}

const agent = {
    Store,
    basket
}

export default agent;