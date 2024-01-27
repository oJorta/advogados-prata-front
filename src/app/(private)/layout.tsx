'use client'

import { useRouter, usePathname } from 'next/navigation'

import LayoutHeader from '@/components/LayoutHeader'
import PrivateRoute from '@/components/PrivateRoute'
import { useAuth } from '@/hooks/useAuth'
import styles from './page.module.css'
import { RiArrowGoBackLine } from 'react-icons/ri'


export default function DefaultLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const path = usePathname()
    const { user } = useAuth()

    function handleBackButton() {
        if(path === '/painel/processos'){
            router.push('/painel')
            return
        }

        if(path.includes('/painel/advogados/')){
            router.push('/painel/advogados')
            return
        }

        if(path.includes('/painel/processos/novo')){
            router.push('/painel/processos')
            return
        }

        user?.role === 'admin' ? router.push('/painel') : router.push(`/user/${user?.id}`)
    }

    return (
        <PrivateRoute>
            <section className={styles.container}>
                <LayoutHeader/>

                {children}

                {!path.includes('/user/') && path !== '/painel' &&
                    <button onClick={() => handleBackButton()} className='btn-Layout'>
                        <RiArrowGoBackLine size={20}/>
                        VOLTAR
                    </button>
                }
            </section>
        </PrivateRoute>
    )
}
