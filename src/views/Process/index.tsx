'use client'
import React, { useEffect, useState } from "react"
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

//Styles
import styles from './index.module.css'
import { addStyle} from '@/styles/inputStyles'
import { inputCheckedStatus, inputCheckedUrgent } from "@/styles/checkedStyles"

//Icons
import { BiFile } from 'react-icons/bi'
import { AiOutlineFolder } from "react-icons/ai"

//Components
import InputError from "@/components/input (Error)"

//Types
import { inputError } from "@/types/inputError"
import { Data, credentialInputs, formProcess } from "@/types/zodProcess"
import { lawyerUser, categoryUser } from "@/types/atributes"

//Enums
import { categoriesTypes } from "@/types/enums"
import Modal from "@/components/Modal (File)"


type processProps = {
    idProcess?: string,
    lawyers: lawyerUser[],
    categories: categoryUser[],
}

const defaultValues: credentialInputs = {
    processKey: '',
    matter: '',
    deadline: new Date(new Date().setMilliseconds(new Date().getMilliseconds() - 2)),
    name: '',
    description: '',
    categoryId: 0,
    userId: -1,
    status: categoriesTypes.Inicio,
    isUrgent: 0,
    file: []
}

export default function Process({ categories, lawyers }:processProps){
    const [inputProcess, setInputProcess] = useState<credentialInputs>(defaultValues)
    const [opitionalDate, setOpitionalDate] = useState<boolean>(false)
    const [inputLawyer, setInputLawyer] = useState<lawyerUser[]>([])
    const [checkFilesModal, setCheckFilesModal] = useState<boolean>(false)

    useEffect(() =>{

        if(inputProcess.categoryId === 0){
            setInputLawyer([])
        }
        else{
            axios.get(`http://localhost:3333/api/specialties?category=${inputProcess.categoryId}`,          
            {
                withCredentials: true,
            })
            .then(
                    res=>{
                        let selectedLawyers: lawyerUser[] = []
                        for(let law of res.data){
                                selectedLawyers.push(lawyers.find(el=>el.id === law.userId) as lawyerUser)
                        }
                        setInputLawyer(selectedLawyers)
                    }
                )
                .catch(e =>{
                    console.log(e)
                    setInputLawyer([])
                })
            }

    },[inputProcess.categoryId, lawyers])
    
    const [inputError, setInputError] = useState<inputError>({
        processKey: { error: false, onFocus: false, textError: '' },
        matter: { error: false, onFocus: false, textError: '' },
        deadline: { error: false, onFocus: false, textError: '' },
        name: { error: false, onFocus: false, textError: '' },
        description: { error: false, onFocus: false, textError: '' },
        categoryId: { error: false, onFocus: false, textError: '' },
        userId: { error: false, onFocus: false, textError: '' },
        file: { error: false, onFocus: false, textError: '' },
    })

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>){
        ev.preventDefault()
        const validation = formProcess.safeParse(inputProcess)
        console.log(inputProcess)
        console.log(Array.from(validation.data.file))

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
                matter: validation.data.matter,
                distributionDate: new Date().toISOString().substring(0, 10),
                deadline: validation.data.deadline
                    ?.toISOString()
                    .substring(0, 10),
                description: validation.data.description,
                userId: validation.data.userId,
                status: validation.data.status,
                isUrgent: validation.data.isUrgent,
                categoryId: validation.data.categoryId,
            }

            for (let val in data) {
                if (data[val as keyof Data] === '') {
                    delete data[val as keyof Data]
                }
            }

            if (opitionalDate === false) {
                delete data.deadline
            }

            if (validation.data.userId === 0) {
                delete data.userId
            }
            
            let createProcessSuccess: boolean = false
            let processId = null
            try {
                const response = await axios
                .post('http://localhost:3333/api/process', data,
                {
                    withCredentials: true,
                })

                processId = Number(response.data.id)
                
                const files = Array.from(validation.data.file)
                console.log(processId)
                for (const file of files) {
                    let fileName = file.name.replace(/[^a-zA-Z0-9._ ]/g, '')
                    let newFile = new File([file], fileName, { type: file.type })
                    console.log(newFile)

                    try {
                        await axios
                        .post(
                            'http://localhost:3333/api/process-document',
                            {
                                processId: processId,
                                file: newFile,
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            }
                        )
                    }catch(e){
                        throw e
                    }
                    
                    toast.success('Processo Criado com sucesso!')
                    createProcessSuccess = true
                    return response.data.id
                }
            } catch (e: any) {
                console.log(e)
                toast.error(`Erro ao criar processo! ${e.response.data.message}`)

                processId && axios.delete(`http://localhost:3333/api/process/${processId}`, { withCredentials: true }).then(res => console.log(res)).catch(e => console.log(e))
            }

            
            if (createProcessSuccess) {
                window.location.reload()
            }
        }

    }


    return(
        <>
            <Modal isOpen={checkFilesModal} setOpen={setCheckFilesModal} process={inputProcess} setFile={setInputProcess} />
            <section className={styles.container}>

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
                        matter
                        */}

                        <label className={styles.labelInput}>
                            <span>Matéria:</span>
                        <input type="text"
                        onFocus={()=>setInputError({... inputError, matter:{error: false, onFocus: true, textError: ''}})} 

                        value={inputProcess.matter} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                            setInputProcess({... inputProcess, matter: el.currentTarget.value})
                        }} 
                        style={addStyle(inputError.matter.error)}/>

                        {inputError.matter.error && <InputError text={inputError.matter.textError} style={true} />}
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
                        onFocus={()=>setInputError({... inputError, description:{error: false, onFocus: true, textError: ''}})}
                        
                        value={inputProcess.description} onChange={(el : React.FormEvent<HTMLTextAreaElement>)=>{
                            setInputProcess({... inputProcess, description: el.currentTarget.value})
                        }} 
                        style={addStyle(inputError.description.error)}/>

                        {inputError.description.error && <InputError text={inputError.description.textError} style={true} />}
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
                                    <input
                                        type="button"
                                        style={inputCheckedUrgent(true, !!(inputProcess.isUrgent))}
                                        onClick={()=>{ setInputProcess({... inputProcess, isUrgent: 1}) }}
                                    />
                                    <span>Sim</span>
                                </div>

                                <div className={styles.labelCheckbox}>
                                    <input
                                        type="button"
                                        style={inputCheckedUrgent(false, !!(inputProcess.isUrgent))} 
                                        onClick={()=>{ setInputProcess({... inputProcess, isUrgent: 0})} }
                                    />
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
                        <a onClick={()=>setCheckFilesModal(!checkFilesModal)}><AiOutlineFolder /></a>
                    </div>
                        
                        <input className={styles.submitButton} type='submit' form='formModalProcess' value='CRIAR NOVO PROCESSO' />
                </form>
            </section>
        </>
    )
}