import { IconButton, ListItemIcon, ListItemText, MenuItem } from "@material-ui/core"
import { forwardRef, Fragment, useMemo } from "react"
import { Link } from "react-router-dom"
import Home from "../pages"

const navItems = [
    { label: 'Accueil', to: '/app/', Icon: Home, hasDivider: true },
    { label: 'PageHome', to: '/app/pageHome', Icon: Home, hasDivider: true },
]

const useNavigationItems = () => {
    return useMemo(() => {
        return navItems.filter(navItem => {
            if (!navItem.authorizedItems || navItem.authorizedItems.length === 0) return true
            // return navItem.authorizedItems.some(item => rights.includes(item))
        })
    }, [])
}

const NavItems = () => {
    const navigationItemsToUse = useNavigationItems()
  
    return (
        navigationItemsToUse.map(navItem => {
          const LinkTo = forwardRef((props, ref) =>
          <Link {...props} ref={ref} to={navItem.to} />
        )
          const Icon = navItem.Icon || null
        return (
            <Fragment key={navItem.to}>
                <MenuItem key={navItem.label} component={LinkTo}>
                    {Icon && <ListItemIcon><IconButton /></ListItemIcon>}
                    <ListItemText>{navItem.label}</ListItemText> 
                </MenuItem>
            </Fragment>
            )
        })  
    )
  }

  export default NavItems