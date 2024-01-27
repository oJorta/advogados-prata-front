'use client'
import React from 'react'
import styles from './index.module.css'
import { usePathname, useRouter } from 'next/navigation'

type headerProps = {
    id: number,
    title: string,
    page: string,
    icon: React.ElementType,
}

type privateHeaderProps = {
    section: string,
    pageDefault?: string,
    nav?: headerProps[],
}

export default function PrivateHeader({section, pageDefault, nav}:privateHeaderProps) {
    const router = useRouter()
    const pathname = usePathname()

    function pushPageDefault(){
        if(pageDefault){
            router.push(`${pageDefault}`)
        }

    }


    return (
        <header className={styles.container}>
            <div className={styles.contentWrapper}>
                <h1 onClick={pushPageDefault}>{section}</h1>
                <ul className={styles.navbar}>
                    {nav?.map((li) => {
                        return (
                            <a
                                onClick={() =>router.push(`${li.page}`)}
                                key={li.id}
                                style={pathname === li.page ? {textDecoration: 'underline solid 0.2rem black', textUnderlineOffset: '0.3rem'} : {}}
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