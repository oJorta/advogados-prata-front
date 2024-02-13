'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { processProps } from '@/types/processTableAtt'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import styles from './page.module.css'

import { AiFillBell , AiOutlineComment } from 'react-icons/ai'
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";

import { monthlyProcessReport } from '@/types/monthlyReport'
import toast from 'react-hot-toast'

export default function Hub(){
    const { push } = useRouter()
    const { token } = useAuth()
    const [process, setProcess] = useState<processProps[]>([])
    const [nearDeadlineProcesses, setNearDeadlineProcesses] = useState<processProps[]>([])
    const [recentlyConcludedProcesses, setRecentlyConcludedProcesses] = useState<processProps[]>([])
    const [awaitingReturnProcesses, setAwaitingReturnProcesses] = useState<processProps[]>([])
    const [monthlyProcessReport, setMonthlyProcessReport] = useState<monthlyProcessReport>({} as monthlyProcessReport)

    useEffect(() => {
        const getData = async () => {
            const processes = await axios.get(
                'http://localhost:3333/api/processes?withUser=true&withCategory=true',
                {
                    withCredentials: true,
                }
            )
            const lawyers = await axios.get(
                'http://localhost:3333/api/users?role=lawyer',
                {
                    withCredentials: true,
                }
            )
            console.log(lawyers.data)
            setProcess(processes.data)
            setNearDeadlineProcesses(
                processes.data.filter((process: processProps) => dateIsNear(process.deadline) && (process.status !== 'Concluído'))
            )
            setRecentlyConcludedProcesses(
                processes.data.filter((process: processProps) => dateIsNear(process.conclusionDate, 'conclusionDate') && (process.status === 'Concluído'))
            )
            setAwaitingReturnProcesses(
                processes.data.filter((process: processProps) => process.status === 'Aguardando retorno')
            )   
            setMonthlyProcessReport({
                total: processes.data.filter((process: { distributionDate: string | number | Date }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth()
                )
                ).length,
                inProgress: processes.data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Em inicialização'
                )).length,
                waiting: processes.data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Aguardando retorno'
                )).length,
                completed: processes.data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Concluído'
                )).length,
                averagePerLawyer: monthlyProcessReport.inProgress / lawyers.data.length,
                openProcesses: monthlyProcessReport.inProgress + monthlyProcessReport.waiting,
            })
        }
        
        getData()
        
        
    }, [])

    function dateIsNear(date: string, type: 'deadline' | 'conclusionDate' = 'deadline') {
        if(date === null) return false

        const currentDate = new Date()
        const paramDate = new Date(date)
        
        const difference = type === 'deadline' ? paramDate.getTime() - currentDate.getTime() : currentDate.getTime() - paramDate.getTime()
        const days = Math.ceil(difference / (1000 * 3600 * 24))
        return days <= 7
    }

    function getFirstAndLastDateOfMonth(period: 'monthly' | 'trimestral' = 'monthly') {
        const today = new Date();
        
        const firstDayOfMonth = period === 'monthly' ? new Date(today.getFullYear(), today.getMonth(), 1) : new Date(today.getFullYear(), today.getMonth() - 3, 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
        const formatDate = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        };
    
        const firstDateFormatted = formatDate(firstDayOfMonth);
        const lastDateFormatted = formatDate(lastDayOfMonth);

        return {
            firstDate: firstDateFormatted,
            lastDate: lastDateFormatted
        };
    }

    function getReport(type: 'monthly' | 'trimestral' | 'monthlyLawyer') {
        let month = getFirstAndLastDateOfMonth()
        let trimester = getFirstAndLastDateOfMonth('trimestral')
        
        switch (type) {
            case 'monthly':
                axios
                    .get(
                        `http://localhost:3333/api/processes-report?sort=category&beginningDistributionDate=${month.firstDate}&endDistributionDate=${month.lastDate}&withUser=true`,
                        {
                            withCredentials: true,
                            responseType: 'arraybuffer',
                            responseEncoding: 'utf8',
                        }
                    )
                    .then((res) => {
                        const file = new Blob([res.data], {
                            type: 'application/pdf',
                        })
                        const fileURL = URL.createObjectURL(file)
                        window.open(fileURL, '_blank')
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error('Nenhum processo encontrado.')
                    })
                    break
            case 'trimestral':
                axios
                    .get(
                        `http://localhost:3333/api/processes-report?sort=user&beginningDistributionDate=${trimester.firstDate}&endDistributionDate=${trimester.lastDate}&withUser=true`,
                        {
                            withCredentials: true,
                            responseType: 'arraybuffer',
                            responseEncoding: 'utf8',
                        }
                    )
                    .then((res) => {
                        const file = new Blob([res.data], {
                            type: 'application/pdf',
                        })
                        const fileURL = URL.createObjectURL(file)
                        window.open(fileURL, '_blank')
                    })
                    .catch((error) => {
                        console.log(error)
                        toast.error('Nenhum processo encontrado.')
                    })
        }
    }

    return(
        <main className={styles.container}>
            <section className={styles.sectionContainer}>
                <div className={styles.tableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>PROCESSOS PERTO DO PRAZO</h1>
                    </section>
                    <section className={styles.tableBody}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>PROCESSO</th>
                                    <th className={styles.th}>MATÉRIA</th>
                                    <th className={styles.th}>CLIENTE</th>
                                    <th className={styles.th}>ADVOGADO</th>
                                    <th className={styles.th}>TIPO</th>
                                    <th className={styles.th}>ACESSAR</th>
                                    <th className={styles.th}>NOTIFICAR</th>
                                </tr>
                            </thead>

                            <tbody>
                                {nearDeadlineProcesses.map((process) => (
                                    <tr key={process.id}>
                                        <td className={styles.td}>{process.processKey}</td>
                                        <td className={styles.td}>{process.matter}</td>
                                        <td className={styles.td}>{process.name}</td>
                                        <td className={styles.td}>{process.user?.name}</td>
                                        <td className={styles.td}>{process.category?.name}</td>
                                        <td
                                            className={styles.td}
                                            onClick={() => push(`/processo/${process.id}`)}
                                        >
                                            <AiOutlineComment className={styles.icon}/>
                                        </td>
                                        <td
                                            className={styles.td}
                                        >
                                            <AiFillBell className={styles.icon}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>

                <div className={styles.tableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>PROCESSOS AGUARDANDO RETORNO</h1>
                    </section>
                    <section className={styles.tableBody}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>PROCESSO</th>
                                    <th className={styles.th}>MATÉRIA</th>
                                    <th className={styles.th}>CLIENTE</th>
                                    <th className={styles.th}>ADVOGADO</th>
                                    <th className={styles.th}>TIPO</th>
                                    <th className={styles.th}>ACESSAR</th>
                                    <th className={styles.th}>NOTIFICAR</th>
                                </tr>
                            </thead>

                            <tbody>
                                {awaitingReturnProcesses.map((process) => (
                                    <tr key={process.id}>
                                        <td className={styles.td}>{process.processKey}</td>
                                        <td className={styles.td}>{process.matter}</td>
                                        <td className={styles.td}>{process.name}</td>
                                        <td className={styles.td}>{process.user?.name}</td>
                                        <td className={styles.td}>{process.category?.name}</td>
                                        <td
                                            className={styles.td}
                                            onClick={() => push(`/processo/${process.id}`)}
                                        >
                                            <AiOutlineComment className={styles.icon}/>
                                        </td>
                                        <td
                                            className={styles.td}
                                        >
                                            <AiFillBell className={styles.icon}/>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </section>

            <section className={styles.sectionContainer}>
                <div className={styles.smallTableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>REGISTRO MENSAL</h1>
                    </section>
                    <div className={styles.monthlyInfoContainer}>
                        <p><strong>Processos em andamento:</strong> {monthlyProcessReport.inProgress} processos</p>
                        <p><strong>Processos em aguardo:</strong> {monthlyProcessReport.waiting} processos</p>
                        <p><strong>Processos cadastrados esse mês:</strong> {monthlyProcessReport.total}</p>
                        <p><strong>Processos concluídos este mês:</strong> {monthlyProcessReport.completed} processos | {monthlyProcessReport.openProcesses} RESTANTES</p>
                        <p><strong>Média de processos por advogado:</strong> {monthlyProcessReport.averagePerLawyer} processos</p>
                    </div>
                </div>
                
                <div className={styles.smallTableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>PROCESSOS CONCLUÍDOS RECENTEMENTE</h1>
                    </section>
                    <section className={styles.tableBody}>
                        <table className={styles.table}>
                            <thead>
                                
                            </thead>

                            <tbody>
                                {recentlyConcludedProcesses.map((process) => (
                                    <tr key={process.id}>
                                        <td className={styles.td}>{process.processKey}</td>
                                        <td className={styles.td}>{process.matter}</td>
                                        <td className={styles.td}>{process.name}</td>
                                        <td className={styles.td}>{process.user?.name}</td>
                                        <td className={styles.td}>{process.category?.name}</td>
                                        <td
                                            className={styles.td}
                                            onClick={() => push(`/processo/${process.id}`)}
                                        >
                                            <AiOutlineComment className={styles.icon}/>
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td className={styles.td}>TN-238347</td>
                                    <td className={styles.td}>Aditivo</td>
                                    <td className={styles.td}>José Bezerra</td>
                                    <td className={styles.td}>Luiz Rosário</td>
                                    <td className={styles.td}>Penal</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </div>
            </section>

            <section className={styles.sectionContainer}>
                <button
                    className={styles.reportShortcutButton}
                    onClick={() => getReport('monthly')}
                >
                    <HiOutlineClipboardDocumentList />
                    RELATÓRIO MENSAL PROCESSOS
                </button>
                
                <button
                    className={styles.reportShortcutButton}
                    onClick={() => getReport('trimestral')}
                >
                    <HiOutlineClipboardDocumentList />
                    RELATÓRIO TRIMESTRAL
                </button>
                
                <button
                    className={styles.reportShortcutButton}
                    onClick={() => getReport('monthlyLawyer')}
                >
                    <HiOutlineClipboardDocumentList />
                    RELATÓRIO MENSAL ADVOGADOS
                </button>
            </section>
        </main>
    )
}
