import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePathname } from 'next/navigation'

import axios from 'axios'
import toast from 'react-hot-toast'

import styles from './index.module.css'

import { AiOutlineClose } from 'react-icons/ai'

type ModalProps = {
    setOpen: (open: boolean) => void
    type: 'open' | 'conclude'
}

export default function ProcessOptions({ setOpen, type }: ModalProps ) {
    const { isAdmin, token } = useAuth()
    const processId = usePathname().split('/')[2]
    const [isLoading, setIsLoading] = useState(false)
    const [messageModalIsOpen, setMessageModalIsOpen] = useState(false)
    const [newMessage, setNewMessage] = useState<String>('')

    function handleTextareaChange(event: { target: { value: any } }) {
        setNewMessage(event.target.value);
    }

    async function handleOpenProcess() {
        setIsLoading(true)

        await axios.patch(
                `http://localhost:3333/process/${processId}`,
                {
                    status: 'Em andamento',
                    conclusionDate: null,
                    seem: null,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                toast.success('Processo reaberto com sucesso!')
                setOpen(false)
            })
            .catch(() => {
                toast.error('Erro ao reabrir processo!')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    async function handleConcludeProcess() {
        setIsLoading(true)

        await axios.patch(
                `http://localhost:3333/process/${processId}`,
                {
                    status: 'Concluído',
                    conclusionDate: new Date(),
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then(() => {
                toast.success('Processo concluído com sucesso!')
                /* setOpen(false) */
                setMessageModalIsOpen(true)
            })
            .catch(() => {
                toast.error('Erro ao concluir processo!')
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    async function handleMessageSubmit(message: any) {
        await axios.patch(
            `http://localhost:3333/process/${processId}`,
            {
                seem: message,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        )
        .then(() => {
            /* toast.success('Processo concluído com sucesso!') */
            /* setOpen(false) */
            setMessageModalIsOpen(false)
            setOpen(false)
        })
        .catch(() => {
            toast.error('Erro ao enviar parecer do processo!')
        })
        .finally(() => {
            setIsLoading(false)
        })
        
    }

    return (
        <div className={styles.container}>
            {isLoading && (
                <div className={styles.spinnerWrapper}>
                    <div className={styles.spinner}></div>
                </div>
            )}
            
            {type === 'open' && (
                <div className={styles.modalContainer}>
                <header>
                    <h1>DESEJA REABRIR O PROCESSO?</h1>
                    <AiOutlineClose onClick={() => setOpen(false)} />
                </header>

                <div className={styles.options}>
                    <button className={styles.yesBtn} onClick={() => handleOpenProcess()}>
                        SIM
                    </button>
                    <button className={styles.noBtn} onClick={() => setOpen(false)}>
                        NÃO
                    </button>
                </div>
            </div>
            )}

            {type === 'conclude' && !messageModalIsOpen &&(
                <div className={styles.modalContainer}>
                    <header>
                        <h1>DESEJA FINALIZAR O PROCESSO?</h1>
                        <AiOutlineClose onClick={() => setOpen(false)} />
                    </header>

                    <div className={styles.options}>
                        <button className={styles.yesBtn} onClick={() => handleConcludeProcess()}>
                            SIM
                        </button>
                        <button className={styles.noBtn} onClick={() => setOpen(false)}>
                            NÃO
                        </button>
                    </div>
                </div>
            )}
            {messageModalIsOpen && (
                <div className={styles.modalContainer}>
                    <header>
                        <h1>PARECER</h1>
                    </header>

                    <form onSubmit={() => handleMessageSubmit(newMessage)}>
                        <label>
                            <textarea
                                placeholder="Escreva aqui o parecer..."
                                onChange={handleTextareaChange}
                            >
                            </textarea>
                        </label>

                        <button className={styles.addMessageButton} type="submit">
                            ENVIAR
                        </button>
                    </form>
                </div>
            )}
            
        </div>
    )
}