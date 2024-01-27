'use client'
import {  useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './index.module.css'
import toast from 'react-hot-toast'

//Icons
import { AiOutlineSearch, AiOutlineComment, AiOutlineEdit } from 'react-icons/ai'
import { RiDeleteBin6Fill, RiCheckboxCircleLine } from 'react-icons/ri'
import { MdOutlineSelectAll, MdOutlineDeselect } from 'react-icons/md'

//Types
import { processProps } from '@/types/processTableAtt'
import { categoryUser, lawyerUser } from '@/types/atributes'
import { stateModal } from '@/types/modal'
import { trash } from '@/types/trash'

//Styles
import obsStatus from '@/styles/status'
import ModalDel from '../Modal (Delete)'
import ModalFree from '../Modal (Free)'

//Functions
import { IdforName } from '@/functions/filter'
import { isEmptyObj } from '@/functions/isEmpty'
import { pathnameStatus, pathnames } from '@/functions/status'

type tableProps = {
    head: Array<string>,
    type: string,
    dbData: Array<processProps>,
    dbLawyer: Array<lawyerUser>,
    dbCategory: Array<categoryUser>
}

export default function ProcessTable({head, type, dbData, dbLawyer, dbCategory}: tableProps){
    const pathname = usePathname()
    const [query, setQuery] = useState<string>('')
    const [data, setData] = useState<Array<processProps>>(dbData)
    const [trash, setTrash] = useState<trash>({})
    const [openModalDel, setOpenModalDel] = useState<stateModal>({open: false, id: []})
    const [openModalFree, setOpenModalFree] = useState<stateModal>({open: false, id: []})
    const { push } = useRouter()

    useEffect(()=>{
        if(query === ''){
            setData(dbData)
        }
        else{
            setData(dbData.filter((row) => row.processKey.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())))
        }

    }, [query, dbData])

    function SelectedProcess(el: React.ChangeEvent<HTMLInputElement>){

        if(!trash[el.currentTarget.value]){
            setTrash({...trash, [el.currentTarget.value]: Number(el.currentTarget.value)})
        }
        else{
            delete trash[el.currentTarget.value]
        }
    }


//  Funções para os botões     

    function SelectAllFunction(el: React.MouseEvent<HTMLButtonElement>){
        let ids: number[] = []
        if(isEmptyObj(trash)){
            data.map(row=>{
                switch(pathnameStatus(pathname)){
                    case 0:
                        if(row.status !== 'Em aguardo' && row.status !== 'Concluído'){  
                            ids.push(row.id)
                        }
                        break

                    case 1:
                        if(row.status === 'Concluído' && pathnameStatus(pathname) === 1){
                            ids.push(row.id)
                        }

                        break
                    case 2:
                        if(row.status === 'Em aguardo' && pathnameStatus(pathname) === 2){
                            ids.push(row.id)
                        }

                        break
                }
            })
            setTrash(ids.reduce((a, v) => ({ ...a, [v.toString()]: v}), {}))
        }else{
            setTrash({})
        }
    }

    function DeleteFunction(el: React.MouseEvent<HTMLButtonElement>){

        if(Object.values(trash).length !== 0){
            setOpenModalDel({open: !openModalDel.open, id: Object.values(trash)})
        }
        else{
            toast.error('Nenhum processo selecionado!')
        }
    }
    
    function FreeFunction(el: React.MouseEvent<HTMLButtonElement>){
        
        if(Object.values(trash).length !== 0){
            setOpenModalFree({open: !openModalFree.open, id: Object.values(trash)})
        }
        else{
            toast.error('Nenhum processo selecionado!')
        }
    }

// ------------------------------------------------------------------------------------------
    
    function setInclusion(date: string){
        if(parseInt(date.substring(5, 7)) <= parseInt(new Date().toISOString().substring(5, 7))){
            return `hà ${parseInt(new Date().toISOString().substring(8, 10)) - parseInt(date.substring(8, 10))} dia(s)`
        }
        else{
            return `hà ${parseInt(new Date().toISOString().substring(5, 7)) - parseInt(date.substring(5, 7))} meses(s)`
        }
    }

    function typeTable(type: string, col: processProps){
        switch(type){
            case 'default':
            if(col.status != 'Em aguardo' && col.status != 'Concluído'){
                return(
                    <div key={col.id}>
                        <input value={col.id} onChange={SelectedProcess} type="checkbox" style={{width: '2rem'}} checked={!trash[col.id.toString()] ? false : true } />

                        <p className={styles.processKeyId} title={col.processKey}>{col.processKey}</p>

                        <p title={col.materia ? col.materia : '--'}>{col.materia ? col.materia : '--'}</p>

                        <p title={col.name? col.name : '--'}>{col.name? col.name : '--'}</p>

                        <p title={IdforName(col.userId, dbLawyer)}>{IdforName(col.userId, dbLawyer)}</p>

                        <p title={IdforName(col.categoryId, dbCategory)}>{IdforName(col.categoryId, dbCategory)}</p>

                        <p>
                            {col.deadline ? `${col.deadline.substring(8, 10)}/
                                ${col.deadline.substring(5, 7)}
                                /${col.deadline.substring(0, 4)}`: '--'}</p>

                        <p title={col.status} style={obsStatus(col.status)}>{col.status}</p>

                        <div className={styles.controlProcess}>
                            <button onClick={()=>push(`/processo/${col.id}`)}>
                                <AiOutlineComment />
                            </button>
                            <button onClick={()=>push(`/painel/processos/${col.id}`)}>
                                <AiOutlineEdit />
                            </button>
                        </div>
                    </div>
                )
            }
            else{
                return null
            }

            case 'waiting':
                if(col.status === 'Em aguardo'){                      
                    return(
                        <div key={col.id} >
                            <input value={col.id} onChange={SelectedProcess} type="checkbox" style={{width: '2rem'}} checked={!trash[col.id.toString()] ? false : true } />

                            <p className={styles.processKeyId} title={col.processKey}>{col.processKey}</p>

                            <p title={col.materia ? col.materia : '--'}>{col.materia ? col.materia : '--'}</p>

                            <p title={col.name? col.name : '--'}>{col.name? col.name : '--'}</p>

                            <p title={IdforName(col.categoryId, dbCategory)}>{IdforName(col.categoryId, dbCategory)}</p>

                            <p>
                            {col.deadline ? `${col.deadline.substring(8, 10)}/
                                ${col.deadline.substring(5, 7)}
                                /${col.deadline.substring(0, 4)}`: '--'}</p>

                            <p>{setInclusion(col.distributionDate)}</p>

                            <p title={col.status} style={obsStatus(col.status)}>{col.status}</p>

                            <div className={styles.controlProcess}>
                                <button onClick={()=>push(`/processo/${col.id}`)}>
                                    <AiOutlineComment />
                                </button>
                                <button onClick={()=>push(`/painel/processos/${col.id}`)}>
                                    <AiOutlineEdit />
                                </button>
                            </div>
                        </div>
                    )
                }
                else{
                    return null
                }


            case 'complete':
                if(col.status === 'Concluído'){
                    return(
                        <div key={col.id}>
                            <input value={col.id} onChange={SelectedProcess} type="checkbox" style={{width: '2rem'}} checked={!trash[col.id.toString()] ? false : true } />

                            <p className={styles.processKeyId} title={col.processKey}>{col.processKey}</p>

                            <p title={col.materia ? col.materia : '--'}>{col.materia ? col.materia : '--'}</p>

                            <p title={col.name? col.name : '--'}>{col.name? col.name : '--'}</p>

                            <p>{dbLawyer.map(el=>{
                                if(el.id == col.userId){
                                    return el.name
                                }
                            })}</p>

                            <p>{col.conclusionDate ? col.conclusionDate.substring(0, 10) : 'Incompleto'}</p>

                            <div className={styles.controlProcess}>
                                <button onClick={()=>push(`/processo/${col.id}`)}>
                                    <AiOutlineComment />
                                </button>
                                <button onClick={()=>push(`/painel/processos/${col.id}`)}>
                                    <AiOutlineEdit />
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
        <>
        <ModalDel isOpen={openModalDel} setOpen={setOpenModalDel}/>
        <ModalFree isOpen={openModalFree} setOpen={setOpenModalFree}/>
        <section className={styles.containerProcess}>
            <div className={styles.backgroundTrash}>
                <button className={styles.selectAllBtn} onClick={SelectAllFunction}>
                    {!isEmptyObj(trash) ?
                    <MdOutlineDeselect />
                    :
                    <MdOutlineSelectAll />
                    }
                </button>
                {
                    pathname !== '/painel/processos' ?
                <button className={styles.freeBtn} onClick={FreeFunction}>
                    <RiCheckboxCircleLine />
                </button> : <></>
                }
                <button className={styles.deleteBtn} onClick={DeleteFunction}>
                    <RiDeleteBin6Fill />
                </button>
            </div>
            <div className={styles.containerTable}>
                <header className={styles.headerTable}>
                    <div style={{width: '2rem'}}></div>
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
                {data.map((col)=>{
                    return typeTable(type, col)
                })}
                </div>
            </div>
        </section>
        </>
    )
}