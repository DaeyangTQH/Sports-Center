import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
    const navigate = useNavigate();
    const handleGoHome = () => {
        navigate('/')
    };

    return (
        <Container>
            <Box
                component="img"           
                src="/images/page-not-found.png"   
                alt="Page not found"
                sx={{
                    width: '100%',
                    maxWidth: 400,       
                    height: 'auto',
                    margin: '0 auto',     
                    display: 'block'
                }}
            />

            <Typography variant="h4" component="h1" gutterBottom>
                Oops! Page not found.
            </Typography>

            <Typography variant="subtitle1">
                We can't seem to find the page you're looking for.
            </Typography>

            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go Home
            </Button>
        </Container>
    )
}