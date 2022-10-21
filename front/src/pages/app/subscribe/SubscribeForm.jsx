import { Stack, TextField } from "@material-ui/core"
import useInput from "../../../Components/hooks/useInput"

const SubscribeForm = () => {
    const username = useInput('')
    const password = useInput('')
    return (
        <form id='loginId' style={{ width: '800px', padding: '16px' }}>
            <Stack direction="row" spacing={2}>
                <TextField
                    id='pseudo'
                    name='pseudo'
                    label='pseudo'
                    onChange={username.onChange}
                    defaultValue={username.value}
                    fullWidth
                />
                <TextField
                    id='password'
                    name='password'
                    type='password'
                    label='password'
                    defaultValue={password.value}
                    onChange={password.onChange}
                    fullWidth
                />
            </Stack>
        </form>  
    )
}

export default SubscribeForm
