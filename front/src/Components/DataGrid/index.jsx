import { Paper } from '@material-ui/core'
import { DataGrid as DataGridMUI } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles'
import clsx from 'clsx'
import { components, localeText, columnTypes as defaultColumnTypes } from './utils'
const useStyles = makeStyles(theme => ({
  root: {
    border: 'none',
    '& .MuiDataGrid-booleanCell[data-value="true"]': {
      color: theme.palette.success.main
    },
    '& .MuiDataGrid-booleanCell[data-value="false"]': {
      color: theme.palette.error.main
    }
  },
  paper: {
    padding: '8px',
    height: '91vh',
  },
}))

/** @param  {import('@material-ui/data-grid').DataGridProps} props */
const DataGrid = (props) => {
  const { withPaper = true, columnTypes = defaultColumnTypes, extraColumnTypes = {} } = props
  const classes = useStyles()
  const className = clsx(props.className, classes.root)
  /** @type {import('@material-ui/data-grid').DataGridProps} */
  const newProps = {

    disableColumnMenu: true,
    disableSelectionOnClick: true,
    components,
    localeText,
    columnTypes: { ...columnTypes, ...extraColumnTypes },
    ...props,
    className
  }
  if (withPaper) {
    return (
      // <div className={classes.root}>
      <Paper className={classes.paper}>
        <DataGridMUI {...newProps} />
      </Paper>
      // </div>
    )
  }

  return <DataGridMUI {...newProps} />
}

export default DataGrid
