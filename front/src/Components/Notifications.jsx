import { Badge, IconButton, ListItemIcon } from "@material-ui/core"
import { NotificationClearAll } from "mdi-material-ui"
import React from "react"

const Notifications = () => {
    return (
        <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
        >
            <Badge badgeContent={17} color="error">
                <ListItemIcon><NotificationClearAll /></ListItemIcon>
            </Badge>
        </IconButton>
    )
}

export default Notifications