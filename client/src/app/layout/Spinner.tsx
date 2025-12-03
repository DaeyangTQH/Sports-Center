import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";

interface Props {
    message?: string;
}

export default function Spinner({message = 'Loading...'}: Readonly<Props>) {
    return (
        <Backdrop open={true} invisible={true}>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                width="100vw"
            >
                <CircularProgress size={20} color={"secondary"}/>
                <Typography variant={'h6'} sx={{mt: 2}}>{message}</Typography>
            </Box>
        </Backdrop>
    )
}