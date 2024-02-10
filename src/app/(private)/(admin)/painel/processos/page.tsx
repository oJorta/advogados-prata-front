import React from "react"
import { cookies } from 'next/headers'
import axios from 'axios'

//Components
import Table from "@/components/AdminProcessTable"

//types
import { processProps } from "@/types/processTableAtt"
import { categoryUser, lawyerUser } from "@/types/atributes"

const HEADERS = [ 'Processo', 'Matéria', 'Cliente', 'Advogado', 'Categoria', 'Prazo', 'Status' ]

export default async function DefaultProcess(){
    const getData: processProps[] = await axios.get('http://localhost:3333/api/processes?withUser=true&withCategory=true',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(response => {
                    return response.data
                })
                .catch(error=> {
                    console.log(error)
                    return []
                })

        return (
            <Table
                tableHeaders={HEADERS}
                type="default"
                tableData={getData}
            />
        )
}
