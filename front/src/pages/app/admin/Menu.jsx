import AddComponentGraphQLDialog from '../../../../Components/dialog/AddComponentGraphQLDialog'
import { constructVariables } from './constants'
import Form from './Form'
import { createLeague } from './graphQL'
import { Box, IconButton, Stack, Typography } from '@material-ui/core'
import BackLink from '../../../../Components/BackLink'

const Menu = (props) => {
  const { refetch } = props
  return (
    <>
        <Stack direction='row'>
            <IconButton component={BackLink} title='Retour' />
            <Typography>
                Ecuries
            </Typography>
            <Box flexGrow={1} height='100%' display='flex' alignItems='center' justifyContent='right'>
                <AddArticleSupplier />
            </Box>
        </Stack>
    </>
  )
}

const AddArticleSupplier = () => {
  return (
    <AddComponentGraphQLDialog
      id='articleSupplier'
      name='articleSupplier'
      mutation={createLeague}
      constructVariables={constructVariables}
      successText="Création d'un fournisseur réussie."
      errorText="Création d'un fournisseur échouée."
      mutationName='setArticleSupplier'
    //   mutationResFragment={fragmentArticleSuppliers}
      Form={Form}
      title="Ajouter un fournisseur d'articles"
      mutationCacheKey='accounts'
      maxWidth='lg'
    />
  )
}

export default Menu
