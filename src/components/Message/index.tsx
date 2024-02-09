import styles from './index.module.css'
import { GrDocumentPdf } from 'react-icons/gr'

import { useAuth } from '@/hooks/useAuth'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { usePathname } from 'next/navigation'

type MessageProps = {
    id: number
    type: 'request' | 'response' | 'information'
    data: {
        id: string
        title: string
        orientation?: string
        description?: string
        createdAt?: string
        userId?: number
        revisionRequestId?: number
        processId?: number
        information?: string
    }
}

export default function Message({ type, data }: MessageProps ) {
    const { user, token } = useAuth()
    const path = usePathname()
    const processId = Number(path.split('/')[2])
    const [process, setProcess] = useState({} as any)
    const [lawyer, setLawyer] = useState({} as any)
    const [documents, setDocuments] = useState([])
    const [files, setFiles] = useState([])

    useEffect(() => {
        const getData = async () => { 
            if(type === 'request') {
                const documents = await axios.get(`http://localhost:3333/api/revision-request-documents?process=${processId}`,
                {
                    withCredentials: true
                })
                setDocuments(documents.data)
                /* setDocuments(documents.data.filter((document: any) => document.revisionRequestId === data.id)) */
            }
            if(type === 'response') {
                const documents = await axios.get(`http://localhost:3333/api/revision-response-documents?process=${processId}`,
                {
                    withCredentials: true
                })
                setDocuments(documents.data)
                /* setDocuments(documents.data.filter((document: any) => document.revisionResponseId === data.id)) */
            }

            const process = await axios.get(`http://localhost:3333/api/process/${Number(processId)}`,
            {
                withCredentials: true
            })
            setProcess(process.data)

            const user = await axios.get(
                `http://localhost:3333/api/user/${process.data.userId}`,
                {
                    withCredentials: true
                }
            )
            setLawyer(user.data)
        }
        getData()
        console.log(data)
    }, [])

    function handleFileDownload (fileLink: RequestInfo | URL, fileName: string) {
        fetch(fileLink).then((response) => {
            response.blob().then((blob) => {
                const fileURL = window.URL.createObjectURL(blob)

                let a = document.createElement("a")
                a.href = fileURL;
                a.download = fileName
                a.click()
            })
        })
    }

    return (
        <>
            {type === 'information' && (
                <div className={styles.informationContainer}>
                    <p>Observação</p>
                    <div className={styles.informationMessageContainer}>
                        <p>{data.information}</p>
                    </div>
                    <hr />
                </div>
            )}

            {type !== 'information' && user?.role === 'lawyer' && (
                type === 'request' ? (
                    <div className={styles.sentContainer} id={String(data.id)}>
                        <p>{`${user.name} (Você)`}</p>
                        <div className={styles.sentMessageContainer}>
                            <p>{data.description}</p>
                        </div>
                        {documents.map((document: any) => {
                            return (
                                <div key={document.id} className={styles.sentDocumentContainer}>
                                    <GrDocumentPdf />
                                    <button 
                                        onClick={() => handleFileDownload(document.filePath, document.name)}
                                    >
                                        {document.name}
                                    </button>
                                </div>
                            )
                        })}
                        <p className={styles.dateAndTime}>
                            {data.createdAt
                                ?.split('T')[0]
                                .split('-')
                                .reverse()
                                .join('/')}{' '}
                            •{' '}
                            {data.createdAt
                                ?.split('T')[1]
                                .split('.')[0]
                                .slice(0, 5)}
                        </p>
                        <hr />
                    </div>
                ) : (
                    <div className={styles.receivedContainer} id={String(data.revisionRequestId)}>
                        <p>{'ADM'}</p>
                        <div className={styles.receivedMessageContainer}>
                            <p>{data.description}</p>
                        </div>
                        {documents.map((document: any) => {
                            return (
                                <div key={document.id} className={styles.receivedDocumentContainer}>
                                    <GrDocumentPdf />
                                    <button 
                                        onClick={() => handleFileDownload(document.filePath, document.name)}
                                    >
                                        {document.name}
                                    </button>
                                </div>
                            )
                        })}
                        <p className={styles.dateAndTime}>
                            {data.createdAt
                                ?.split('T')[0]
                                .split('-')
                                .reverse()
                                .join('/')}{' '}
                            •{' '}
                            {data.createdAt
                                ?.split('T')[1]
                                .split('.')[0]
                                .slice(0, 5)}
                        </p>
                        <hr />
                    </div>
                )
            )}

            {type !== 'information' && user?.role === 'admin' && (
                type === 'request' ? (
                    <div className={styles.receivedContainer} id={String(data.id)}>
                        <p>{`${lawyer.name} (Advogado)`}</p>
                        <div className={styles.receivedMessageContainer}>
                            <p>{data.description}</p>
                        </div>
                        {documents.map((document: any) => {
                            return (
                                <div key={document.id} className={styles.receivedDocumentContainer}>
                                    <GrDocumentPdf />
                                    <button 
                                        onClick={() => handleFileDownload(document.filePath, document.name)}
                                    >
                                        {document.name}
                                    </button>
                                </div>
                            )
                        })}
                        <p className={styles.dateAndTime}>
                            {data.createdAt
                                ?.split('T')[0]
                                .split('-')
                                .reverse()
                                .join('/')}{' '}
                            •{' '}
                            {data.createdAt
                                ?.split('T')[1]
                                .split('.')[0]
                                .slice(0, 5)}
                        </p>
                        <hr />
                    </div>
                ) : (
                    <div className={styles.sentContainer} id={String(data.revisionRequestId)}>
                        <p>{`${user.name} (Você)`}</p>
                        <div className={styles.sentMessageContainer}>
                            <p>{data.description}</p>
                        </div>
                        {documents.map((document: any) => {
                            return (
                                <div key={document.id} className={styles.sentDocumentContainer}>
                                    <GrDocumentPdf />
                                    <button 
                                        onClick={() => handleFileDownload(document.filePath, document.name)}
                                    >
                                        {document.name}
                                    </button>
                                </div>
                            )
                        })}
                        <p className={styles.dateAndTime}>
                            {data.createdAt
                                ?.split('T')[0]
                                .split('-')
                                .reverse()
                                .join('/')}{' '}
                            •{' '}
                            {data.createdAt
                                ?.split('T')[1]
                                .split('.')[0]
                                .slice(0, 5)}
                        </p>
                        <hr />
                    </div>
                )
            )}
            
        </>
    )
}
