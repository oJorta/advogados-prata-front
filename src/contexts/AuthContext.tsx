"use client"
import { ReactNode, createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import cookies from 'js-cookie'
import jwt from 'jsonwebtoken'
import toast from 'react-hot-toast'

type LoginProps = {
    username: string
    password: string
}

type UserProps = {
    sub?: number
    id?: number
    name: string
    email: string
    role: string
}

export type AuthContextProps = {
    user: UserProps | null
    isAdmin: boolean
    login: ({ username, password }: LoginProps) => Promise<void>
    logout: () => void
    token: string | null | undefined
}

export const AuthContext = createContext({} as AuthContextProps)

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [isAdmin, setIsAdmin] = useState<boolean>(false)
    const [token, setToken] = useState<string | null | undefined>(cookies.get('accessToken'))

    const { push } = useRouter()
    
    useEffect(() => {
        if (token) {
            try {
                const decoded = jwt.decode(token)
                if (decoded) {
                    const { sub : id, name, email, role } = decoded as UserProps
                    setUser({ id, name, email, role })
                    setIsAdmin(role === 'admin' ? true : false)
                }
            } catch (e) {
                toast.error('Token inválido.')
            }
        }
    }, [token])

    useEffect(() => {
        if(token) {
            try {
                const decoded = jwt.decode(token);
              
                if (!decoded) {
                  throw new Error('Token inválido');
                }
              
                const { exp } = decoded as { exp: number };

                const current = Math.floor(Date.now() / 1000);
              
                if (current > exp) logout()
              } catch (error) {
                console.error(error);
              }
        }
    }, [])

    async function login({ username, password }: LoginProps) {
        try {
            const { data } = await axios
            .post(
                'http://localhost:3333/api/login',
                {
                    email: username,
                    password: password,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    withCredentials: true,
                }
            )

            const token = data.accessToken;
            cookies.set('accessToken', token);
            setToken(token);

            const decoded = jwt.decode(token);
            if (decoded) {
                const { sub: id, name, email, role } = decoded as UserProps;
                setUser({ id, name, email, role });
                setIsAdmin(role === 'admin');

                role === 'admin' ? push('/painel') : push(`/user/${id}`);
            }
        } catch(error: any) {
            if(error.code === 'ERR_NETWORK' || error.code === 'ERR_BAD_RESPONSE'){
                toast.error('Erro de conexão.')
                throw error
            }
            
            if (
                error.response.data.statusCode === 400 || 
                error.response.data.statusCode === 401
            ) {
                toast.error('Usuário ou senha inválidos.')
                throw error
            }
        }
    }

    async function logout() {
        cookies.remove('accessToken')
        cookies.remove('refreshToken')

        setUser(null)
        setIsAdmin(false)
        setToken(null)
        push('/')
        /* await axios
            .post('http://localhost:3333/api/logout', {
                withCredentials: true,
            })
            .then(() => {
                cookies.remove('accessToken')
                cookies.remove('refreshToken')

                setUser(null)
                setIsAdmin(false)
                setToken(null)
                push('/')
            }).catch(e => {
                console.error(e)
            }) */
    }
    
    return (
        <AuthContext.Provider
            value={{ user, isAdmin, login, logout, token }}
        >
            {children}
        </AuthContext.Provider>
    )
}
