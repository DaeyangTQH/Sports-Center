import { Container, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import Catalog from "../../features/catalog/Catalog.tsx";
import Header from "./Header.tsx"
import { useState } from 'react';

function App() {
    //State quản lý dark mode
    const [darkMode, setDarkMode] = useState(false);
    
    // Xác định palette type
    const paletteType = darkMode ? 'dark' : 'light';

    // function để toggle dark mode
    const theme = createTheme({
        palette:{
            mode: paletteType,
        }
    })

    function handleThemeChange(){
        setDarkMode(!darkMode);
    }
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header 
                darkMode={darkMode}
                handleThemeChange={handleThemeChange}
            />
            <Container maxWidth={false} sx={{ p: 0 }}>
                <Catalog />
            </Container>
        </ThemeProvider>
    )
}

export default App
