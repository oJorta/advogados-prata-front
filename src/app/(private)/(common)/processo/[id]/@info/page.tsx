'use client'
import { useEffect, useState, useContext } from 'react'
import { usePathname } from 'next/navigation'
import axios from 'axios'
import Cookies from 'js-cookie'
import styles from './page.module.css'

import { PageContext } from '../layout'
import { GrDocumentText } from "react-icons/gr";

export default function Add() {
    const setPage = useContext(PageContext)
    const path = usePathname()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [process, setProcess] = useState<any>({})
    const [advogado, setAdvogado] = useState<any>({})
    const [documents, setDocuments] = useState<any>([])
    /* const token = document.cookie.split('=')[1] */
    const token = Cookies.get('accessToken')

    useEffect(() => {
        const getData = async () => {
            const processData = await axios.get(
                `http://localhost:3333/process/${path.split('/')[2]}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const advogadoData = await axios.get(
                `http://localhost:3333/user/${processData.data.userId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            const processDocuments = await axios.get(
                `http://localhost:3333/process-documents-by-process/${processData.data.id}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setProcess(processData.data)
            setAdvogado(advogadoData.data)
            setDocuments(processDocuments.data.filter((document: any) => document.processId === processData.data.id))
        }
        getData()
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
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            <div className={styles.infoContainer}>
                <span className={styles.infoItem}>
                    PROCESSO:
                    <p>{process.processKey}</p>
                </span>
                
                <span className={styles.infoItem}>
                    MATÉRIA:
                    <p>{process.materia}</p>
                </span>

                <span className={styles.infoItem}>
                    DATA DE INCLUSÃO:
                    <p>
                        {process.distributionDate
                            ?.split('T')[0]
                            .split('-')
                            .reverse()
                            .join('/')}
                    </p>
                </span>

                <span className={styles.infoItem}>
                    CLIENTE:
                    <p>{process.name}</p>
                </span>

                <span className={styles.infoItemObs}>
                    OBSERVAÇÕES:
                    <div>
                        <p>{process.information}</p>
                    </div>
                </span>

                <span className={styles.infoItem}>
                    ANEXOS:
                    <div className={styles.filesContainer}>
                        {documents.map((document: any) => (
                            <button 
                                onClick={() => handleFileDownload(document.filePath, document.name)}
                                key={document.id}
                                className={styles.file}
                            >
                                <GrDocumentText />
                                {document.name}
                            </button>
                        ))}
                    </div>
                </span>
            </div>
        </div>
    )
}
