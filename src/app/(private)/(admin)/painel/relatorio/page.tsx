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
import { Status, orderBy } from '@/types/enums'

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
        orderBy: z.string().nonempty('Obrigatório a seleção de uma ordenação'),
        beginningPeriod: z.coerce.date(),
        endPeriod: z.coerce.date(),
        matter: z.string().nonempty('Selecionar uma Opção'),
        categoryId: z.number().nonnegative('Selecionar uma Opção'),
        name: z.string().nonempty('Selecionar uma Opção'),
        userId: z.number().nonnegative('Selecionar uma Opção'),
        status:z.string().nonempty('Selecionar uma Opção'),
        removeLawyers: z.string().nonempty('Selecione uma Opção'),
    })

    type credentialInputs = z.infer< typeof formReport>

    
    const [inputReport, setInputReport] = useState<credentialInputs>({
        orderBy: '',
        beginningPeriod:new Date(),
        endPeriod:new Date(),
        matter: 'None',
        categoryId: 0,
        name: 'None',
        userId: 0,
        status: 'None',
        removeLawyers: 'false',
    })
    
    const [inputError, setInputError] = useState<inputError>({
        orderBy: {error: false, onFocus: false, textError:''},
        beginningPeriod: {error: false, onFocus: false, textError:''},
        endPeriod: {error: false, onFocus: false, textError:''},
        matter: {error: false, onFocus: false, textError:''},
        categoryId: {error: false, onFocus: false, textError:''},
        name: {error: false, onFocus: false, textError:''},
        userId: {error: false, onFocus: false, textError:''},
        status: {error: false, onFocus: false, textError:''},
        removeLawyers: {error: false, onFocus: false, textError:''}
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

            let query: string = ''
            for( let arg in validation.data){
                const keys = Object.keys(validation.data)
                const values = Object.values(validation.data)
                
                if(values.at(keys.indexOf(arg)) != 'None' && values.at(keys.indexOf(arg)) != 0){
                    query += outputFilter( arg, values, keys)
                }
            }
        
            console.log(query)
            /* console.log(`http://localhost:3333/api/processes-report?filters={${query.substring(0, query.length-1).concat('}')}`) */
            axios.get(`http://localhost:3333/api/processes-report?filters={${query.substring(0, query.length-1).concat('}')}`,
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
                                        beginningPeriod: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.beginningPeriod
                                    .toISOString()
                                    .substring(0, 10)}
                                onChange={(
                                    el: React.FormEvent<HTMLInputElement>
                                ) => {
                                    if (el.currentTarget.value === '') {
                                        setInputReport({
                                            ...inputReport,
                                            beginningPeriod: new Date(),
                                        })
                                    } else {
                                        setInputReport({
                                            ...inputReport,
                                            beginningPeriod: new Date(
                                                el.currentTarget.value
                                            ),
                                        })
                                    }
                                }}
                                style={addStyle(
                                    inputError.beginningPeriod.error
                                )}
                            />

                            {inputError.beginningPeriod.error && (
                                <InputError
                                    text={inputError.beginningPeriod.textError}
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
                                        endPeriod: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.endPeriod
                                    .toISOString()
                                    .substring(0, 10)}
                                onChange={(
                                    el: React.FormEvent<HTMLInputElement>
                                ) => {
                                    if (el.currentTarget.value === '') {
                                        setInputReport({
                                            ...inputReport,
                                            endPeriod: new Date(),
                                        })
                                    } else {
                                        setInputReport({
                                            ...inputReport,
                                            endPeriod: new Date(
                                                el.currentTarget.value
                                            ),
                                        })
                                    }
                                }}
                                style={addStyle(inputError.endPeriod.error)}
                            />

                            {inputError.endPeriod.error && (
                                <InputError
                                    text={inputError.endPeriod.textError}
                                    style={true}
                                />
                            )}
                        </label>
                    </div>
                    {inputError.endPeriod.error && (
                        <InputError
                            text={inputError.endPeriod.textError}
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
                                    orderBy: {
                                        error: false,
                                        onFocus: true,
                                        textError: '',
                                    },
                                })
                            }
                            value={inputReport.orderBy}
                            onChange={(
                                el: React.FormEvent<HTMLSelectElement>
                            ) => {
                                setInputReport({
                                    ...inputReport,
                                    orderBy: el.currentTarget.value,
                                })
                            }}
                            style={addStyle(inputError.orderBy.error)}
                        >
                            <option value="">Selecione uma ordem</option>
                            <option value={orderBy.Lawyer}>Advogado</option>
                            <option value={orderBy.Client}>Cliente</option>
                            <option value={orderBy.Deadline}>Prazo</option>
                            <option value={orderBy.DistributionDate}>
                                Data de Início
                            </option>
                            <option value={orderBy.ConclusionDate}>
                                Data de Conclusão
                            </option>
                            <option value={orderBy.Category}>Categoria</option>
                        </select>
                    </label>
                    {inputError.orderBy.error && (
                        <InputError
                            text={inputError.orderBy.textError}
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
                                value="false"
                                checked={inputReport.removeLawyers === 'false'}
                                onChange={(el: React.ChangeEvent<HTMLInputElement>) => setInputReport({...inputReport, removeLawyers: el.currentTarget.value})}
                            />
                            Sim
                        </label>
                        <label htmlFor="no">
                            <input
                                type="radio"
                                name="role"
                                id="no"
                                value="true"
                                checked={inputReport.removeLawyers === 'true'}
                                onChange={(el: React.ChangeEvent<HTMLInputElement>) => setInputReport({...inputReport, removeLawyers: el.currentTarget.value})}
                            />
                            Não
                        </label>
                    </div>
                    {/* <select 
                        onFocus={()=>setInputError({... inputError, removeLawyers:{error: false, onFocus: true, textError: ''}})}

                        value={inputReport.removeLawyers} onChange={(el : React.FormEvent<HTMLSelectElement>)=>{
                            setInputReport({... inputReport, removeLawyers: el.currentTarget.value})
                        }}
                        style={addStyle(inputError.removeLawyers.error)}>
                            <option value=''>Selecione uma opção</option>
                            <option value='false'>Sim</option>
                            <option value='true'>Não</option>
                        {inputError.removeLawyers.error && <InputError text={inputError.removeLawyers.textError} style={false} />}
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
                                        userId: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.userId}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        userId: Number(el.currentTarget.value),
                                    })
                                }}
                                style={addStyle(inputError.userId.error)}
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
                        {inputError.userId.error && (
                            <InputError
                                text={inputError.userId.textError}
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
                                        categoryId: {
                                            error: false,
                                            onFocus: true,
                                            textError: '',
                                        },
                                    })
                                }
                                value={inputReport.categoryId}
                                onChange={(
                                    el: React.FormEvent<HTMLSelectElement>
                                ) => {
                                    setInputReport({
                                        ...inputReport,
                                        categoryId: Number(
                                            el.currentTarget.value
                                        ),
                                    })
                                }}
                                style={addStyle(inputError.categoryId.error)}
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
                        {inputError.categoryId.error && (
                            <InputError
                                text={inputError.categoryId.textError}
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