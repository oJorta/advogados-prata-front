'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import jwt from 'jsonwebtoken'

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const token = Cookies.get('accessToken');
    const router = useRouter()
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (token) {
            const { sub: id, role } = jwt.decode(token) as { sub: string, role: string }
            if (role === 'admin') {
                setIsAdmin(true)
                router.push('/painel')
            }
        }
    }, [])

    return (
        <>
            {isAdmin && <></>}
            {!isAdmin && children}
        </>
    )
}
