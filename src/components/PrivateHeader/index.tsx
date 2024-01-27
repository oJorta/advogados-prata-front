'use client'
import React from 'react'
import styles from './index.module.css'

type LiProps = {
    id: number
    title: string
    Modal?: React.ElementType
    icon: React.ElementType
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
                        return (
                            <a
                                onClick={(e) =>
                                    setPage?.(li.id === page ? 0 : li.id)
                                }
                                key={li.id}
                                style={{
                                    borderBottom: li.id === page ? '3px solid #000' : 'none'
                                }}
                            >
                                <li.icon className={styles.iconProcessHeader} />
                                <p>{li.title}</p>
                            </a>
                        )
                    })}
                </ul>
            </div>
            <hr />
        </header>
    )
}
