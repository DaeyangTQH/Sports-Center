import {useEffect, useState} from "react";
import type {Product} from "../../app/models/Product.ts";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(()=>{
        //Function to fetch the data
        const fetchData = async () => {
            try{
                const response = await fetch('http://localhost:8081/api/products');
                if(!response.ok){
                    throw new Error('Failed to fetch the data');
                }
                const data = await response.json();
                setProducts(data.content);
            }catch(error){
                console.error(error)
            }
        };
        fetchData();
    }, [])

    return(
        <div>
            <ul>
                {products.map(product => (
                    <div key={product.id}>
                        <h3>Name: {product.name}</h3>
                        <p>Description: {product.description}</p>
                        <p>Price: {product.price}</p>
                        <p>Brand: {product.productBrand}</p>
                        <p>Type: {product.productType}</p>
                    </div>
                ))}
            </ul>
        </div>
    )
}