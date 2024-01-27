'use client'
import React, { useState, useEffect } from "react"
import axios from 'axios'
import Cookies from 'js-cookie'

//Styles
import styles from './index.module.css'
import { addStyle} from '@/styles/inputStyles'
import { inputCheckedStatus, inputCheckedUrgent } from "@/styles/checkedStyles"

//Icons
import { AiOutlineFolder } from "react-icons/ai"
import { BiFile } from 'react-icons/bi'
import toast from 'react-hot-toast'

//Components
import InputError from "@/components/input (Error)"
import Modal from "@/components/Modal (File)"

//Types
import { inputError } from "@/types/inputError"
import { Data, credentialInputs, formProcess } from "@/types/zodProcess"
import { lawyerUser, categoryUser } from "@/types/atributes"

//Enums
import { categoriesTypes } from "@/types/enums"
import { useRouter } from "next/navigation"


type processProps = {
    idProcess: string,
    lawyers: lawyerUser[],
    categories: categoryUser[],
    initialValues: credentialInputs,
    idFiles: number[]
}

export default function Process({idProcess, initialValues, categories, lawyers, idFiles }:processProps){
    const router = useRouter()
    const [inputProcess, setInputProcess] = useState<credentialInputs>(initialValues)
    const [opitionalDate, setOpitionalDate] = useState<boolean>(false)
    const [inputLawyer, setInputLawyer] = useState<lawyerUser[]>([])
    const [checkFilesModal, setCheckFilesModal] = useState<boolean>(false)

    useEffect(() =>{

        if(inputProcess.categoryId === 0){
            setInputLawyer([])
        }
        else{
            axios.get(`http://localhost:3333/specialties-by-category/${inputProcess.categoryId}`,          
            {
                headers:{
                    Authorization: `Bearer ${Cookies.get('accessToken')}`
                }})
            .then(
                    res=>{
                        let selectedLawyers: lawyerUser[] = []
                        for(let law of res.data){
                            selectedLawyers.push(lawyers.find(el=>el.id === law.userId) as lawyerUser)
                        }
                        setInputLawyer(selectedLawyers)
                    }
                )
                .catch(err=>{
                    if(err.response.status === 404){

                    }
                    setInputLawyer([])
                })
            }

    },[inputProcess.categoryId, lawyers])
    
    const [inputError, setInputError] = useState<inputError>({
        processKey: {error: false, onFocus: false, textError:''},
        materia: {error: false, onFocus: false, textError:''},
        deadline: {error: false, onFocus: false, textError:''},
        name: {error: false, onFocus: false, textError:''},
        document: {error: false, onFocus: false, textError:''},
        information: {error: false, onFocus: false, textError:''},
        categoryId: {error: false, onFocus: false, textError:''},
        userId: {error: false, onFocus: false, textError:''},
        file: {error: false, onFocus: false, textError:''},
    })

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>){
        ev.preventDefault()
        const validation = formProcess.safeParse(inputProcess)

        if(!validation.success){

            let setError: inputError = inputError

            validation.error.issues.map(el=>{

                if(inputError[el.path[0].toString()].error == false){
                    setError = {... setError, [el.path[0].toString()]:{error: true, onFocus: false, textError: el.message}}
                }
            })
            setInputError(setError)
        }
        else{
            
            const data: Data = {
                processKey: validation.data.processKey,
                name: validation.data.name,
                materia: validation.data.materia,
                distributionDate: new Date().toISOString().substring(0, 10),
                deadline: validation.data.deadline?.toISOString().substring(0, 10),
                information: validation.data.information,
                userId: validation.data.userId,
                status: validation.data.status,
                isUrgent: validation.data.isUrgent,
                categoryId: validation.data.categoryId,
            }

            for(let val in data){
                if(data[val as keyof Data] === ''){
                    delete data[val as keyof Data]
                }
            }

            if(opitionalDate === false){
                delete data.deadline
            }

            if(validation.data.userId === 0 || validation.data.userId === null){
                delete data.userId
            }
            let updateProcessSuccess: boolean = false
            const id: number = await axios.patch(`http://localhost:3333/process/${idProcess}`,
                data,
                {
                    headers:{
                        Authorization: `Bearer ${Cookies.get('accessToken')}`
                    }
                })
                .then(response=>{
                    toast.success('Processo atualizado com sucesso!')
                    updateProcessSuccess = true
                    return response.data.id
                })
                .catch(error=>{
                    console.log(error)
                    toast.error(error.response.data.message)
                })
                
                for(const file of validation.data.file as File[]){
                    if(!file.id){

                        await axios.post('http://localhost:3333/process-documents',
                            {
                                processId: id,
                                file: file,
                                
                            },
                            {headers:{
                                Authorization: `Bearer ${Cookies.get('accessToken')}`,
                                'Content-Type': 'multipart/form-data'
                            }}
                            )
                            .then(response=>{
                                if(response.status === 201){
                                    toast.success('Arquivo Criado com sucesso!')
                                }
                            })
                            .catch(error=>{
                                console.log(error)
                                toast.error(error.response.data.message)
                            })
                    }
                }
                if(updateProcessSuccess){
                    window.location.reload()
                }
        }
    }

    return(
        <>
            <Modal isOpen={checkFilesModal} setOpen={setCheckFilesModal} process={inputProcess} setFile={setInputProcess} />
            <section className={styles.backgroundNewProcess}>

                <form className={styles.form} id='formModalProcess' onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className={styles.formContainer}>

                        {/*
                        PROCESSO
                        */}

                        <label className={styles.labelInput}>
                            <span>Chave Única:</span>
                            <input type="text"
                            onFocus={()=>setInputError({... inputError, processKey:{error: false, onFocus: true, textError: ''}})} 

                            value={inputProcess.processKey} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                                setInputProcess({... inputProcess, processKey: el.currentTarget.value})
                            }} 
                            style={addStyle(inputError.processKey.error)}/>

                            {inputError.processKey.error && <InputError text={inputError.processKey.textError} style={true} />}
                        </label>


                        {/*
                        MATERIA
                        */}

                        <label className={styles.labelInput}>
                            <span>Matéria:</span>
                        <input type="text"
                        onFocus={()=>setInputError({... inputError, materia:{error: false, onFocus: true, textError: ''}})} 

                        value={inputProcess.materia} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                            setInputProcess({... inputProcess, materia: el.currentTarget.value})
                        }} 
                        style={addStyle(inputError.materia.error)}/>

                        {inputError.materia.error && <InputError text={inputError.materia.textError} style={true} />}
                        </label>
                        
                        {/*
                        PRAZO
                        */}

                        <label className={styles.labelInput}>
                            <span>Prazo:</span>
                        <div className={styles.containerDate}>
                            <input type="date"
                            onFocus={()=>setInputError({... inputError, deadline:{error: false, onFocus: true, textError: ''}})}
                            
                            value={inputProcess.deadline?.toISOString().substring(0, 10)} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                                setInputProcess({... inputProcess, deadline: new Date(el.currentTarget.value)})
                            }} 
                            style={addStyle(inputError.deadline.error)}/>
                        
                            <div>
                                <input type="checkbox" onChange={(el: React.ChangeEvent<HTMLInputElement>)=>{
                                    setOpitionalDate(!opitionalDate)
                                }}/>
                                <p>Adicionar Prazo</p>
                            </div>

                        </div>

                        {inputError.deadline.error && <InputError text={inputError.deadline.textError} style={true} />}
                        </label>

                        {/*
                        CLIENTE
                        */}

                        <label className={styles.labelInput}>
                            <span>Cliente:</span>
                        <input type="text"
                        onFocus={()=>setInputError({... inputError, name:{error: false, onFocus: true, textError: ''}})}
                        
                        value={inputProcess.name} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                            setInputProcess({... inputProcess, name: el.currentTarget.value})
                        }} 
                        style={addStyle(inputError.name.error)}/>

                        {inputError.name.error && <InputError text={inputError.name.textError} style={true} />}
                        </label>


                        {/*
                        OBSERVAÇÃO
                        */}

                        <label className={styles.labelInput}>
                            <span>Observação:</span>           
                        <textarea 
                        onFocus={()=>setInputError({... inputError, information:{error: false, onFocus: true, textError: ''}})}
                        
                        value={inputProcess.information} onChange={(el : React.FormEvent<HTMLTextAreaElement>)=>{
                            setInputProcess({... inputProcess, information: el.currentTarget.value})
                        }} 
                        style={addStyle(inputError.information.error)}/>

                        {inputError.information.error && <InputError text={inputError.information.textError} style={true} />}
                        </label>

                        {/*
                        CATEGORIA
                        */}

                        <label className={styles.labelInput}>
                            <span>Categoria:</span>
                            <select 
                            onFocus={()=>setInputError({... inputError, categoryId:{error: false, onFocus: true, textError: ''}})}

                                value={inputProcess.categoryId} onChange={(el : React.FormEvent<HTMLSelectElement>)=>{
                                    setInputProcess({... inputProcess, categoryId: Number(el.currentTarget.value)})
                                }} 
                                style={addStyle(inputError.categoryId.error)}>
                                    <option value={0}>Selecione uma Categoria</option>
                                    {categories.map((val)=>{
                                        return <option key={val.id} value={val.id}>{val.name}</option>
                                    })}
                            </select>
                            {inputError.categoryId.error && <InputError text={inputError.categoryId.textError} style={true} />}
                        </label>

                        {/*
                        ADVOGADO
                        */}

                        <label className={styles.labelInput}>
                            <span>Advogado:</span>
                        <select 
                        onFocus={()=>setInputError({... inputError, userId:{error: false, onFocus: true, textError: ''}})}

                        value={inputProcess.userId} onChange={(el : React.ChangeEvent<HTMLSelectElement>)=>{
                            setInputProcess({... inputProcess, userId: Number(el.currentTarget.value)})
                        }} 
                        style={addStyle(inputError.userId.error)}>
                            <option value={-1}>Selecione um Advogado</option>
                            <option value={0}>Sem Advogado</option>
                            {inputLawyer.map((val)=>{
                                return <option key={val.id} value={val.id}>{val.name}</option>
                            })}
                        </select>
                        {inputError.userId.error && <InputError text={inputError.userId.textError} style={true} />}
                        </label>

                        {/*
                        STATUS
                        */}

                        <div className={styles.labelInput} style={{justifyContent:'flex-start'}}>
                            <span>Status:</span>
                            <div className={styles.containerCheckboxStatus} style={{width:'60%'}}>
                                <div className={styles.labelCheckbox}>
                                    <input type="button" style={inputCheckedStatus(categoriesTypes.Inicio, inputProcess.status)} onClick={()=>{
                                        setInputProcess({... inputProcess, status: categoriesTypes.Inicio})}}/>
                                    <span>Em inicialização</span>
                                </div>
                                <div className={styles.labelCheckbox}>
                                    <input type="button" style={inputCheckedStatus(categoriesTypes.Aguardo, inputProcess.status)} onClick={()=>{
                                        setInputProcess({... inputProcess, status: categoriesTypes.Aguardo})}}/>
                                    <span>Em aguardo</span>
                                </div>
                            </div>              
                        </div>

                        {/*
                        URGENTE
                        */}

                        <div className={styles.labelInput} style={{justifyContent:'flex-start'}}>
                            <span>É urgente?</span>
                            <div className={styles.containerCheckboxStatus} style={{width:'60%'}}>
                                <div className={styles.labelCheckbox} >
                                    <input type="button" style={inputCheckedUrgent(true, inputProcess.isUrgent)} onClick={()=>{
                                        setInputProcess({... inputProcess, isUrgent: true})}}/>
                                    <span>Sim</span>
                                </div>

                                <div className={styles.labelCheckbox}>
                                    <input type="button" style={inputCheckedUrgent(false, inputProcess.isUrgent)} onClick={()=>{
                                        setInputProcess({... inputProcess, isUrgent: false})}}/>
                                    <span>Não</span>
                                </div>
                            </div>              
                        </div>

                    </div>

                        {/*
                        ARQUIVO
                        */}

                    <div className={styles.containerFiles}>

                        <label className={styles.labelInputFile}>
                            {inputProcess.file.length > 0 && <span className={styles.countFiles}>{inputProcess.file.length}</span>}
                            < BiFile />
                            <span>CLIQUE OU ARRASTE O(S) ANEXO(S)</span>

                        <input type="file" form='formModalProcess' onChange={(el : React.FormEvent<HTMLInputElement>)=>{

                            if(el.currentTarget.files){
                                setInputProcess({... inputProcess, file: inputProcess.file.concat(Array.from(el.currentTarget.files))})
                            }
                            
                            // setInputProcess({... inputProcess, file: el.currentTarget.files})
                        }}/>
                        </label>
                        <a onClick={()=>setCheckFilesModal(!checkFilesModal)} ><AiOutlineFolder /></a>
                    </div>
                        
                        <input className={styles.labelInputBtn} type='submit' form='formModalProcess' value='ATUALIZAR PROCESSO' />
                </form>
            </section>
        </>
    )
}
