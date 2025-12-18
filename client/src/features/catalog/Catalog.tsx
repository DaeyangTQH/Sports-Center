import { useEffect, useState } from "react";
import type { Product } from "../../app/models/Product.ts";
import ProductList from "./ProductList.tsx";
import agent from "../../app/api/agent.ts";
import Spinner from "../../app/layout/Spinner.tsx";
import { Grid, Paper, TextField } from "@mui/material";

export default function Catalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     //Function to fetch the data
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch('http://localhost:8081/api/products');
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch the data');
    //             }
    //             const data = await response.json();
    //             setProducts(data.content);
    //         } catch (error) {
    //             console.error(error)
    //         }
    //     };
    //     fetchData();
    // }, [])

    useEffect(() => {
        agent.Store.list()
            .then((products) => setProducts(products.content))
            .catch(error => console.error(error))
            .finally(() => setLoading(false));
    }, []);
    if (!products) return <h3>Unable to load Products</h3>
    if (loading) return <Spinner message="Loading Products..." />
    return (
        <Grid container spacing={4} sx={{ p: 4 }}>
            <Grid size={{ xs: 3, sm: 6, md: 4 }}>
                <Paper sx={{mb: 2}}>
                    <TextField
                    label="Search products"
                    variant="outlined"
                    fullWidth
                    // value={searchTerm}
                    // onChange={(e) => setSearchTerm(e.target.value)}
                    // onKeyDown={(e) => {
                    //     if (e.key === 'Enter') {
                    //         agent.Store.search(searchTerm)
                    //         .then((products) => setProducts(products.content))
                    //         .catch(error => console.error(error))
                    //         .finally(() => setLoading(false));
                    //     }
                    // }}
                    >

                    </TextField>
                </Paper>
            </Grid>
            <Grid size={{ xs: 9, sm: 6, md: 8 }}>
                <ProductList products={products} />
            </Grid>
        </Grid>
    );
}