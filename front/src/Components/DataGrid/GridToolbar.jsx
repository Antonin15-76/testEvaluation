import { Divider, Stack } from '@material-ui/core'
import { GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarFilterButton, GridToolbarContainer, GridToolbarExport } from '@material-ui/data-grid'

const GridToolbar = (props) => {
  if (props.inTab) return <GridToolbarInTab {...props} />
  const { hasColumns, hasFilters, hasExport, hasDensity, children } = props
  return (
    <div>
      <GridToolbarContainer>
        <div style={{ flexGrow: 1 }}>
          {hasColumns && <GridToolbarColumnsButton />}
          {hasFilters && <GridToolbarFilterButton />}
          {hasDensity && <GridToolbarDensitySelector />}
          {hasExport && (
            <GridToolbarExport
              csvOptions={{
                utf8WithBom: true
              }}
            />
          )}
        </div>
        <Stack direction='row' spacing={2}>
          {children}
        </Stack>
      </GridToolbarContainer>
    </div>

  )
}

const GridToolbarInTab = (props) => {
  const { hasColumns, hasFilters, hasExport, hasDensity, children } = props
  return (
    <div>
      <GridToolbarContainer>
        <div style={{ flexGrow: 1 }}>
          {hasColumns && <GridToolbarColumnsButton />}
          {hasFilters && <GridToolbarFilterButton />}
          {hasDensity && <GridToolbarDensitySelector />}
          {hasExport && (
            <GridToolbarExport
              csvOptions={{
                utf8WithBom: true
              }}
            />
          )}
        </div>
        <Stack direction='row' spacing={2}>
          {children}
        </Stack>
      </GridToolbarContainer>
      <Divider />
    </div>
  )
}

GridToolbar.defaultProps = {
  hasColumns: true,
  hasFilters: true,
  hasExport: true,
  hasDensity: true
}

export const GridToolbarWithoutExport = (props) => {
  return (
    <GridToolbar {...props} hasExport={false} />
  )
}

export const GridToolbarWithoutDensity = (props) => {
  return (
    <GridToolbar {...props} hasDensity={false} />
  )
}

export const GridToolbarWithoutDensityExport = (props) => {
  return (
    <GridToolbar {...props} hasDensity={false} hasExport={false} />
  )
}

export default GridToolbar
