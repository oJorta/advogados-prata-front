"use client"
import axios from 'axios'
import styles from './page.module.css'
import CardAdvogado from '@/components/CardAdvogado'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
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
    /* const token = document.cookie.split('=')[1] */
    const token = Cookies.get('accessToken')

    useEffect(() => {
        getUsers()
        getProcesses()
    }, [])

    async function getUsers() {
        const { data } = await axios.get(
            'http://localhost:3333/users',
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        setAdvogados(data)
    }

    async function getProcesses() {
        const { data } = await axios.get(
            'http://localhost:3333/processes',
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        setProcesses(data)
    }

    function filterProcesses(id: number, status: string) {
        switch (status) {
            case 'Concluído':
                return processes.filter((process) => process.userId === id && process.status === 'Concluído')
            default:
                return processes.filter((process) => process.userId === id && process.status !== 'Concluído')
        }
    }

    async function handleDeleteUser(id: number) {
        await axios
        .delete(`http://localhost:3333/user/${id}`, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`,
            },
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
            {advogados.map(advogado => {
                return (
                    <CardAdvogado 
                        key={advogado.id}
                        id={advogado.id}
                        nome={advogado.name}
                        oab={advogado.nroOAB}
                        processosAndamento={filterProcesses(advogado.id, 'Andamento').length}
                        processosConcluidos={filterProcesses(advogado.id, 'Concluído').length}
                        onDelete={handleDeleteUser}
                    />
                )
            })}
        </div>
    )
}
