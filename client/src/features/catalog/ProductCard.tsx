import { Link } from "react-router-dom";
import type {Product} from "../../app/models/Product.ts";
import {Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, CircularProgress, Typography} from "@mui/material";
import { useAppDispatch } from "../../app/store/configureStore.ts";
import { useState } from "react";
import agent from "../../app/api/agent.ts";
import { setBasket } from "../basket/basketSlice.ts";
import { LoadingButton } from "@mui/lab";

interface Props{
    product: Product;
}

export default function ProductCard({product}: Readonly<Props>) {

    const extractImageName = (item: Product): string | null => {
        if(item?.pictureUrl){
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


    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    function addItem() {
        setLoading(true);
        agent.basket.addItem(product, dispatch)
        .then(response => {
            console.log(response);
            dispatch(setBasket(response));
        }).catch((error: any) => {
            console.log(error);
        }).finally(() => {
            setLoading(false);
        });
    }
    return (
        <Card>
            <CardHeader avatar={
                <Avatar sx={{bgcolor: 'secondary.main'}}>
                    {product.name.charAt(0).toUpperCase()}
                </Avatar>
            }
            title={product.name}
                        slotProps={{
                            title: {
                                sx: {fontWeight: 'bold', color: 'primary.main'}
                            }
                        }}
            />

            <CardMedia
                component="img"
                sx={{ height: 200, backgroundSize:'contain'}}
                image={"/images/products/" + extractImageName(product)}
                alt={product.name}
            />

            <CardContent>
                <Typography variant="h5" color="primary" fontWeight="bold">
                    {formatPrice(product.price)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {product.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {product.productBrand} / {product.productType}
                </Typography>
            </CardContent>

            <CardActions>
                <LoadingButton 
                loading={loading} 
                variant="contained" 
                fullWidth 
                onClick={addItem} 
                >
                        Add to Cart
                </LoadingButton>
                <Button variant="outlined" component={Link} to={`/store/${product.id}`}>
                    View
                </Button>
            </CardActions>

        </Card>
    );
}