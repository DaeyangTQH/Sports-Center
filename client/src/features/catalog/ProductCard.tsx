import type {Product} from "../../app/models/Product.ts";
import {Avatar, Card, CardHeader} from "@mui/material";

interface Props{
    product: Product;
}

export default function ProductCard({product}: Props) {
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
        </Card>
    );
}