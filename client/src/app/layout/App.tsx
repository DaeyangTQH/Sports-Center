import {Container, createTheme, CssBaseline, ThemeProvider} from '@mui/material';
import Header from "./Header.tsx"
import {useState} from 'react';
import {Outlet} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

function App() {
    //State quản lý dark mode
    const [darkMode, setDarkMode] = useState(false);

    // Xác định palette type
    const paletteType = darkMode ? 'dark' : 'light';

    // function để toggle dark mode
    const theme = createTheme({
        palette: {
            mode: paletteType,
        }
    })

    function handleThemeChange() {
        setDarkMode(!darkMode);
    }

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer position='bottom-right' hideProgressBar theme='colored'/>
            <CssBaseline/>
            <Header
                darkMode={darkMode}
                handleThemeChange={handleThemeChange}
            />
            <Container maxWidth={false} sx={{ minHeight: 'calc(100vh - 64px)', p: 2 }}>
                <Outlet/>{ // Hoạt động dựa trên route và children, nghĩa là sẽ render Catalog hoặc các trang khác tùy theo route
            }
            </Container>
        </ThemeProvider>
    )
}

export default App
