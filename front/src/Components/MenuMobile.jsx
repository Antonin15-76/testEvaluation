import { Badge, IconButton, ListItemIcon, Menu, MenuItem } from "@material-ui/core"
import { Mail } from "mdi-material-ui"
import React, { useState } from "react"
import AccountComponent from "./AccountComponent"
import Notifications from "./Notifications"

const MenuMobile = () => {

    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null)

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null)
    }

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget)
    }

    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl)
    const mobileMenuId = 'primary-search-account-menu-mobile'

    return (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >
            {/* <MenuItem>
                <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                    <Badge badgeContent={4} color="error">
                        <ListItemIcon><Mail /></ListItemIcon>
                    </Badge>
                </IconButton>
                <p>Messages</p>
            </MenuItem> */}
            <MenuItem>
                <Notifications />
            </MenuItem>
            <AccountComponent />
        </Menu>
    )
}

export default MenuMobile
