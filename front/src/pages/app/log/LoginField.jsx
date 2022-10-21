import { Stack, TextField } from "@material-ui/core"
import { useMemo } from "react"

const LoginField = (props) => {
  const { username, disabled, password } = props
  return (
    <Stack direction="row" spacing={2}>
      <TextField
        id='pseudo'
        name='pseudo'
        label='pseudo'
        onChange={username.onChange}
        defaultValue={username.value}
        disabled={disabled}
        fullWidth
      />
      <TextField
        id='password'
        name='password'
        type='password'
        label='password'
        defaultValue={password.value}
        onChange={password.onChange}
        disabled={disabled}
        fullWidth
      />
    </Stack>
  )
}

export default LoginField
