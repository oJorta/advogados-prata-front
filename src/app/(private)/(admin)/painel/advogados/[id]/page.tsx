'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Cookies from 'js-cookie'
import styles from './page.module.css'

import advogadoIcon from '@/../public/icons/advogadoIcon.svg'
import { BiEdit } from 'react-icons/bi'

import { phoneMask, cpfMask } from '@/functions/masks'
import { affinityName } from '@/functions/affinity'
import { processProps } from '@/types/processTableAtt'
import Table from '@/components/Table (Lawyer)'

import { MdOutlineArrowDropDown } from 'react-icons/md'
import { IoMdAdd } from 'react-icons/io'
import { FaRegTrashAlt } from "react-icons/fa";
import { AiOutlineClose } from 'react-icons/ai'

type Advogado = {
    name: string
    nroOAB: string
    phoneNumber: string
    email: string
    role: string
    specialties: any[]
}

const TABLEHEADER: Array<string> = ['Processo','Prazo','Matéria','Cliente','Status']

export default function AdvogadoID() {
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isEditing, setIsEditing] = useState<boolean>(false)
    const [dropdownIsOpen, setDropdownIsOpen] = useState<boolean>(false)
    const [processes, setProcesses] = useState([] as any[])
    const [categories, setCategories] = useState([] as any[])
    const [newCategory, setNewCategory] = useState('' as string)
    const [specialties, setSpecialties] = useState([] as any[])
    const [advogado, setAdvogado] = useState<Advogado>({
        name: '',
        nroOAB: '',
        phoneNumber: '',
        email: '',
        role: '',
        specialties: [],
    })
    const previousEmail = useRef('')
    const dropdownBarRef = useRef(null)
    const dropdownRef = useRef(null)
    const [selectedTable, setSelectedTable] = useState<string>('default' as string)
    const [confirmExclusion, setConfirmExclusion] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<number | undefined>(undefined)

    useEffect(() => {
        const getData = async () => {
            const user = await axios.get(
                `http://localhost:3333/api/user/${id}`,
                {
                    withCredentials: true
                }
            )

            const processes = await axios.get(
                'http://localhost:3333/api/processes',
                {
                    withCredentials: true
                }
            )
            setProcesses(processes.data)

            const categories = await axios.get(
                'http://localhost:3333/api/categories',
                {
                    withCredentials: true
                }
            )
            setCategories(categories.data)

            const specialties = await axios.get(
                `http://localhost:3333/api/specialties?user=${user.data.id}`,
                {
                    withCredentials: true
                }
            )
            setSpecialties(specialties.data)
            
            previousEmail.current = user.data.email
            setAdvogado({
                name: user.data.name,
                nroOAB: user.data.nroOAB || '',
                phoneNumber: user.data.phoneNumber ? phoneMask(user.data.phoneNumber) : '',
                email: user.data.email,
                role: user.data.role,
                specialties: specialties.data.map((specialty: any) => ( { id: specialty.categoryId, affinity: specialty.affinity, name: affinityName(specialty.affinity) } )),
            })
        }
        
        getData()

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownBarRef.current && !(dropdownBarRef.current as any).contains(event.target) && dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
                setDropdownIsOpen(false)
            }
        }
        
        document.addEventListener('click', handleClickOutside)
    
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [isLoading])

    useEffect(() => {
        const getCategories = async () => {
            const { data } = await axios.get(
                'http://localhost:3333/api/categories',
                {
                    withCredentials: true
                }
            )
            setCategories(data)
        }
        getCategories()
    }, [categories])

    useEffect(() => {
        const getSpecialties = async () => {
            const { data } = await axios.get(
                'http://localhost:3333/api/specialties',
                {
                    withCredentials: true
                }
            )
            setSpecialties(data.filter((specialty: any) => specialty.userId === Number(id)))
        }
        getSpecialties()
    }, [specialties])

    function handleOABInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        value.length <= 8 && setAdvogado({ ...advogado, nroOAB: value })
    }

    function handlePhoneInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        const phone = phoneMask(value)
        value.length <= 14 &&
            setAdvogado({ ...advogado, phoneNumber: phone })
    }

    function handleRoleInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        value === 'admin' && setAdvogado({ ...advogado, specialties: [] })
        setAdvogado({ ...advogado, role: value })
    }

    function handleCategoryInput(ev: React.FormEvent<HTMLInputElement>) {
        const { value } = ev.currentTarget
        setNewCategory(value)
    }

    async function handleAddNewCategory() {
        try {
            const response = await axios.post(
                'http://localhost:3333/api/category',
                {
                    name: newCategory,
                },
                {
                    withCredentials: true,
                }
            )
    
            setCategories([...categories, response.data.name]);
    
            const { data } = await axios.get(
                'http://localhost:3333/api/users',
                {
                    withCredentials: true,
                }
            )
    
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
                            withCredentials: true
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
            setAdvogado({
                ...advogado,
                specialties: advogado.specialties.filter((item) => item.id !== Number(id)),
            })
            return
        } */

        setAdvogado({
            ...advogado,
            specialties: advogado.specialties.filter((item) => item.id !== Number(id)).concat({ id: Number(id), affinity: Number(value), name: affinityName(Number(value)) })
        })
    }

    async function handleDeleteCategory(id: number) {
        try {
            await axios.delete(`http://localhost:3333/api/category/${id}`, {
                withCredentials: true
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

        let userData = {
            name: advogado.name,
            nroOAB: advogado.nroOAB,
            role: advogado.role,
            phoneNumber: advogado.phoneNumber.match(/\d+/g)?.join(''),
            /* ...advogado, */
        } as any

        if (advogado.email !== previousEmail.current) {
            userData = {
                ...userData,
                email: advogado.email,
            }
        }
        
        await axios
        .patch(`http://localhost:3333/api/user/${id}`, userData, {
            withCredentials: true
            })
            .then((response) => {
                advogado.role === 'admin' && setAdvogado({ ...advogado, specialties: [] })

                const changedSpecialties = advogado.specialties.filter((specialty: any) => specialties.map((specialty: any) => specialty.categoryId).includes(specialty.id))
                /* const addedSpecialties = advogado.specialties.filter((specialty: any) => !specialties.map((specialty: any) => specialty.category.id).includes(specialty.id))
                const removedSpecialties = specialties.filter((specialty: any) => !advogado.specialties.map((specialty: any) => specialty.id).includes(specialty.category.id)) */

                setSpecialties(specialties.filter((specialty: any) => advogado.specialties.includes(specialty.categoryId)))

                if(changedSpecialties.length === 0) {
                    toast.success('Usuário atualizado com sucesso!')
                    setIsLoading(false)
                    return
                }

                changedSpecialties.length > 0 &&
                    changedSpecialties.forEach(async (specialty: any) => {
                        const specialtyId = specialties.find((item: any) => item.categoryId === specialty.id).id

                        await axios.patch(
                            `http://localhost:3333/api/specialty/${specialtyId}`,
                            {   
                                affinity: specialty.affinity,
                                userId: Number(id),
                                categoryId: specialty.id
                            },
                            {
                                withCredentials: true
                            }
                        )
                    })

                toast.success('Usuário atualizado com sucesso!')
                setIsLoading(false)
                setIsEditing(false)
            })
            .catch((error) => {
                console.log(error)
                toast.error(`Erro: ${error.response.data.message}`)
                setIsLoading(false)
                setIsEditing(false)
            })
    }

    function filterProcesses(id: number, status: string) {
        switch (status) {
            case 'Concluído':
                return processes.filter((process) => process.userId === id && process.status === 'Concluído')
            default:
                return processes.filter((process) => process.userId === id && process.status !== 'Concluído')
        }
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
                    <div>
                        <input
                            type="text"
                            placeholder="NOME"
                            autoComplete="no"
                            onChange={(ev) => {
                                setAdvogado({
                                    ...advogado,
                                    name: ev.currentTarget.value,
                                })
                            }}
                            value={advogado.name}
                            className={styles.nameInput}
                            required
                            {...!isEditing && { disabled: true }}
                        />

                        <BiEdit onClick={() => setIsEditing(!isEditing)} className={styles.editIcon} />
                    </div>

                    <small>Dados de processos:</small>
                    <label className={styles.formlabel}>
                        EM ANDAMENTO:
                        <p>{filterProcesses(Number(id), 'Andamento').length}</p>
                    </label>

                    <label className={styles.formlabel}>
                        CONCLUÍDOS:
                        <p>{filterProcesses(Number(id), 'Concluído').length}</p>
                    </label>

                    <div className={styles.roleSelection}>
                        TIPO:
                        <div>
                            <label htmlFor="lawyer">
                                Advogado
                                <input
                                    type="radio"
                                    name="role"
                                    id="lawyer"
                                    value="lawyer"
                                    checked={advogado.role === "lawyer"}
                                    onChange={(ev) => handleRoleInput(ev)}
                                    {...!isEditing && { disabled: true }}/>
                            </label>
                            <label htmlFor="admin">
                                Administrador
                                <input
                                    type="radio"
                                    name="role"
                                    id="admin"
                                    value="admin"
                                    checked={advogado.role === "admin"}
                                    onChange={(ev) => handleRoleInput(ev)}
                                    {...!isEditing && { disabled: true }}/>
                            </label>
                        </div>
                    </div>    
                    
                    <small
                        {...advogado.role === 'admin' && {style:{display: "none"}}}
                    >
                        Especialidades:
                    </small>
                    
                    <div
                        className={styles.dropdownContainer}
                        style={{display: confirmExclusion ? "none" : "block"}}
                        {...advogado.role === 'admin' && {style:{display: "none"}}}
                    >
                        <div className={styles.dropdownBar} ref={dropdownBarRef}>
                            <input
                                type="text"
                                name="" id=""
                                placeholder='Insira uma nova categoria'
                                onChange={(ev) => handleCategoryInput(ev)}
                                onFocus={() => setDropdownIsOpen(true)}
                                disabled={!isEditing}  
                            />
                            <button
                                onClick={handleAddNewCategory}
                                disabled={!isEditing}
                            >
                                <IoMdAdd/>
                            </button>
                            <button
                                onClick={() => setDropdownIsOpen(!dropdownIsOpen)}
                            >
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
                                                value={advogado.specialties.find((item) => item.id === category.id)?.affinity || 0}
                                                onChange={(ev) => handleSpecialtiesInput(ev)}
                                                disabled={!isEditing}
                                            />

                                            <p>{advogado.specialties.find((item) => item.id === category.id)?.name || 'Básico'}</p>
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
                        value={advogado.nroOAB}
                        className={styles.formInput}
                        pattern="^[a-zA-Z]{2}\d{6}$"
                        title='Ex: BA123456'
                        /* required */
                        {...!isEditing && { disabled: true }}
                    />
                </label>

                <label className={styles.formlabel}>
                    TELEFONE:
                    <input
                        type="text"
                        autoComplete="no"
                        onChange={(ev) => handlePhoneInput(ev)}
                        value={advogado.phoneNumber}
                        className={styles.formInput}
                        /* pattern="^\(\d{2}\)\d{5}-\d{4}$" */
                        pattern="^(\(\d{2}\)|\d{2})([- ]?)\d{5}[- ]?\d{4}$"
                        /* required */
                        {...!isEditing && { disabled: true }}
                    />
                </label>

                <label className={styles.formlabel}>
                    EMAIL:
                    <input
                        type="email"
                        autoComplete="no"
                        onChange={(ev) => {
                            setAdvogado({
                                ...advogado,
                                email: ev.currentTarget.value,
                            })
                        }}
                        value={advogado.email}
                        className={styles.formInput}
                        required
                        {...!isEditing && { disabled: true }}
                    />
                </label>
                
                {isEditing && (
                    <button type="submit" className={styles.submit}>
                        SALVAR
                    </button>
                )}
            </form>

            {advogado.role === 'lawyer' && (
                <div className={styles.processesContainer}>
                <div className={styles.tableSelection}>
                        <h3
                            onClick={() => setSelectedTable('default')}
                            {...selectedTable === 'default' && {style:{borderBottom: '3px solid #000'}}}
                        >
                            PROCESSOS EM ANDAMENTO
                        </h3>
                        <h3
                            onClick={() => setSelectedTable('complete')}
                            {...selectedTable === 'complete' && {style:{borderBottom: '3px solid #000'}}}
                        >
                            PROCESSOS CONCLUÍDOS
                        </h3>
                </div>

                <div className={styles.tableContainer}>
                    <Table head={TABLEHEADER} type={selectedTable} dbData={processes} />
                </div>
            </div>
            )}
        </div>
    )
}
