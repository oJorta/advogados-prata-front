'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { processProps } from '@/types/processTableAtt'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import styles from './page.module.css'

import { AiFillBell , AiOutlineComment } from 'react-icons/ai'

import { monthlyProcessReport } from '@/types/monthlyReport'

export default function Hub(){
    const { push } = useRouter()
    const { token } = useAuth()
    const [process, setProcess] = useState<processProps[]>([])
    const [nearDeadlineProcesses, setNearDeadlineProcesses] = useState<processProps[]>([])
    const [recentlyConcludedProcesses, setRecentlyConcludedProcesses] = useState<processProps[]>([])
    const [monthlyProcessReport, setMonthlyProcessReport] = useState<monthlyProcessReport>({} as monthlyProcessReport)

    useEffect(() => {
        const getData = async () => {
            const { data } = await axios.get('http://localhost:3333/processes', 
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
            setProcess(data)
            setNearDeadlineProcesses(
                data.filter((process: processProps) => dateIsNear(process.deadline) && (process.status !== 'Concluído'))
            )
            setRecentlyConcludedProcesses(
                data.filter((process: processProps) => dateIsNear(process.conclusionDate, 'conclusionDate') && (process.status === 'Concluído'))
            )
            setMonthlyProcessReport({
                total: data.filter((process: { distributionDate: string | number | Date }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth()
                )).length,
                inProgress: data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Em inicialização'
                )).length,
                waiting: data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Aguardando retorno'
                )).length,
                completed: data.filter((process: { distributionDate: string | number | Date; status: string }) => (
                    new Date().getMonth() === new Date(process.distributionDate).getMonth() &&
                    process.status === 'Concluído'
                )).length,
                averagePerLawyer: 0,
                categories: Array.from(new Set(data.map((process: { categoryId: any }) => process.categoryId))).join(', ')
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
                                </tr>
                            </thead>

                            <tbody>
                                {nearDeadlineProcesses.map((process) => (
                                    <tr key={process.id}>
                                        <td className={styles.td}>{process.processKey}</td>
                                        <td className={styles.td}>{process.materia}</td>
                                        <td className={styles.td}>{process.name}</td>
                                        <td className={styles.td}>{process.userId}</td>
                                        <td className={styles.td}>{process.categoryId}</td>
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
                <div className={styles.smallTableContainer}>
                    <section className={styles.tableHeader}>
                        <h1>REGISTRO MENSAL</h1>
                    </section>
                    <div className={styles.monthlyInfoContainer}>
                        <p><strong>Processos desse mês:</strong> {monthlyProcessReport.total}</p>
                        <p><strong>Processos em andamento:</strong> {monthlyProcessReport.inProgress}</p>
                        <p><strong>Processos em aguardo:</strong> {monthlyProcessReport.waiting}</p>
                        <p><strong>Processos concluídos este mês:</strong> {monthlyProcessReport.completed}</p>
                        <p><strong>Média de processos por advogado:</strong> {monthlyProcessReport.averagePerLawyer}</p>
                        <p><strong>Categorias dos processos deste mês:</strong> {monthlyProcessReport.categories}</p>
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
                                        <td className={styles.td}>{process.materia}</td>
                                        <td className={styles.td}>{process.name}</td>
                                        <td className={styles.td}>{process.userId}</td>
                                        <td className={styles.td}>{process.categoryId}</td>
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
        </main>
    )
}
