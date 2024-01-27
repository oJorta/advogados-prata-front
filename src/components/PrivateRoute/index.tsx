'use client'
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation"
import { ReactNode, use, useEffect, useState } from "react"
import cookies from "js-cookie";
type PrivateHeaderProps = {
    children: ReactNode
}

export default function PrivateRoute({ children }: PrivateHeaderProps) {
    const router = useRouter();
    const token = cookies.get('accessToken');
    const [isLogged, setIsLogged] = useState(false);
    
    useEffect(() => {
        if (!token) {
            router.push('/')
            return
        }
        setIsLogged(true)
    }, [])

    return (
        <>
            {!isLogged && <></>}
            {isLogged && children}
        </>
    )
}