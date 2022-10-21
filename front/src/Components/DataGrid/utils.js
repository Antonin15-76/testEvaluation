
import GridToolbar from './GridToolbar'
import NoRowsOverlay from './NoRowsOverlay'
import detailsColumnType from './detailsColumnType'
import actionsColumnType from './actionsColumnType'
import { frFR } from '@material-ui/data-grid'
import employeePhotoColumnType from './employeePhotoColumnType'

/** @type {import('@material-ui/data-grid').GridSlotsComponent} */
export const components = {
  NoRowsOverlay: NoRowsOverlay,
  NoResultsOverlay: NoRowsOverlay,
  Toolbar: GridToolbar
}

/** @type {import('@material-ui/data-grid').GridLocaleText} */
export const localeText = {
  ...frFR.components.MuiDataGrid.defaultProps.localeText,
  toolbarExportCSV: 'Exporter en CSV',
  toolbarExport: 'Exporter',
  toolbarExportLabel: 'Exporter',
  booleanCellFalseLabel: 'Faux',
  booleanCellTrueLabel: 'Vrai',
  filterValueAny: 'Tout',
  filterValueFalse: 'Faux',
  filterValueTrue: 'Vrai'
}

export const columnTypes = {
  actions: actionsColumnType,
  details: detailsColumnType,
  photo: employeePhotoColumnType
}
