import React from 'react'
import { cookies } from 'next/headers'
import axios from 'axios'

//Components
import Table from '@/components/AdminProcessTable'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser, categoryUser } from '@/types/atributes'


const HEADERS: Array<string> = ['Processo','Matéria','Cliente','Advogado','Conclusão']


export default async function CompleteProcess(){
    const getData: processProps[] = await axios
        .get(
            'http://localhost:3333/api/processes?withUser=true&withCategory=true',
            {
                headers: {
                    Authorization: `Bearer ${
                        cookies().get('accessToken')?.value
                    }`,
                    Cookie: `accessToken=${
                        cookies().get('accessToken')?.value
                    }`,
                },
            }
        )
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            console.log(error)
            return []
        })

        return (
            <Table
                tableHeaders={HEADERS}
                type="complete"
                tableData={getData}
            />
        )
}