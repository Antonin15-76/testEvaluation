import React from 'react'
import { useQuery } from "@apollo/client"
import List from "./List"
import Menu from "./Menu"
import {  } from './graphQL'

const Team = () => {
    const { data, loading, error } = useQuery()

    return (
        <>
            <Menu />
            <List data={data} error={error} loading={loading} />
        </>
        
    )
}

export default Team
