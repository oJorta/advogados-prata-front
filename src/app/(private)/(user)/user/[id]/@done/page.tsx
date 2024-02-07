import React from 'react'
import { cookies } from 'next/headers'
import styles from './page.module.css'
import axios from 'axios'

//Components
import Table from '@/components/Table (Lawyer)'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser } from '@/types/atributes'


const Header: Array<string> = ['Processo','Cliente','Matéria','Data']


export default async function CompleteProcess(){
    const getData: processProps[] = await axios.get('http://localhost:3333/api/processes',                 
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

        return(
            <Table head={Header} type='complete' dbData={getData} />
        )
}