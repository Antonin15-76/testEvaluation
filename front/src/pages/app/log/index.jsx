import { CircularProgress } from "@material-ui/core"
import { Navigate } from "react-router-dom"
import { useLocalStorage } from "react-use"
import useFetch from "use-http"
import LogIn from "./LogIn"

const Log = () => {
    const [token, setToken] = useLocalStorage('accessToken')
    console.log('token', token)
    if (token === undefined) setToken(null)
    const { loading, error, data = {} } = useFetch(`http://localhost:3000/verify-authentication`, { headers: { Authorization: `Bearer ${token}` }, cachePolicy: 'cache-and-network' }, [])
    console.log(error)
    // console.log(data)
    
    if (loading) return <CircularProgress sizePreset='xl' />
    // console.log(data)
    // console.log(error)
    if (data) {
        if (data.code !== 401) return error.toString()
        return <LogIn />
    }

    if (data.isLoggedIn) {
          return <Navigate to='/app' />
      }
}

export default Log
