import React from "react"
import { cookies } from 'next/headers'
import axios from 'axios'

//Components
import Table from "@/components/Table (Process)"

//types
import { processProps } from "@/types/processTableAtt"
import { categoryUser, lawyerUser } from "@/types/atributes"

const Header: Array<string> = ['Processo','Matéria','Cliente','Advogado','Categoria','Prazo','Status']


export default async function DefaultProcess(){
    const getData: processProps[] = await axios.get('http://localhost:3333/processes',                 
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

    const getLawyers: lawyerUser[] = await axios.get('http://localhost:3333/users',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(responde=>{
                    // console.log(responde)
                    return responde.data as lawyerUser[]
                })
                .catch(error=>{
                    console.log(error)
                    return []
                })

    const getCategories: categoryUser[] = await axios.get('http://localhost:3333/categories',                 
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
            <Table head={Header} type="default" dbLawyer={getLawyers} dbCategory={getCategories} dbData={getData}/>
        )
}
