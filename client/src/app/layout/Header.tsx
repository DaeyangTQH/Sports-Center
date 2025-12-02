import { ShoppingCart } from "@mui/icons-material";
import { AppBar, Badge, Box, IconButton, List, ListItem, Switch, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
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
                    <IconButton size="large" edge='start' color="inherit" sx={{mr:2}}>
                        <Badge badgeContent={4} color="secondary">
                            <ShoppingCart/>
                        </Badge>
                    </IconButton>
                    <List sx={{display: 'flex'}}>
                        {accountLinks.map(({title, path}) =>(
                                <ListItem component={NavLink} to={path} sx={navStyle} key={path}>
                                    {title}
                                </ListItem>
                        ))}
                    </List>
                </Box>
            </Toolbar>
        </AppBar>
    );
}