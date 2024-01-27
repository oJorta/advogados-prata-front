import React from 'react'
import { cookies } from 'next/headers'
import axios from 'axios'

//Components
import Process from '@/views/upProcess'

//Types
import { lawyerUser, categoryUser, status } from '@/types/atributes'
import { backProcessDatas, credentialInputs } from '@/types/zodProcess'

//Functions
import { selectedStatus } from '@/functions/status'


export default async function UpdateProcess({ params }: { params: { id: string } }){
    const getCategories: categoryUser[] = await axios.get('http://localhost:3333/categories',                 
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
            // console.log(error)
            return error
        })

        const getLawyers: lawyerUser[] = await axios.get('http://localhost:3333/users',                 
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

        const getIdProcess: backProcessDatas = await axios.get(`http://localhost:3333/process/${params.id}`,                 
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

        const getFiles: any[] = await axios.get(`http://localhost:3333/process-documents-by-process/${params.id}`,                 
        {
            headers: {
                Authorization: `Bearer ${cookies().get('accessToken')?.value}`,
                Cookie:`accessToken=${cookies().get('accessToken')?.value}`,
            },
        })
        .then(response=>{
            console.log(response.data)
            return response.data
        })
        .catch(error=>{
            if(error){
                return []
            }
        })
        
        function addValues(arg: backProcessDatas){

            const initValues: credentialInputs = {
                processKey: arg.processKey,
                materia: arg.materia === null ? '' : arg.materia,
                deadline: arg.deadline === null ? new Date() : new Date(arg.deadline),
                name: arg.name === null ? '' : arg.name,
                information: arg.information === null ? '' : arg.information,
                categoryId: arg.categoryId,
                userId: arg.userId,
                status: selectedStatus(arg.status as status),
                isUrgent: arg.isUrgent,
                file: getFiles === undefined ? [] : getFiles
            }

            return initValues
        }

        function sendIdFiles(files: any[]){
            const onlyId: number[] = []
            files.map(el=>{
                onlyId.push(el.id)
            })
            return onlyId
        }

        return(
            <Process idProcess={params.id} initialValues={addValues(getIdProcess)} lawyers={getLawyers} categories={getCategories} idFiles={sendIdFiles(getFiles)} />
        )
}
