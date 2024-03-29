'use client'
import axios from 'axios'
import styles from './page.module.css'
import CardAdvogado from '@/components/CardAdvogado'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Advogado = {
    id: number
    name: string
    nroOAB: string
}

type Process = {
    id: number
    title: string
    description: string
    status: string
    userId: number
}

export default function Advogados() {
    const [advogados, setAdvogados] = useState([] as Advogado[])
    const [processes, setProcesses] = useState([] as Process[])

    useEffect(() => {
        getUsers()
        getProcesses()
    }, [])

    async function getUsers() {
        const { data } = await axios.get(
            'http://localhost:3333/api/users',
            {
                withCredentials: true,
            }
        )
        setAdvogados(data)
    }

    async function getProcesses() {
        const { data } = await axios.get(
            'http://localhost:3333/api/processes' ,
            {
                withCredentials: true
            }
        )
        setProcesses(data)
    }

    function filterProcesses(id: number, status: string) {
        switch (status) {
            case 'Concluído':
                return processes.filter(
                    (process) =>
                        process.userId === id && process.status === 'Concluído'
                )
            default:
                return processes.filter(
                    (process) =>
                        process.userId === id && process.status !== 'Concluído'
                )
        }
    }

    async function handleDeleteUser(id: number) {
        await axios
            .delete(`http://localhost:3333/api/user/${id}`, {
                withCredentials: true,
            })
            .then((response) => {
                toast.success('Usuário removido com sucesso!')
            })
            .catch((error) => {
                console.log(error)
                toast.error('Erro ao remover usuário!')
            })
        getUsers()
    }

    return (
        <div className={styles.container}>
            <div className={styles.gridContainer}>
                {advogados.map((advogado) => {
                    return (
                        <CardAdvogado
                            key={advogado.id}
                            id={advogado.id}
                            nome={advogado.name}
                            oab={advogado.nroOAB}
                            processosAndamento={
                                filterProcesses(advogado.id, 'Andamento').length
                            }
                            processosConcluidos={
                                filterProcesses(advogado.id, 'Concluído').length
                            }
                            onDelete={handleDeleteUser}
                        />
                    )
                })}
            </div>
        </div>
    )
}
