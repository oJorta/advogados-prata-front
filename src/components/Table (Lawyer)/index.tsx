'use client'
import {  useState, useEffect } from 'react'
import styles from './index.module.css'
import { useParams, useRouter } from 'next/navigation'

//Icons
import { AiOutlineSearch, AiOutlineComment } from 'react-icons/ai'

//Types
import { processProps } from '@/types/processTableAtt'
import { lawyerUser } from '@/types/atributes'

//Styles
import obsStatus from '@/styles/status'

type tableProps = {
    head: Array<string>,
    type: string,
    dbData: Array<processProps>,
}

export default function ProcessTable({head, type, dbData }: tableProps){
    const params = useParams()
    const { push } = useRouter()
    const [data, setData] = useState<Array<processProps>>(dbData)
    const [query, setQuery] = useState<string>('')
    
    useEffect(()=>{
        if(query === ''){
            setData(dbData)
        }
        else{
            setData(dbData.filter((row) => row.processKey.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())))
        }

    }, [query, dbData])

    function tableType(type: string, col: processProps, index: number){
        switch(type){
            case 'default':
                if(col.status != 'Concluído' && col.userId === Number(params.id)){
                    return(
                        <div key={index}>

                            <p className={styles.processKeyId} title={col.processKey}>{col.processKey}</p>

                            <p>
                                {col.deadline ? `${col.deadline.substring(8, 10)}/
                                    ${col.deadline.substring(5, 7)}
                                    /${col.deadline.substring(0, 4)}`: '--'}</p>

                            <p title={col.materia ? col.materia : '--'}>{col.materia ? col.materia : '--'}</p>

                            <p title={col.name? col.name : '--'}>{col.name? col.name : '--'}</p>

                            <p title={col.status} style={obsStatus(col.status)}>{col.status}</p>

                            <div className={styles.controlProcess}>
                                    <button onClick={()=>push(`/processo/${col.id}`)}>
                                        <AiOutlineComment />
                                    </button>
                            </div>
                        </div>
                    )
                }
                else{
                    return null
                }

            case 'complete':
                if(col.status === 'Concluído' && col.userId === Number(params.id)){
                    return(
                        <div key={index}>
                        <p className={styles.processKeyId} title={col.processKey}>{col.processKey}</p>

                        <p title={col.name? col.name : '--'}>{col.name? col.name : '--'}</p>

                        <p title={col.materia ? col.materia : '--'}>{col.materia ? col.materia : '--'}</p>

                            <p>{col.conclusionDate ? col.conclusionDate.substring(0, 10) : 'Incompleto'}</p>
                            
                            <div className={styles.controlProcess}>
                                <button onClick={()=>push(`/processo/${col.id}`)}>
                                    <AiOutlineComment />
                                </button>
                            </div>
                        </div>
                    )
                }
                else{
                    return null
                }
        }
    }

    return(
        <section className={styles.containerTable}>
            <header className={styles.headerTable}>
                <ul className={styles.titleCol}>
                    {head.map((li, index)=>{
                        return <span key={index}><strong>{li}</strong></span>
                    })}
                <label htmlFor='searchInput' className={styles.tableSearch}>
                        <input id='searchInput' type="text" value={query} onChange={(el : React.FormEvent<HTMLInputElement>)=>{
                            setQuery(el.currentTarget.value)
                        }}  />
                        <AiOutlineSearch />
                </label>
                </ul>
            </header>
            <hr />
            <div className={styles.tableCol}>
            {data.map((col, index)=>{
                return tableType(type, col, index)
            })}
            </div>
        </section>
    )
}