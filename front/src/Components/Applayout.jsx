import React, { memo, useState } from "react"
import { AppBar, Toolbar, Box, IconButton, Badge, Menu, MenuItem, ListItemIcon, Popover, Stack, Button, Divider, Typography } from '@material-ui/core'
import { AccountCircle, AccountCircleOutline, Mail, MenuOpen, More, NotificationClearAll } from 'mdi-material-ui'
import NavItems from "./NavItems"
import AppRoutes from "./AppRoutes"
import MenuMobile from "./MenuMobile"
import AccountComponent from "./AccountComponent"
import Notifications from "./Notifications"
import MenuBurger from "./MenuBurger"

const Applayout = memo(() => {

  const mobileMenuId = 'primary-search-account-menu-mobile'

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <MenuBurger />
          <typographyClasses
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' } }}
          >
            MUI
          </typographyClasses>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <Notifications />
            <AccountComponent />
            {/* 
          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuId}
            aria-haspopup="true"
            onClick={handleProfileMenuOpen}
            color="inherit"
          >
          
            <ListItemIcon><AccountCircleOutline /></ListItemIcon>
          </IconButton>
           */}
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              // onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuMobile />
              <ListItemIcon><More /></ListItemIcon>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <main>
        <AppRoutes />
      </main>
    </Box>
  )
})

export default Applayout
