import type {Product} from "../../app/models/Product.ts";
import {Avatar, Button, Card, CardActions, CardContent, CardHeader, CardMedia, Typography} from "@mui/material";

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

    const formatPrice = (price: number): string => {
        return new Intl.NumberFormat('en-Vn', {
            style:'currency',
            currency:'VND',
            minimumFractionDigits:2
        }).format(price);
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
                <Button variant="contained" fullWidth>
                    Add to Cart
                </Button>
                <Button variant="outlined" >
                    View
                </Button>
            </CardActions>

        </Card>
    );
}