import { Button } from "@material-ui/core"
import { Link, Navigate, useNavigate } from "react-router-dom"

const SubscribeButton = () => {
    const navigate = useNavigate()
    
    const onClickAction = (value) => {
        

        return navigate('/subscribe')
    }
    return (
        <Button onClick={onClickAction}>Souscrire</Button>
    )
}

export default SubscribeButton
