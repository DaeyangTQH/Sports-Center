import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import agent from "../../app/api/agent";
import type { Product } from "../../app/models/Product";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";

export default function BasketPage() {

    const { basket } = useAppSelector(state => state.basket);
    const dispatch = useAppDispatch();
    const { basket: BasketActions } = agent;

    const removeItem = (productId: number) => {
        BasketActions.removeItem(productId, dispatch);
    };

    const decrementQuantity = (productId: number) => {
        BasketActions.decreaseItemQuantity(productId, 1, dispatch);
    };

    const incrementQuantity = (productId: number) => {
        BasketActions.increaseItemQuantity(productId, 1, dispatch);
    };

    const extractImageName = (item: Product): string | null => {
        if (item?.pictureUrl) {
            const parts = item.pictureUrl.split("/")
            if (parts.length > 0) {
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

    if (!basket || basket.items.length === 0) {
        return <Typography variant='h3' sx={{textAlign: 'center', marginTop: 4}}>Basket is empty</Typography>;
    }

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Image</TableCell>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Remove</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {basket?.items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>
                                <img src={"images/products/" + extractImageName(item)} alt='Product' height='50' width='50' />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{formatPrice(item.price)}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => decrementQuantity(item.id)}>
                                    <RemoveIcon />
                                </IconButton>
                                {item.quantity}
                                <IconButton onClick={() => incrementQuantity(item.id)}>
                                    <AddIcon />
                                </IconButton>
                            </TableCell>
                            <TableCell>{formatPrice(item.price * item.quantity)}</TableCell>
                            <TableCell>
                                <IconButton aria-label='delete' onClick={() => removeItem(item.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}