'use client'
import { useEffect, useState, useContext, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import Cookies from 'js-cookie'
import styles from './page.module.css'
import Image from 'next/image'

import advogadoIcon from '@/../public/icons/advogadoIcon.svg'
import { phoneMask, cpfMask } from '@/functions/masks'
import { affinityName } from '@/functions/affinity'
import { PageContext } from '../layout'

import { IoMdAdd } from 'react-icons/io'
import { MdOutlineArrowDropDown } from 'react-icons/md'
import { FaRegTrashAlt } from "react-icons/fa"
import { AiOutlineClose } from 'react-icons/ai'

type NewAdvogado = {
    name: string
    nroOAB: string
    phoneNumber: string
    email: string
    password: string
    role: string
    specialties: any[]
}

export default function Add() {
    const setPage = useContext(PageContext)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false)
    const [categories, setCategories] = useState([] as any[])
    const [newCategory, setNewCategory] = useState('' as string)
    const [newAdvogado, setNewAdvogado] = useState<NewAdvogado>({
        name: '',
        nroOAB: '',
        phoneNumber: '',
        email: '',
        password: '',
        role: 'lawyer',
        specialties: [],
    })
    /* const token = document.cookie.split('=')[1] */
    const token = Cookies.get('accessToken')
    const dropdownBarRef = useRef(null)
    const dropdownRef = useRef(null)
    const [confirmExclusion, setConfirmExclusion] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<number | undefined>(undefined)
    
    useEffect(() => {
        const getCategories = async () => {
            const { data } = await axios.get(
                'http://localhost:3333/api/categories',
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            setCategories(data)
        }
        getCategories()
        if (newAdvogado.specialties.length === 0) {
            setNewAdvogado({
                ...newAdvogado,
                specialties: categories.map((item) => ({
                    id: item.id,
                    affinity: 0,
                    name: affinityName(0),
                })),
            })
        }
    }, [categories])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownBarRef.current && !(dropdownBarRef.current as any).contains(event.target) && dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
              setDropdownIsOpen(false)
            }
          }
      
          document.addEventListener('click', handleClickOutside)
      
          return () => {
            document.removeEventListener('click', handleClickOutside)
          }
    }, [])

    function handleOABInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        value.length <= 8 && setNewAdvogado({ ...newAdvogado, nroOAB: value })
    }

    function handlePhoneInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        const phone = phoneMask(value)
        value.length <= 14 &&
            setNewAdvogado({ ...newAdvogado, phoneNumber: phone })
    }

    function handleRoleInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        value === 'admin' && setNewAdvogado({ ...newAdvogado, specialties: [] })
        setNewAdvogado({ ...newAdvogado, role: value })
    }

    function handleCategoryInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        setNewCategory(value)
    }

    async function handleAddNewCategory() {
        try {
            const response = await axios.post('http://localhost:3333/api/category', {
                name: newCategory,
            }, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
    
            setCategories([...categories, response.data.name]);
    
            const { data } = await axios.get('http://localhost:3333/api/users', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
    
            for (const user of data) {
                if(user.role !== 'lawyer') continue
                try {
                    await axios.post(
                        'http://localhost:3333/api/specialty',
                        {
                            affinity: 0,
                            categoryId: Number(response.data.id),
                            userId: Number(user.id),
                        },
                        {
                            withCredentials: true,
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    )
                } catch (error) {
                    console.log(error)
                    toast.error(`Erro na adição de especialidade para o usuário ${user}: ${(error as any).message}`)
                }
            }
    
            toast.success('Categoria criada com sucesso!');
        } catch (error) {
            console.log(error)
            console.log(`Tipo de erro: ${(error as any).message}`)
            toast.error(`Erro na criação da categoria: ${(error as any).response.data.message}`)
        }
    }
    

    function handleSpecialtiesInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value, id } = ev.currentTarget

        /* if (value === '0') {
            setNewAdvogado({
                ...newAdvogado,
                specialties: newAdvogado.specialties.filter((item) => item.id !== Number(id)),
            })
            return
        } */

        setNewAdvogado({
            ...newAdvogado,
            specialties: newAdvogado.specialties.filter((item) => item.id !== Number(id)).concat({ id: Number(id), affinity: Number(value), name: affinityName(Number(value)) })
        })
    }

    async function handleDeleteCategory(id: number) {
        try {
            await axios.delete(`http://localhost:3333/api/category/${id}`, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            setCategories(categories.filter((item) => item.id !== id))
            setConfirmExclusion(false)
            toast.success('Categoria deletada com sucesso!')
        } catch (error) {
            console.log(error)
            toast.error(`Erro na exclusão da categoria: ${(error as any).response.data.message}`)
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsLoading(true)

        const userData = {
            name: newAdvogado.name,
            nroOAB: newAdvogado.nroOAB,
            email: newAdvogado.email,
            phoneNumber: newAdvogado.phoneNumber.match(/\d+/g)?.join(''),
            password: newAdvogado.password,
            role: newAdvogado.role,
            /* ...newAdvogado,*/
        }

        await axios
            .post('http://localhost:3333/api/user', userData, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if(newAdvogado.role === 'lawyer') {
                    newAdvogado.specialties.forEach(async (specialty: any) => {

                        await axios.post(
                            'http://localhost:3333/api/specialty',
                            {
                                affinity: Number(specialty.affinity),
                                categoryId: Number(specialty.id),
                                userId: Number(response.data.id),
                            },
                            {
                                withCredentials: true,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        )
                    })
                }

                setIsLoading(false)
                toast.success('Usuário criado com sucesso!')
                setPage(0)
            })
            .catch((error) => {
                console.log(error)
                console.log(`Tipo de erro: ${error.message}`)
                toast.error(`Erro na criação do usuário: ${error.response.data.message}`)
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
            {confirmExclusion && (
                <div className={styles.modalWrapper}>
                    <div className={styles.modalContainer}>
                        <header>
                            <h1>DESEJA REMOVER A CATEGORIA?</h1>
                            <AiOutlineClose onClick={() => setConfirmExclusion(false)} />
                        </header>
                        
                        <p className={styles.warning}>
                            Ao remover uma categoria, todos os advogados que a possuírem como especialidade terão a especialidade removida e todos os processos vinculados a essa categoria serão deletados.
                        </p>
        
                        <div className={styles.options}>
                            <button
                                className={styles.yesBtn}
                                onClick={async () => await handleDeleteCategory(categoryToDelete as number)}
                            >
                                SIM
                            </button>
                            
                            <button
                                className={styles.noBtn}
                                onClick={() => setConfirmExclusion(false)}
                            >
                                NÃO
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={styles.userAndProcesses}>
                <Image src={advogadoIcon} alt="advogado" />
                <div className={styles.sideInputs}>
                    <input
                        type="text"
                        placeholder="NOME"
                        autoComplete="no"
                        onChange={(ev) => {
                            setNewAdvogado({
                                ...newAdvogado,
                                name: ev.currentTarget.value,
                            })
                        }}
                        value={newAdvogado.name}
                        className={styles.nameInput}
                        required
                    />

                    <div className={styles.roleSelection}>
                        TIPO:
                        <div>
                            <label htmlFor="lawyer">
                                Advogado
                                <input type="radio" name="role" id="lawyer" value="lawyer" checked={newAdvogado.role === "lawyer"} onChange={(ev) => handleRoleInput(ev)}/>
                            </label>
                            <label htmlFor="admin">
                                Administrador
                                <input type="radio" name="role" id="admin" value="admin" checked={newAdvogado.role === "admin"} onChange={(ev) => handleRoleInput(ev)}/>
                            </label>
                        </div>
                    </div>

                    <small
                        {...newAdvogado.role === 'admin' && {style:{display: "none"}}}
                    >
                        Especialidades:
                    </small>

                    <div
                        className={styles.dropdownContainer}
                        style={{display: confirmExclusion ? "none" : "block"}}
                        {...newAdvogado.role === 'admin' && {style:{display: "none"}}}
                    >
                        <div className={styles.dropdownBar} ref={dropdownBarRef}>
                            <input
                                type="text"
                                name="" id=""
                                placeholder='Insira uma nova categoria'
                                onChange={(ev) => handleCategoryInput(ev)}
                                onFocus={() => setDropdownIsOpen(true)}    
                            />
                            <button onClick={handleAddNewCategory}>
                                <IoMdAdd/>
                            </button>
                            <button onClick={() => setDropdownIsOpen(!dropdownIsOpen)}>
                                <MdOutlineArrowDropDown/>
                            </button>
                        </div>
                        {dropdownIsOpen && (
                            <div className={styles.dropdownList} ref={dropdownRef}>
                                {categories.map((category) => (
                                    <label key={category.id} htmlFor={category.name}>
                                        <div className={styles.categoryHeader}>
                                            {category.name}
                                            <button
                                                className={styles.confirmExcludeBtn}
                                                onClick={() => {
                                                    setCategoryToDelete(category.id)
                                                    setConfirmExclusion(true)
                                                }}
                                            >
                                                <FaRegTrashAlt size={16}/>
                                            </button>
                                        </div>
                                        <div className={styles.affinityContainer}>
                                            <input
                                                type="range"
                                                name=""
                                                id={category.id}
                                                min="0" max="2" step="1"
                                                value={newAdvogado.specialties.find((item) => item.id === category.id)?.affinity || 0}
                                                onChange={(ev) => handleSpecialtiesInput(ev)}
                                            />

                                            <p>{newAdvogado.specialties.find((item) => item.id === category.id)?.name || 'Básico'}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} id='addUser' className={styles.formContainer}>
                <small>Dados cadastrais:</small>
                <label className={styles.formlabel}>
                    OAB:
                    <input
                        type="text"
                        onChange={(ev) => handleOABInput(ev)}
                        value={newAdvogado.nroOAB}
                        className={styles.formInput}
                        pattern="^[a-zA-Z]{2}\d{6}$"
                        placeholder='Ex: BA123456'
                        /* required */
                    />
                </label>

                <label className={styles.formlabel}>
                    TELEFONE:
                    <input
                        type="text"
                        autoComplete="no"
                        onChange={(ev) => handlePhoneInput(ev)}
                        value={newAdvogado.phoneNumber}
                        className={styles.formInput}
                        /* pattern="^\(\d{2}\)\d{5}-\d{4}$" */
                        pattern="^(\(\d{2}\)|\d{2})([- ]?)\d{5}[- ]?\d{4}$"
                        placeholder='Ex: (00)00000-0000'
                        /* required */
                    />
                </label>

                <label className={styles.formlabel}>
                    EMAIL:
                    <input
                        type="email"
                        autoComplete="no"
                        onChange={(ev) => {
                            setNewAdvogado({
                                ...newAdvogado,
                                email: ev.currentTarget.value,
                            })
                        }}
                        placeholder='Ex: nome@email.com'
                        value={newAdvogado.email}
                        className={styles.formInput}
                        required
                    />
                </label>

                <label className={styles.formlabel}>
                    SENHA:
                    <input
                        type="password"
                        onChange={(ev) => {
                            setNewAdvogado({
                                ...newAdvogado,
                                password: ev.currentTarget.value,
                            })
                        }}
                        value={newAdvogado.password}
                        className={styles.formInput}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"
                        title="A senha deve conter no mínimo 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial"
                        required
                    />
                </label>

                <button type="submit" className={styles.submit}>
                    SALVAR
                </button>
            </form>
        </div>
    )
}
