'use client'
import React from 'react'
import styles from './index.module.css'
import axios from 'axios'
import Cookies from 'js-cookie'

//Icons
import { BiX } from 'react-icons/bi'

//Types
import { stateModal } from '@/types/modal'
import toast from 'react-hot-toast'


type modalProps = {
    isOpen: stateModal,
    setOpen: (isOpen: stateModal) =>void
}

export default function ModalDelete({isOpen, setOpen}: modalProps) {

    async function DeleteProcess(){
        
        await axios.delete('http://localhost:3333/api/processes',
            {
            data:{
                ids: isOpen.id,
            }, 
            headers:{
                Authorization: `Bearer ${Cookies.get('accessToken')}`
            }
            })
            .then(response=>{
                toast.success('Processo(s) deletado(s) com sucesso!')
            })
            .catch(error=>{
                console.log(error)
            })
        window.location.reload()
    }

    if(isOpen.open){
        return(
            <div className={styles.backgroundModal}>
            
            <div className={styles.modal}>
                <div className={styles.headerModal}>
                    <a onClick={()=>setOpen({open: !isOpen.open, id: isOpen.id})}>
                        < BiX />
                    </a>
                </div>
                    <h1>Tem certeza que quer deletar esse(s) processo(s)?</h1>
                    <div className={styles.containerBtn}>
                        <button onClick={DeleteProcess} className={styles.btnUpdate}>Sim</button>
                        <button className={styles.btnDelete} onClick={()=>{
                            setOpen({open: !isOpen.open, id: isOpen.id})
                        }}>Não</button>
                    </div>
            </div>
        </div>
        )
    }
    else{
        return <></>
    }
}
