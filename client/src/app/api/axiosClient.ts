import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { router } from "../router/Routes";

axios.defaults.baseURL = "http://localhost:8081/api/";

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as unknown as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
});

axios.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response) {
            const { status } = error.response;
            switch (status) {
                case 400:
                    toast.error("Bad request");
                    break;
                case 401:
                    toast.error("Invalid username or password");
                    break;
                case 403:
                    toast.error("You are not authorized to do that");
                    break;
                case 404:
                    toast.error("Resource not Found");
                    router.navigate("/not-found");
                    break;
                case 500:
                    toast.error("Internal Server Error");
                    router.navigate("/server-error");
                    break;
                default:
                    toast.error("An unexpected error occurred");
                    break;
            }
            return Promise.reject(error.response);
        }
        return Promise.reject(error);
    }
);

export default axios;


