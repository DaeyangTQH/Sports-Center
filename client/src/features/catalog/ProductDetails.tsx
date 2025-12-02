import { Divider, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import type { Product } from "../../app/models/Product";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import agent from "../../app/api/agent";

// Thay vì dùng fetch, dùng axios để có thể gọi API từ backend(Giao tiếp với backend) từ FE
export default function ProductDetail() {
    const {id} = useParams<{id:string}>(); // Destructing (Có thể là undefined)
    const [product, setProduct] = useState<Product | null>();
    const [loading, setLoading] = useState(true);

    const extractImageName = (item: Product): string | null => {
        if(item?.pictureUrl){ // item?.pictureUrl = item && item.pictureUrl
            const parts = item.pictureUrl.split("/")
            if(parts.length > 0){
                return parts[parts.length - 1]
            }
        }
        return null;
    }

    const formatPrice = (price: number): string => { // :string là kiểu dữ liệu trả về 
        return new Intl.NumberFormat('en-Vn', {
            style:'currency',
            currency:'VND',
            minimumFractionDigits:2
        }).format(price);
    }

    useEffect(() => {
        id && agent.Store.details(parseInt(id)) // short-circuit evaluation
        .then(response => setProduct(response))
        .catch(error => console.error(error))
        .finally(() => setLoading(false))
    }, [id])

    if(loading) return <h3>Loading product...</h3>
    if(!product) return <h3>Product not found</h3>

    return (
        <Grid container spacing={6}>
            <Grid size={{xs: 6}}>
                <img src={"/images/products/"+extractImageName(product)} 
                    alt={product.name} 
                    style={{width: '100%', objectFit: 'contain', maxHeight: '400px'}} 
                    />
            </Grid>

            <Grid size={{xs: 6}}>
                <Typography variant="h5">{product.name}</Typography>
                <Divider sx={{mb: 2}}/>
                <Typography variant="h6" color="secondary" gutterBottom>{formatPrice(product.price)} </Typography>

                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Description</TableCell>
                                <TableCell>{product.description}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>{product.productType}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>{product.productBrand}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        </Grid>
    );

}