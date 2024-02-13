'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { z } from 'zod'
import styles from './page.module.css'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

//Icons
import { BsFilter } from 'react-icons/bs'

//types
import { inputError } from '@/types/inputError'
import { filter } from '@/types/filter'
import { Status, sort } from '@/types/enums'

//Components
import InputError from '@/components/input (Error)'
import { outputFilter } from '@/functions/filter'


export default function Relatorio(){
    const router = useRouter()

    const [filter, setFilter] = useState<filter>({
        categories: [],
        customers: [],
        deadlines: [],
        materias: [],
        users: []
    })

    useEffect(()=>{
        axios.get('http://localhost:3333/api/processes-report-filter-values',                 
            {
                withCredentials: true,
            })
            .then(res=>{
                console.log(res.data)
                setFilter(res.data)
            })
            .catch(err=>{
                return []
            })
    },[])

    const formReport = z.object({
        sort: z.string().nonempty('Obrigatório a seleção de uma ordenação'),
        beginningDistributionDate: z.coerce.date(),
        endDistributionDate: z.coerce.date(),
        matter: z.string().nonempty('Selecionar uma Opção'),
        category: z.number().nonnegative('Selecionar uma Opção'),
        name: z.string().nonempty('Selecionar uma Opção'),
        user: z.number().nonnegative('Selecionar uma Opção'),
        status:z.string().nonempty('Selecionar uma Opção'),
        withUser: z.string().nonempty('Selecione uma Opção'),
    })

    type credentialInputs = z.infer< typeof formReport>

    const [inputReport, setInputReport] = useState<credentialInputs>({
        sort: '',
        beginningDistributionDate:new Date(),
        endDistributionDate:new Date(),
        matter: 'None',
        category: 0,
        name: 'None',
        user: 0,
        status: 'None',
        withUser: 'true',
    })
    
    const [inputError, setInputError] = useState<inputError>({
        sort: {error: false, onFocus: false, textError:''},
        beginningDistributionDate: {error: false, onFocus: false, textError:''},
        endDistributionDate: {error: false, onFocus: false, textError:''},
        matter: {error: false, onFocus: false, textError:''},
        category: {error: false, onFocus: false, textError:''},
        name: {error: false, onFocus: false, textError:''},
        user: {error: false, onFocus: false, textError:''},
        status: {error: false, onFocus: false, textError:''},
        withUser: {error: false, onFocus: false, textError:''}
    })

    async function handleSubmit(ev: React.FormEvent<HTMLFormElement>){
        const validation = formReport.safeParse(inputReport)

        if(!validation.success){

            let setError: inputError = inputError

            validation.error.issues.map(el=>{

                if(inputError[el.path[0].toString()].error == false){
                    setError = {... setError, [el.path[0].toString()]:{error: true, onFocus: false, textError: el.message}}
                }
            })
            setInputError(setError)
        }
        else{

            let query: string = ''/* 
            if(Object.keys(validation.data) && Object.keys(validation.data))
                query += '?' */

            for(let arg in validation.data){
                const keys = Object.keys(validation.data)
                const values = Object.values(validation.data)

                if(values.at(keys.indexOf(arg)) != 'None' && values.at(keys.indexOf(arg)) != 0){
                    query += outputFilter(arg, values, keys)
                }
            }

            console.log(`http://localhost:3333/api/processes-report?${query.substring(0, query.length-1)}`)

            axios.get(`http://localhost:3333/api/processes-report?${query.substring(0, query.length-1)}`,
            {
                withCredentials: true,
                headers:{
                    "Content-Type": "application/pdf"
                    },
                responseType: 'arraybuffer',
                responseEncoding: 'utf8'
            })
            .then(res => {
                toast.success('Filtro bem sucedido!')
                const file = new Blob([res.data], { type: "application/pdf" })
                const fileURL = URL.createObjectURL(file)
                window.open(fileURL, '_blank')
                })
                .catch(error=>{
                    console.log(error)
                    toast.error('Nenhum processo encontrado.')
                })
            
            ev.preventDefault()
        }
        ev.preventDefault()
    }


    function addStyle(verify?: boolean){
        if(verify){
            return {border: 'solid 0.125rem var(--color-invalid)'}
        }
    }

    return (
        <section className={styles.container}>
            <form
                id="formRelatorio"
                onSubmit={handleSubmit}
                className={styles.form}
            >
                <div className={styles.containerInput}>
                    <span>Período:</span>
                    <div className={styles.containerInputDate}>
                        <label className={styles.labelSelectDate}>
                            <span>Período de Início:</span>
                            <input
                                type="date"
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        beginningDistributionDate: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.beginningDistributionDate
                                    .toISOString()
                                    .substring(0, 10)}
                                onChange={(
                                    el: React.FormEvent<HTMLInputElement>
                                ) => {
                                    if (el.currentTarget.value === '') {
                                        setInputReport({
                                            ...inputReport,
                                            beginningDistributionDate: new Date(),
                                        })
                                    } else {
                                        setInputReport({
                                            ...inputReport,
                                            beginningDistributionDate: new Date(
                                                el.currentTarget.value
                                            ),
                                        })
                                    }
                                }}
                                style={addStyle(
                                    inputError.beginningDistributionDate.error
                                )}
                            />

                            {inputError.beginningDistributionDate.error && (
                                <InputError
                                    text={inputError.beginningDistributionDate.textError}
                                    style={true}
                                />
                            )}
                        </label>

                        <label className={styles.labelSelectDate}>
                            <span>Período de Término:</span>
                            <input
                                type="date"
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        endDistributionDate: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.endDistributionDate
                                    .toISOString()
                                    .substring(0, 10)}
                                onChange={(
                                    el: React.FormEvent<HTMLInputElement>
                                ) => {
                                    if (el.currentTarget.value === '') {
                                        setInputReport({
                                            ...inputReport,
                                            endDistributionDate: new Date(),
                                        })
                                    } else {
                                        setInputReport({
                                            ...inputReport,
                                            endDistributionDate: new Date(
                                                el.currentTarget.value
                                            ),
                                        })
                                    }
                                }}
                                style={addStyle(inputError.endDistributionDate.error)}
                            />

                            {inputError.endDistributionDate.error && (
                                <InputError
                                    text={inputError.endDistributionDate.textError}
                                    style={true}
                                />
                            )}
                        </label>
                    </div>
                    {inputError.endDistributionDate.error && (
                        <InputError
                            text={inputError.endDistributionDate.textError}
                            style={true}
                        />
                    )}
                </div>
                <div className={styles.containerInput}>
                    <span>Ordernar por:</span>

                    <label className={styles.labelSelect}>
                        <select
                            onFocus={() =>
                                setInputError({
                                    ...inputError,
                                    sort: {
                                        error: false,
                                        onFocus: true,
                                        textError: '',
                                    },
                                })
                            }
                            value={inputReport.sort}
                            onChange={(
                                el: React.FormEvent<HTMLSelectElement>
                            ) => {
                                setInputReport({
                                    ...inputReport,
                                    sort: el.currentTarget.value,
                                })
                            }}
                            style={addStyle(inputError.sort.error)}
                        >
                            <option value="">Selecione uma ordem</option>
                            <option value={sort.Lawyer}>Advogado</option>
                            <option value={sort.Client}>Cliente</option>
                            <option value={sort.Deadline}>Prazo</option>
                            <option value={sort.DistributionDate}>
                                Data de Início
                            </option>
                            <option value={sort.ConclusionDate}>
                                Data de Conclusão
                            </option>
                            <option value={sort.Category}>Categoria</option>
                        </select>
                    </label>
                    {inputError.sort.error && (
                        <InputError
                            text={inputError.sort.textError}
                            style={false}
                        />
                    )}
                </div>

                <div className={styles.containerInput}>
                    <span>Relatório com advogado?</span>

                    <div className={styles.radioContainer}>
                        <label htmlFor="yes">
                            <input
                                type="radio"
                                name="role"
                                id="yes"
                                value="true"
                                checked={inputReport.withUser === 'true'}
                                onChange={(el: React.ChangeEvent<HTMLInputElement>) => setInputReport({...inputReport, withUser: el.currentTarget.value})}
                            />
                            Sim
                        </label>
                        <label htmlFor="no">
                            <input
                                type="radio"
                                name="role"
                                id="no"
                                value="false"
                                checked={inputReport.withUser === 'false'}
                                onChange={(el: React.ChangeEvent<HTMLInputElement>) => setInputReport({...inputReport, withUser: el.currentTarget.value})}
                            />
                            Não
                        </label>
                    </div>
                    {/* <select 
                        onFocus={()=>setInputError({... inputError, withUser:{error: false, onFocus: true, textError: ''}})}

                        value={inputReport.withUser} onChange={(el : React.FormEvent<HTMLSelectElement>)=>{
                            setInputReport({... inputReport, withUser: el.currentTarget.value})
                        }}
                        style={addStyle(inputError.withUser.error)}>
                            <option value=''>Selecione uma opção</option>
                            <option value='false'>Sim</option>
                            <option value='true'>Não</option>
                        {inputError.withUser.error && <InputError text={inputError.withUser.textError} style={false} />}
                        </select> */}
                </div>

                <div className={styles.containerFilter}>
                    <span>
                        <BsFilter /> Filtros:
                    </span>

                    <div className={styles.containerInputFilter}>
                        <span>Advogados:</span>

                        <label className={styles.labelSelect}>
                            <select
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        user: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.user}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        user: Number(el.currentTarget.value),
                                    })
                                }}
                                style={addStyle(inputError.user.error)}
                            >
                                <option value={-1}>
                                    Selecione um Advogado
                                </option>
                                <option value={0}>Sem Advogado</option>
                                {filter.users.map((val) => {
                                    if (val.name != null) {
                                        return (
                                            <option key={val.id} value={val.id}>
                                                {val.name}
                                            </option>
                                        )
                                    }
                                })}
                            </select>
                        </label>
                        {inputError.user.error && (
                            <InputError
                                text={inputError.user.textError}
                                style={false}
                            />
                        )}
                    </div>

                    <div className={styles.containerInputFilter}>
                        <span>Categoria:</span>
                        <label className={styles.labelSelect}>
                            <select
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        category: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.category}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        category: Number(
                                            el.currentTarget.value
                                        ),
                                    })
                                }}
                                style={addStyle(inputError.category.error)}
                            >
                                <option value={-1}>
                                    Selecione uma Categoria
                                </option>
                                <option value={0}>Sem Categoria</option>
                                {filter.categories.map((val) => {
                                    if (val.name != null) {
                                        return (
                                            <option key={val.id} value={val.id}>
                                                {val.name}
                                            </option>
                                        )
                                    }
                                })}
                            </select>
                        </label>
                        {inputError.category.error && (
                            <InputError
                                text={inputError.category.textError}
                                style={false}
                            />
                        )}
                    </div>

                    <div className={styles.containerInputFilter}>
                        <span>Cliente:</span>
                        <label className={styles.labelSelect}>
                            <select
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        name: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.name}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        name: el.currentTarget.value,
                                    })
                                }}
                                style={addStyle(inputError.name.error)}
                            >
                                <option value="">Selecione um Cliente</option>
                                <option value="None">Sem Cliente</option>
                                {filter.customers.map((val, index) => {
                                    if (val != null) {
                                        return (
                                            <option key={index} value={val}>
                                                {val}
                                            </option>
                                        )
                                    }
                                })}
                            </select>
                        </label>
                        {inputError.name.error && (
                            <InputError
                                text={inputError.name.textError}
                                style={false}
                            />
                        )}
                    </div>

                    <div className={styles.containerInputFilter}>
                        <span>Matéria:</span>
                        <label className={styles.labelSelect}>
                            <select
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        matter: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.matter}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        matter: el.currentTarget.value,
                                    })
                                }}
                                style={addStyle(inputError.matter.error)}
                            >
                                <option value="">Selecione uma Matéria</option>
                                <option value="None">Sem Matéria</option>
                                {filter.materias.map((val, index) => {
                                    if (val != null) {
                                        return (
                                            <option key={index} value={val}>
                                                {val}
                                            </option>
                                        )
                                    }
                                })}
                            </select>
                        </label>
                        {inputError.matter.error && (
                            <InputError
                                text={inputError.matter.textError}
                                style={false}
                            />
                        )}
                    </div>

                    <div className={styles.containerInputFilter}>
                        <span>Status:</span>
                        <label className={styles.labelSelect}>
                            <select
                                onFocus={() =>
                                    setInputError({
                                        ...inputError,
                                        status: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.status}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        status: el.currentTarget.value,
                                    })
                                }}
                                style={addStyle(inputError.status.error)}
                            >
                                <option value="">Selecione um Status</option>
                                <option value="None">Sem Status</option>
                                <option value={Status.NaoVisualizado}>
                                    {Status.NaoVisualizado}
                                </option>
                                <option value={Status.EmAguardo}>
                                    {Status.EmAguardo}
                                </option>
                                <option value={Status.AguardandoRetorno}>
                                    {Status.AguardandoRetorno}
                                </option>
                                <option value={Status.EmInicializacao}>
                                    {Status.EmInicializacao}
                                </option>
                                <option value={Status.EmAndamento}>
                                    {Status.EmAndamento}
                                </option>
                                <option value={Status.Concluido}>
                                    {Status.Concluido}
                                </option>
                            </select>
                        </label>
                        {inputError.status.error && (
                            <InputError
                                text={inputError.status.textError}
                                style={false}
                            />
                        )}
                    </div>
                </div>
            </form>

            <input
                className={styles.labelInputBtn}
                type="submit"
                form="formRelatorio"
                value="Baixar Arquivo"
            />
        </section>
    )
}