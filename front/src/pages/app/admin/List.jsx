import { useQuery } from "@apollo/client"
// import { Route, Routes } from "react-router-dom"
import { queryTest } from './graphQL'
import DataGrid from '../../../../Components/DataGrid'
const columns = [
    {
        field: 'pseudo',
        headerName: 'Pseudo',
        flex: 1
    },
    {
        field: 'nationality',
        headerName: 'Nationalité',
        width: 1
    },
    {
        field: 'number',
        headerName: 'Numéro',
        flex: 1
    },
    {
        field: 'teamActual',
        headerName: 'Team Actuelle',
        width: 1
    },
    // {
    //     field: 'actualLeague',
    //     headerName: 'Ligue Actuelle',
    //     flex: 1
    // },
    // {
    //     field: 'birthDate',
    //     headerName: 'Age',
    //     width: 1
    // }
]
const List = (props) => {
    const { data, loading, error } = props
    return (
        <DataGrid
          columns={columns}
          rows={data?.leagueDriver || []}
          loading={loading}
          error={error}
       />
    )
}

export default List
