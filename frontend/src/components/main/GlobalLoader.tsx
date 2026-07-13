import {Backdrop, Box, CircularProgress, Typography} from "@mui/material";
import React from "react";
import {useNotificationStore} from "../../stores/NotificationStore.ts";

const GlobalLoader: React.FC = () => {
    const loadingCount = useNotificationStore((state) => state.loadingCount);

    return (
        <Backdrop open={loadingCount > 0}
            sx={{
                zIndex: 2000,
            }}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                <CircularProgress size={60} thickness={4}/>
                <Typography sx={{ mt: 1 }}>Lade...</Typography>
            </Box>
        </Backdrop>
    );
}

export default GlobalLoader;