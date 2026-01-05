import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/configureStore";
import { signOut } from "../../features/account/accountSlice";
// Khai báo 1 mảng
const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Store', path: '/store' },
    { title: 'Contact', path: '/contact' }
]

const accountLinks = [
    { title: 'Login', path: '/login' },
    { title: 'Register', path: '/register' }
]

// Khai báo 1 object
const navStyle = {
    color: "inherit",
    typography: "inherit",
    textDecoraion: "none",
    "&:hover": {
        color: "secondary.main"
    },
    "&:active": {
        color: "text.secondary"
    }
}

interface Props {
    darkMode: boolean;
    handleThemeChange: () => void;
}

export default function Header({ darkMode, handleThemeChange }: Readonly<Props>) {

    const {basket} = useAppSelector(state => state.basket);
    const { user } = useAppSelector(state => state.account);
    const dispatch = useAppDispatch();

    useEffect(() => {
        console.log(basket);
    }, [basket]);

    const itemCount = basket?.items.reduce(() => basket.items.length, 0);

    return (
        <AppBar position="static">
            <Toolbar sx={{
                display: "flex",
                alignItems: "center"
            }}>
                <Box display='flex' alignContent={"center"} > {/* Container đa năng - giống div */}
                    <Typography variant="h6"> {/* Hiển thị text với các style chuẩn */}
                        Sport Center
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} /> {/* Toggle button */}
                </Box>
                <List sx={{ display: 'flex', marginLeft: 'auto', marginRight: 'auto' }}>
                    {navLinks.map(({ title, path }) => (
                        <ListItem component={NavLink} to={path} sx={navStyle} key={path}>
                            {title}
                        </ListItem>
                    ))}
                </List>
                <Box display='flex' alignItems='center'>
                    <IconButton component={Link} to='basket' size="large" edge='start' color="inherit" sx={{mr:2}}>
                        <Badge badgeContent={itemCount} color="secondary">
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>
                    {user ? (
                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="body1">Hi, {user.username}</Typography>
                            <Button
                                color="inherit"
                                variant="outlined"
                                onClick={() => dispatch(signOut())}
                                sx={{ borderColor: "rgba(255,255,255,0.7)" }}
                            >
                                Logout
                            </Button>
                        </Box>
                    ) : (
                        <List sx={{display: 'flex'}}>
                            {accountLinks.map(({title, path}) =>(
                                    <ListItem component={NavLink} to={path} sx={navStyle} key={path}>
                                        {title}
                                    </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}