import { makeStyles } from "@material-ui/styles"
import { Navigate } from "react-router-dom"
import { useLocalStorage } from "react-use"
import useFetch from "use-http"
import SubscribeForm from "./SubscribeForm"

const useStyles = makeStyles((theme) => ({
    forgotpasswordLink: {
      fontSize: '14px',
      '&:hover': {
        cursor: 'pointer'
      }
    },
    background: {
      // backgroundImage: `url(${BasGauche}), url(${Haut}), url(${HautGaucheMilieu}), url(${HautGauche}), url(${Droite})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left bottom, 200px top, left top, left top, right 40px'
    }
  }))

const Subsribe = () => {
    const classes = useStyles()
    const [token, setToken] = useLocalStorage('accessToken')
    if (token === undefined) setToken(null)
    const { loading, error, data = {} } = useFetch(`http://localhost:3000/verify-authentication`, { headers: { Authorization: `Bearer ${token}` }, cachePolicy: 'cache-and-network' }, [])
    
    if (data.isLoggedIn) {
        return <Navigate to='/app' />
    } else {
        return (
            <div className={classes.background} style={{ height: '100%' }}>
                <SubscribeForm />
            </div>
        )
    }
}

export default Subsribe