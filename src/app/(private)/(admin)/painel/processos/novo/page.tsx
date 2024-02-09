import React from 'react'
import { cookies } from 'next/headers'
import axios from 'axios'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser } from '@/types/atributes'
import Process from '@/views/Process'
import { categoriesTypes } from '@/types/enums'
import { credentialInputs } from '@/types/zodProcess'


export default async function CompleteProcess(){
    const getCategories: processProps[] = await axios.get('http://localhost:3333/api/categories',                 
        {
            headers: {
                Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
            },
        })
        .then(responde=>{
            // console.log(responde)
            return responde.data
        })
        .catch(error=>{
            // console.log(error)
            return []
        })

    const getLawyers: lawyerUser[] = await axios.get('http://localhost:3333/api/users',                 
        {
            headers: {
                Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
            },
        })
        .then(responde=>{
            // console.log(responde)
            return responde.data
        })
        .catch(error=>{
            console.log(error)
            return []
        })

        return(
            <Process lawyers={getLawyers} categories={getCategories} />
        )
}