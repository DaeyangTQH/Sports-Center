import type { Product } from "../../app/models/Product.ts";
import { Grid } from "@mui/material";
import ProductCard from "./ProductCard.tsx";

interface Props {
    products: Product[];
}

export default function ProductList({ products }: Readonly<Props>) {
    return (
        <Grid container spacing={4} sx={{ p: 4}}>
            {products.map((product) => (
                <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4 }}>
                    <ProductCard product={product} />
                </Grid>
            ))}
        </Grid>
    );
}