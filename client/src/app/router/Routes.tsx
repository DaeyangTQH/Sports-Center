import { createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import Catalog from "../../features/catalog/Catalog";
import ContactPage from "../../features/contact/ContactPage";
import ProductDetail from "../../features/catalog/ProductDetails";

export const router = createBrowserRouter([
    {
        path:'/',
        element:<App/>,
        children:[
            {path:'', element:<HomePage/>},
            {path:'store', element:<Catalog/>},
            {path:'contact', element:<ContactPage/>},
            {path:'store/:id', element:<ProductDetail/>}
        ]
    }
])