import styles from './card.module.css'
import { BiSolidUser } from 'react-icons/bi'
import { BiEdit } from 'react-icons/bi'
import { BiTrash } from 'react-icons/bi'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AiOutlineClose } from 'react-icons/ai'

type CardAdvogadoProps = {
    key: number
    id: number
    nome: string
    oab: string
    processosAndamento: number
    processosConcluidos: number
    onDelete: (id: number) => void
}

export default function CardAdvogado({
    id,
    nome,
    oab,
    processosAndamento,
    processosConcluidos,
    onDelete,
}: CardAdvogadoProps) {
    const { push } = useRouter()
    const [modalIsOpen, setModalIsOpen] = useState(false)

    async function handleDeleteUser(id: number) {
        onDelete(id);
    }

    function handleCardClick(ev: React.MouseEvent<HTMLDivElement>, id: number) {
        ev.preventDefault()
        const target = ev.target as HTMLDivElement

        if (target.id !== 'icon') push(`/painel/advogados/${id}`)
    }

    return (
        <div
            className={styles.container}
            id='card'
            {...!modalIsOpen && 
                {
                    onClick: (ev) => handleCardClick(ev, id)
                }
            }
        >
            <BiSolidUser size={64} />

            <div className={styles.info}>
                <div className={styles.advogadoInfo}>
                    <strong>{nome}</strong>
                    <strong>OAB: {oab}</strong>
                </div>
                {<div className={styles.processos}>
                    <small>Processos em Andamento: {processosAndamento}</small>
                    <small>Processos Concluídos: {processosConcluidos}</small>
                </div>}
            </div>

            <div className={styles.actions}>
                {/* <Link href={`/painel/advogados/${id}`}>
                    <BiEdit id='icon'/>
                </Link> */}

                <button
                    onClick={() => setModalIsOpen(!modalIsOpen)}
                >
                    <BiTrash id='icon' />
                </button>
            </div>

            {modalIsOpen && (
                <div className={styles.modalWrapper}>
                    <div className={styles.modalContainer}>
                        <header>
                            <h1>DESEJA REMOVER O USUÁRIO?</h1>
                            <AiOutlineClose onClick={() => setModalIsOpen(false)} />
                        </header>
        
                        <div className={styles.options}>
                            <button
                                className={styles.yesBtn}
                                onClick={async () => await handleDeleteUser(id)}
                            >
                                SIM
                            </button>
                            
                            <button
                                className={styles.noBtn}
                                onClick={() => setModalIsOpen(false)}
                            >
                                NÃO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
