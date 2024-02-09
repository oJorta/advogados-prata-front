import React from 'react'
import { cookies } from 'next/headers'
import axios from 'axios'

//Components
import Table from '@/components/Table (Process)'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser, categoryUser } from '@/types/atributes'


const Header: Array<string> = ['Processo','Matéria','Cliente','Advogado','Data']


export default async function CompleteProcess(){
    const getData: processProps[] = await axios.get('http://localhost:3333/api/processes',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log(error)
                    return []
                })

            const getLawyers: lawyerUser[] = await axios.get('http://localhost:3333/api/users',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log(error)
                    return []
                })

            const getCategories: categoryUser[] = await axios.get('http://localhost:3333/api/categories',                 
                {
                    headers: {
                        Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                        Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
                    },
                })
                .then(response => {
                    return response.data
                })
                .catch(error => {
                    console.log(error)
                    return []
                })

        return(
            <Table head={Header} type='complete' dbLawyer={getLawyers} dbCategory={getCategories} dbData={getData}/>
        )
}