'use client'
import React from 'react'
import styles from './index.module.css'

type LiProps = {
    id: number
    title: string
    Modal?: React.ElementType
    icon: React.ElementType
    type: 'parallelRoute' | 'modal'
    setModalIsOpen?: (arg0: boolean) => void
    modalIsOpen?: boolean
}

export default function PrivateHeader({
    name,
    navLinks,
    page,
    setPage,
}: {
    name: string
    navLinks: LiProps[]
    page?: number
    setPage?: ((id: number) => void) | null
}) {
    return (
        <header className={styles.container}>
            <div className={styles.contentWrapper}>
                <h1
                    onClick={(e) => setPage && setPage(0)}
                    style={{
                        borderBottom: page === 0 ? '3px solid #000' : 'none',
                    }}
                >
                    {name.toUpperCase()}
                </h1>
                <ul className={styles.navbar}>
                    {navLinks.map((li) => {
                        if (li.type === 'parallelRoute') {
                            return (
                                <a
                                    key={li.id}
                                    onClick={(e) => setPage?.(li.id === page ? 0 : li.id)}
                                    style={{
                                        borderBottom: li.id === page ? '3px solid #000' : 'none',
                                    }}
                                >
                                    <li.icon className={styles.iconProcessHeader} />
                                    <p>{li.title}</p>
                                </a>
                            );
                        } else if (li.type === 'modal') {
                            return (
                                li.modalIsOpen ? 
                                    <li.Modal key={li.id} setModalIsOpen={li.setModalIsOpen} />
                                :
                                <a
                                    key={li.id}
                                    onClick={() => li.setModalIsOpen && li.setModalIsOpen(true)}
                                    style={{
                                        borderBottom: li.id === page ? '3px solid #000' : 'none',
                                    }}
                                >
                                    <li.icon className={styles.iconProcessHeader} />
                                    <p>{li.title}</p>
                                </a>
                            );
                        }
                        return null;
                    })}
                </ul>
            </div>
            <hr />
        </header>
    )
}
