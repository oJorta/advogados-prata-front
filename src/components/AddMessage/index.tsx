'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'
import Cookies from 'js-cookie'
import axios from 'axios'
import toast from 'react-hot-toast'

import styles from './index.module.css'
import InputError from '../input (Error)'

import { AiOutlineClose } from 'react-icons/ai'
import { BiFile } from 'react-icons/bi'


type NewMessage = {
    content: string
    files: File[] | []
    error: string
}

export default function AddMessage({ setOpen, chatHistory }: any) {
    const { isAdmin, token } = useAuth()
    const processId = usePathname().split('/')[2]
    const [isLoading, setIsLoading] = useState(false)
    const [newMessage, setNewMessage] = useState<NewMessage>({
        content: '',
        files: [],
        error: ''
    })

    function handleTextareaChange(event: { target: { value: any } }) {
        setNewMessage({ ...newMessage, content: event.target.value });
        if(newMessage.content !== '') newMessage.error = ''
    }

    function handleFileChange(event: any) {
        setNewMessage({ ...newMessage, files: event.target.files });

    }

    function validateForm() {
        const { content, files } = newMessage

        if(content.trim() === '') {
            setNewMessage( { ...newMessage, error: 'Insira uma mensagem!' });
            return false;
        }

        /* if (!isAdmin && (content.trim() === '' || (!isAdmin && files.length === 0))) {
            setNewMessage( { ...newMessage, error: 'Insira uma mensagem e um arquivo!' });
            return false;
        } */

        setNewMessage({ ...newMessage, error: '' });
        return true;
    }

    async function handleSubmit(event: any) {
        event.preventDefault()
        setIsLoading(true)
        
        if(validateForm()) {
            if(isAdmin) {
                const { current } = chatHistory
                let messages : HTMLElement[] = Array.from(current.childNodes).filter((msg: any) => msg.className === 'Message_receivedContainer__jk5j_') as HTMLElement[]
                let lastMessage = messages[messages.length - 1]

                const process = await axios.get(`http://localhost:3333/api/process/${Number(processId)}`,
                    {
                        withCredentials: true
                    }
                )
                
                let revisionResponseId = null
                try {
                    const response = await axios.post(
                        'http://localhost:3333/api/revision-response',
                        {
                            "title": "Titulo",
                            "description": newMessage.content,
                            /* "revisionResponseDate": new Date(), */
                            "userId": process.data.userId,
                            "revisionRequestId": Number(lastMessage.id),
                        },
                        {
                            withCredentials: true
                        })

                        revisionResponseId = Number(response.data.id)
    
                        if (newMessage.files.length > 0) {
                            const files = Array.from(newMessage.files)
                            
                            for (const file of files) {
                                let fileName = file.name.replace(/[^a-zA-Z0-9._ ]/g, '')
                                let newFile = new File([file], fileName, { type: file.type })

                                try {
                                    await axios.post('http://localhost:3333/api/revision-response-documents', {
                                        file: newFile,
                                        revisionResponseId: revisionResponseId
                                    },
                                    {
                                        withCredentials: true,
                                        headers: {
                                            'Content-Type': 'multipart/form-data',
                                        },
                                    })
                                } catch (e) {
                                    throw e
                                }
                            }
                        }
                        
                        toast.success('Mensagem enviada com sucesso!')
                        setOpen(false)
                    
                    } catch (e: any) {
                        toast.error(`Erro ao enviar arquivo(s)! ${e.response.data.message}`)

                        revisionResponseId && (
                            await axios.delete(
                                `http://localhost:3333/api/revision-response/${revisionResponseId}`,
                                {
                                    withCredentials: true
                                })
                        )
                }
                setIsLoading(false)                    
                return
            }
            
            let revisionRequestId = null
            try {
                const response = await axios.post(
                    'http://localhost:3333/api/revision-request',
                    {
                        "title": "Titulo",
                        "description": newMessage.content,
                        /* "revisionRequestDate": new Date(), */
                        "processId": Number(processId)
                    },
                    {
                        withCredentials: true
                    }
                )

                revisionRequestId = Number(response.data.id)
                
                if (newMessage.files.length > 0) {
                    const files = Array.from(newMessage.files)
                    for (const file of files) {
                        let fileName = file.name.replace(/[^a-zA-Z0-9._ ]/g, '')
                        let newFile = new File([file], fileName, { type: file.type })

                        try {
                            await axios.post('http://localhost:3333/api/revision-request-documents', {
                                file: newFile,
                                revisionRequestId: revisionRequestId
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    'Content-Type': 'multipart/form-data',
                                },
                            })
                        } catch (e) {
                            throw e
                        }
                    }
                }
                
                toast.success('Mensagem enviada com sucesso!')
                setOpen(false)

            } catch (e: any) {
                toast.error(`Erro ao enviar mensagem! ${e.response.data.message}`)
                console.log(e)

                revisionRequestId && (
                    await axios.delete(
                        `http://localhost:3333/api/revision-request/${revisionRequestId}`,
                        {
                            withCredentials: true
                        })
                )
            }
            setIsLoading(false)
        }
        setIsLoading(false)
    }
    
    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <div className={styles.modalContainer}>
                <header>
                    <h1>MENSAGEM</h1>
                    <AiOutlineClose onClick={() => setOpen(false)} />
                </header>

                <form onSubmit={handleSubmit}>
                    <label>
                        <textarea
                            placeholder="Escreva aqui a sua mensagem..."
                            onChange={handleTextareaChange}
                            {... newMessage.error && {
                                style: {
                                    border: '1px solid red',
                                    boxShadow: '0 0 0 1px red'
                                }
                            }}
                            onFocus={() => { setNewMessage({...newMessage, error: ''})}}
                        >
                        </textarea>
                        {!!newMessage.error && <InputError text={newMessage.error} style={false} />}
                    </label>

                    <div className={styles.fileSelection}>
                    <label className={styles.labelInputFile}>
                        <BiFile />
                        <span>CLIQUE OU ARRASTE O(S) ANEXO(S)</span>
                        {!isAdmin ? (
                            <input type="file" onChange={handleFileChange} form="formModalProcess" multiple required />
                        ) : (
                            <input type="file" onChange={handleFileChange} form="formModalProcess" multiple/>
                        )}
                    </label>
                    
                    {newMessage.files.length > 0 && (
                        <span>
                            <strong>Arquivo(s) selecionado(s): </strong>
                            {Array.from(newMessage.files).map((file) => {
                                return (
                                    file.name + ' '
                                )
                            })}
                        </span>
                    )}
                    
                    </div>

                    <button className={styles.sendButton} type="submit">
                        ENVIAR
                    </button>
                </form>
            </div>
        </div>
    )
}
