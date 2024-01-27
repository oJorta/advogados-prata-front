'use client'
import React,{ useState } from 'react'
import styles from './index.module.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
//Icons
import { BiX } from 'react-icons/bi'

//Types
import { stateFileModal } from '@/types/modal'
import { credentialInputs } from '@/types/zodProcess'
import { file } from '@/types/atributes'


type modalFileProps = {
    isOpen: boolean,
    setOpen: (isOpen: boolean) =>void
    process: credentialInputs,
    setFile: (arg: credentialInputs)=>void
}

export default function Modal({isOpen, setOpen, process, setFile}: modalFileProps) {
    
    function editFiles(arg: number){
        const file: File[] = process.file
        const verifyFile: File[]  = file.splice(arg, 1)
        if(verifyFile[0].id){

            axios.delete(`http://localhost:3333/process-document/${verifyFile[0].id}`,
            {
                headers:{
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                    'Content-Type': 'multipart/form-data'
            }}
        )
        .then(response=>{

            if(response.status === 200){
                toast.success('Arquivo deletado com sucesso!')
            }
        })
        .catch(error=>{
            console.log(error)
            if(error.response.data.statusCode){
                toast.error('Arquivo não encontrado')
            }
        })
        }
        setFile({...process, file: file})
    }

    if(isOpen){
        return(
            <div className={styles.backgroundModal}>
            
                <div className={styles.modal}>
                    <div className={styles.headerModal}>
                        <span>Arquivos Anexados</span>
                        <a onClick={()=>setOpen(!isOpen)}>
                            < BiX />
                        </a>
                    </div>
                    <hr />
                        <div className={styles.containerBtn}>
                            {process.file.length === 0 ? <h1 className={styles.noneArray}>Não há arquivos</h1> : process.file.map((el, index)=>{
                                return(
                                    <div key={index}>
                                        <p>{el.name}</p>
                                        <a onClick={()=>editFiles(index)}>< BiX /></a>
                                    </div>
                                )
                            })}
                        </div>
                    <hr className={styles.modalHr}/>
                    <div className={styles.footerModal}>
                        <button onClick={()=>setOpen(!isOpen)}>Fechar</button>
                    </div>
                </div>
            </div>
        )
    }
    else{
        return <></>
    }
}
