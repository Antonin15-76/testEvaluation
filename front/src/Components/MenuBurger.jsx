import { IconButton, ListItemIcon, Menu } from "@material-ui/core"
import { MenuOpen } from "mdi-material-ui"
import { useState } from "react"
import NavItems from "./NavItems"

const MenuBurger = () => {
    const [anchorEl, setAnchorEl] = useState(null)
    console.log(anchorEl)
    const isMenuOpen = Boolean(anchorEl)
    const menuId = 'primary-search-account-menu'

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        // handleMobileMenuClose()
    }

    return (
        <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
            onClick={handleMenuOpen}
            onClose={handleMenuClose}
        >
            <ListItemIcon><MenuOpen /></ListItemIcon>
            <Menu
                anchorEl={anchorEl}
                id={menuId}
                keepMounted
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <NavItems />
            </Menu>
        </IconButton>
    )
}

export default MenuBurger
