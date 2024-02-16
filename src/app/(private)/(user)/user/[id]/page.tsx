import React from "react"
import { cookies } from 'next/headers'
import axios from 'axios'
import { usePathname, useRouter } from 'next/navigation';
import jwt from 'jsonwebtoken';

//Components
import Table from "@/components/LawyerProcessTable"

//types
import { processProps } from "@/types/processTableAtt"
import { useAuth } from "@/hooks/useAuth"

const HEADERS: Array<string> = ['Processo','Prazo','Matéria','Cliente','Status']


export default async function DefaultProcess(){
    
    const token = cookies().get('accessToken')?.value

    const { sub : id } = jwt.decode(token);

    const getData: processProps[] = await axios.get(`http://localhost:3333/api/processes?user=${id}`,                
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(response => {
                    return response.data
                })
                .catch(error=>{
                    console.log(error)
                    return []
                })

        return(
            <Table
                tableHeaders={HEADERS}
                type="default"
                tableData={getData} />
        )
}
