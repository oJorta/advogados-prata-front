'use client'
import { z } from 'zod'
import { useState } from 'react'
import Image from 'next/image'
import styles from './login.module.css'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

//Icons
import { BiUser } from 'react-icons/bi'
import { BiLock } from 'react-icons/bi'

//Components
import Input from '@/components/Input'

//Assets
import Logo from '@/../public/icons/scaleIcon.svg'
import loginBg from '@/../public/img/loginBackground.jpg'

//Types
import { invalidField } from '@/types/inputError'

type Credentials = {
    username: string,
    password: string
}

export default function Login() {

    const [loading, setLoading] = useState(false)
    const auth = useAuth()
    const { push } = useRouter()

    const userLogin = z.object({
        username: z.string().nonempty('O campo precisa ser preenchido.')
        .email('E-mail inválido.'),

        password: z.string().nonempty('O campo precisa ser preenchido.')
        .min(5,'A senha deve possuir mais de 5 caracteres.')
    })

    const user: Credentials = {
        username: '',
        password: ''
    }

    function setUser(inputValue: string){
        user.username = inputValue
    }

    function setPassword(inputValue: string){
        user.password = inputValue
    }

    const [invalidField, setInvalidField] = useState<invalidField>({
        username: {error: false, onFocus: false, textError:''},
        password: {error: false, onFocus: false, textError:''},
    })

    function setFocusUser(){
        setInvalidField({... invalidField, username:{error: false, onFocus: true, textError: ''}})
    }

    function setFocusPassword(){
        setInvalidField({... invalidField, password:{error: false, onFocus: true, textError: ''}})
    }

    async function handleLogin(ev: React.FormEvent<HTMLFormElement>){
        ev.preventDefault()
        setLoading(true)
        const validation = userLogin.safeParse(user)
        
        if(!validation.success){
            let setError: invalidField = invalidField
            
            validation.error.issues.map(el=>{
                if(invalidField[el.path[0].toString()].error == false){
                    setError = {...setError, [el.path[0].toString()]:{error: true, onFocus: false, textError: el.message}}
                }
            })
            setInvalidField(setError)
            setLoading(false)
        }
        else{
            await auth.login({username: user.username, password: user.password}).then((response)=>{
                toast.success('Login efetuado com sucesso.')
            }).catch((e)=>{
                setLoading(false)
            })
        }
    }

    return (
        <>
            <section
                className={styles.container}
            >
                <section>
                    <header className={styles.header}>
                        <Image src={Logo} alt='Logo do escritório de advocacia.'></Image>
                        <h3>Nome do escritório.</h3>
                    </header>

                    <main className={styles.loginContainer}>
                        <div className={styles.loginHeader}>
                            <h2>Bem-vindo de volta!</h2>
                            <p>Insira suas informações de login.</p>
                        </div>

                        <form onSubmit={handleLogin} className={styles.loginForm}>
                            <Input type="text" title="Email" icon={BiUser} value={setUser}
                            invalid={invalidField.username} setFocus={setFocusUser} />

                            <Input type="password" title="Senha" icon={BiLock} value={setPassword}
                            invalid={invalidField.password} setFocus={setFocusPassword} />
                            <button type='submit' className={styles.loginButton} disabled={loading} style={{cursor: loading ? 'wait' : 'pointer'}}>
                                {loading ? <div className={styles.spinner}></div> : 'Entrar'}
                            </button>
                        </form>
                    </main>
                </section>

                <section
                    style={{
                        backgroundImage: `url(${loginBg.src})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}    
                >
                </section>

                {/* <div className={styles.loginContainer}>
                    <Image src={Logo} alt="Logo R&R" />
                    <form onSubmit={handleLogin} className={styles.loginForm}>
                    <Input type="text" title="USUÁRIO" icon={BiUser} output={setUser}
                     invalid={inputError.username} setFocus={setFocusUser} />

                    <Input type="password" title="SENHA" icon={BiLock} output={setPassword}
                     invalid={inputError.password} setFocus={setFocusPassword} />
                        <button type='submit' className={styles.loginButton} disabled={loading} style={{cursor: loading ? 'wait' : 'pointer'}}>
                            {loading ? <div className={styles.spinner}></div> : 'ENTRAR'}
                        </button>
                    </form>
                </div> */}
            </section>
        </>
    )
}
