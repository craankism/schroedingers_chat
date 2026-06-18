import {useNotificationStore} from "../stores/NotificationStore.ts";
import {Alert, Box, Collapse, IconButton} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";


const NotificationBanner: React.FC = () => {

    const {notifications, removeNotification} = useNotificationStore();

    return (
        <Box sx={{ position: 'fixed', bottom: 50, left: '50%', transform:'translateX(-50%)',  zIndex: 1500, width: 300 }}>
            {notifications.map((n) => (
                <Collapse key={n.id} in timeout={1000}>
                    <Alert
                        severity={n.type}
                        variant={"outlined"}
                        sx={{mb:1}}
                        action={
                        <IconButton size="small" onClick={() => removeNotification(n.id)}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                        }
                        >{n.message}</Alert>
                </Collapse>
            ))}
        </Box>
    );
}

export default NotificationBanner;