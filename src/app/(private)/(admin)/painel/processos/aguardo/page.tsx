import React from 'react'
import { cookies } from 'next/headers'
import axios from 'axios'

//Compponents
import Table from '@/components/AdminProcessTable'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser, categoryUser } from '@/types/atributes'

const Header: Array<string> = ['Processo','Matéria','Cliente','Categoria','Prazo','Inclusão','Status']


export default async function WaitingProcess(){
    const getData: processProps[] = await axios.get('http://localhost:3333/api/processes?withUser=true&withCategory=true',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(responde=>{
                    return responde.data
                })
                .catch(error=>{
                    console.log(error)
                    return []
                })

        return (
            <Table
                tableHeaders={Header}
                type="awaiting"
                tableData={getData}
            />
        )
}