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
    const getCategories: processProps[] = await axios.get('http://localhost:3333/categories',                 
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

    const getLawyers: lawyerUser[] = await axios.get('http://localhost:3333/users',                 
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

        const initValues: credentialInputs = {
                    processKey: '',
                    materia: '',
                    deadline: new Date(new Date().setMilliseconds(new Date().getMilliseconds() - 2)),
                    name: '',
                    information: '',
                    categoryId: 0,
                    userId: -1,
                    status: categoriesTypes.Inicio,
                    isUrgent: false,
                    file: []
                }
        return(
            <Process initialValues={initValues} lawyers={getLawyers} categories={getCategories} />
        )
}