import '@/app/globals.css'
import Image from 'next/image'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './layoutheader.module.css';

import { useAuth } from '@/hooks/useAuth'
import logo from '@/../public/icons/scaleIcon.svg'

import { IoExitOutline } from 'react-icons/io5';

export default function AppHeader() {
    const auth = useAuth()
    const name = auth.user?.name || 'usuário'
    const path = usePathname()
    console.log(path)

    return (
        <header className={styles.headerContainer}>
            <div className={styles.officeInfo}>
                <Image src={logo} alt='Logo do Escritório' width={42}/>
                <h3>Nome do Escritório</h3>
            </div>

            {(auth.user?.role === 'admin' &&
                <nav>
                    <ul className={styles.navList}>
                        <li className={styles.navItem}>
                            <Link
                                href='/painel'
                                style={{
                                    borderBottom: path === '/painel' ? '3px solid #000' : 'none',
                                    color: path === '/painel' ? '#000' : '#000000b1'
                                }}
                            >
                                Painel
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href='/painel/advogados'
                                style={{
                                    borderBottom: path === '/painel/advogados' ? '3px solid #000' : 'none',
                                    color: path === '/painel/advogados' ? '#000' : '#000000b1'
                                }}
                            >
                                Advogados
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href='/painel/processos'
                                style={{
                                    borderBottom: path === '/painel/processos' ? '3px solid #000' : 'none',
                                    color: path === '/painel/processos' ? '#000' : '#000000b1'
                                }}
                            >
                                Processos
                            </Link>
                        </li>
                        <li className={styles.navItem}>
                            <Link
                                href='/painel/relatorio'
                                style={{
                                    borderBottom: path === '/painel/relatorio' ? '3px solid #000' : 'none',
                                    color: path === '/painel/relatorio' ? '#000' : '#000000b1'
                                }}
                            >
                                Relatório
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}

            <div className={styles.userAndExit}>
                <p>{`Olá, ${name}!`}</p>
                <button onClick={auth.logout} className={styles.exitButton}>
                    <IoExitOutline className={styles.exitIcon}/>
                </button>
            </div>
        </header>
    )
  }