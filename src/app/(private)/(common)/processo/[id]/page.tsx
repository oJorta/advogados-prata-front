'use client'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Cookies from 'js-cookie'
import styles from './page.module.css'
import PrivateHeader from '@/components/PrivateHeader'
import Message from '@/components/Message'
import AddMessage from '@/components/AddMessage'
import ProcessOptions from '@/components/ProcessOptions'

export default function Processo() {
    const path = usePathname()
    const processId = Number(path.split('/')[2])
    /* const token = document.cookie.split('=')[1] */
    const token = Cookies.get('accessToken')
    const { user, isAdmin } = useAuth()
    const { back } = useRouter()

    const [process, setProcess] = useState({} as any)
    const [revisionRequests, setRevisionRequests] = useState([])
    const [revisionResponses, setRevisionResponses] = useState([])
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [conclusionModalIsOpen, setConclusionModalIsOpen] = useState(false)
    const [reopenModalIsOpen, setReopenModalIsOpen] = useState(false)

    const chatRef = useRef<HTMLDivElement>(null)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const getProcess = async () => {
        const { data } = await axios
            .get(`http://localhost:3333/process/${processId}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${Cookies.get('accessToken')}`,
                },
            })
        
        if (user?.role === 'lawyer' && data.userId !== user?.id) back()

        return data
    }
    
    const getRevisionRequests = async () => {
        const { data } = await axios
        .get('http://localhost:3333/revision-requests', {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${Cookies.get('accessToken')}`,
            },
        })
        return data
    }
    const getRevisionResponses = async () => {
        const { data } = await axios
        .get(`http://localhost:3333/revision-responses-by-process/${processId}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        return data
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        const getData = async () => {
            const [processData, revisionRequestsData, revisionResponsesData] = await Promise.all([getProcess(), getRevisionRequests(), getRevisionResponses()])

            setProcess(processData)

            const filteredData = revisionRequestsData.filter((item: { processId: number }) => item.processId === processId)
            setRevisionRequests(filteredData)

            setRevisionResponses(revisionResponsesData)
        }

        getData()
    }, [modalIsOpen])

    useEffect(() => {
        const getData = async () => {
            const processData = await getProcess()
            setProcess(processData)
        }
        getData()
    }, [conclusionModalIsOpen, reopenModalIsOpen])

    useEffect(() => {
        scrollToBottom()
    }, [revisionRequests, revisionResponses])

    return (
        <>

            <div className={styles.container}>
                <div className={styles.chatContainer} ref={chatRef}>
                    {revisionRequests.map((request: any) => {
                        const responses : any = revisionResponses.filter((response: any) => response.revisionRequestId === request.id)

                        return (
                            <>
                                <Message key={request.key} id={Number(request.key)} type='request' data={request} />
                                {responses && responses.map((response: any) => <Message key={response.key} id={Number(response.key)} type='response' data={response} />)}
                            </>
                        )
                    })}
                    {process.status === 'Concluído' && (
                        <div className={styles.conclusionContainer}>
                            <h3>PARECER DO PROCESSO:</h3>
                            <p>{process.seem}</p>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className={styles.optionsContainer}>
                    <button
                        onClick={() => { setModalIsOpen(!modalIsOpen) }}
                        className={styles.newMessageBtn}
                        disabled={process.status === 'Concluído' || (isAdmin && revisionRequests.length === 0)}
                    >
                        NOVA MENSAGEM
                    </button>
                    
                    {isAdmin && process.status !== 'Concluído' && (
                        <button
                            onClick={() => { setConclusionModalIsOpen(!conclusionModalIsOpen) }}
                            className={styles.conclusionBtn}
                            disabled={process.status === 'Concluído' || (isAdmin && revisionRequests.length === 0)}
                        >
                            CONCLUIR PROCESSO
                        </button>
                    )}

                    {isAdmin && process.status === 'Concluído' && (
                        <button
                            onClick={() => { setReopenModalIsOpen(!reopenModalIsOpen) }}
                            className={styles.conclusionBtn}
                        >
                            REABRIR PROCESSO
                        </button>
                    )}
                </div>
                
                {modalIsOpen && <AddMessage setOpen={setModalIsOpen} chatHistory={chatRef}/>}
                {conclusionModalIsOpen && (
                    <ProcessOptions setOpen={setConclusionModalIsOpen} type='conclude' />
                )}
                {reopenModalIsOpen && (
                    <ProcessOptions setOpen={setReopenModalIsOpen} type='open' />
                )}
            </div>
        </>
    )
}
