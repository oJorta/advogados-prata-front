'use client'
import {  useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import styles from './index.module.css'
import toast from 'react-hot-toast'

//Icons
import { AiOutlineSearch, AiOutlineComment, AiOutlineEdit, AiFillBell } from 'react-icons/ai'
import { RiDeleteBin6Fill, RiCheckboxCircleLine } from 'react-icons/ri'

//Types
import { processProps } from '@/types/processTableAtt'
import { stateModal } from '@/types/modal'
import { trash } from '@/types/trash'
import { SortBy } from '@/types/enums'

//Styles
import ModalDel from '../Modal (Delete)'
import ModalFree from '../Modal (Free)'

//Functions
import { isEmptyObj } from '@/functions/isEmpty'
import { pathnameStatus, pathnames } from '@/functions/status'
import getStatusStyle from '@/functions/getProcessStatusStyle'

type tableProps = {
    tableHeaders: Array<string>,
    type: string,
    tableData: Array<processProps>
}

export default function ProcessTable({tableHeaders, type, tableData}: tableProps){
    const pathname = usePathname()
    const [query, setQuery] = useState<string>('')
    const [sort, setSort] = useState<{
        collumn: SortBy | undefined
        order: 'asc' | 'desc'
    }>({ collumn: SortBy.PRAZO, order: 'asc' })
    const [data, setData] = useState<Array<processProps>>(tableData)
    const [trash, setTrash] = useState<trash>({})
    const [openModalDel, setOpenModalDel] = useState<stateModal>({open: false, id: []})
    const [openModalFree, setOpenModalFree] = useState<stateModal>({open: false, id: []})
    const { push } = useRouter()

    useEffect(() => {
        filterData(tableData, type)
        sortTable(sort.collumn, sort.order)
    }, [])

    useEffect(() => {
        sortTable(sort.collumn, sort.order)
    }, [sort])

    useEffect(() => {
        if (query === '') {
            filterData(tableData, type)
            sortTable(sort.collumn, sort.order)
        } else {
            const filteredData = tableData.filter((process) => {
                return Object.values(process).some((value) => {
                    return String(value).toLowerCase().includes(query.toLowerCase())
                })
            })
            filterData(filteredData, type)
        }
    }, [query])

    function selectProcess(el: React.ChangeEvent<HTMLInputElement>) {
        const value = el.currentTarget.value;
        const updatedTrash = { ...trash };

        if (updatedTrash[value]) {
            delete updatedTrash[value];
        } else {
            updatedTrash[value] = Number(value);
        }

        setTrash(updatedTrash);
    }

    function selectAllProcesses(){
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

    function deleteProcesses(){

        if(Object.values(trash).length !== 0){
            setOpenModalDel({open: !openModalDel.open, id: Object.values(trash)})
        }
        else{
            toast.error('Nenhum processo selecionado!')
        }
    }
    
    function distributeProcesses(){
        
        if(Object.values(trash).length !== 0){
            setOpenModalFree({open: !openModalFree.open, id: Object.values(trash)})
        }
        else{
            toast.error('Nenhum processo selecionado!')
        }
    }
  
    function setInclusion(date: string){
        if(parseInt(date.substring(5, 7)) <= parseInt(new Date().toISOString().substring(5, 7))){
            return `há ${parseInt(new Date().toISOString().substring(8, 10)) - parseInt(date.substring(8, 10))} dia(s)`
        }
        else{
            return `há ${parseInt(new Date().toISOString().substring(5, 7)) - parseInt(date.substring(5, 7))} meses(s)`
        }
    }

    function getCollumnValue(process: processProps, header: string) {
        switch(header) {
            case 'Processo':
                return process.processKey || '--'
            case 'Matéria':
                return process.matter || '--'
            case 'Cliente':
                return process.name || '--'
            case 'Advogado':
                return process.user?.name || '--'
            case 'Categoria':
                return process.category?.name || '--'
            case 'Prazo':
                return process.deadline || '--'
            case 'Conclusão':
                return process.conclusionDate || '--'
            case 'Status':
                return process.status || '--'
            default:
                return '--'
        }
    }

    function getCollumnElement(process: processProps, header: string) {
        switch(header) {
            case 'Status':
                return (
                    <td
                        className={styles.td}
                        style={getStatusStyle(process.status)}
                    >
                        {process.status}
                    </td>
                )
            case 'Inclusão':
                return (
                    <td
                        className={styles.td}
                    >
                        {setInclusion(process.distributionDate)}
                    </td>
                )
            default:
                return (
                    <td
                        className={styles.td}
                    >
                        {getCollumnValue(process, header)}
                    </td>
                )
        }
    }

    function filterData(data: processProps[], type: string) {
        switch(type) {
            case 'awaiting':
                setData(data.filter((process: { status: string }) => process.status === 'Em aguardo'))
                break
            case 'complete':
                setData(data.filter((process: { status: string }) => process.status === 'Concluído'))
                break
            default:
                setData(data.filter((process: { status: string }) => process.status !== 'Concluído' && process.status !== 'Em aguardo'))
                break
        }
    }

    function sortTable(sortBy: SortBy = SortBy.PRAZO, order: 'asc' | 'desc' = 'asc') {
        setData((data) => data.sort((a, b) => {
            switch (sortBy) {
                case 'deadline':
                    /* a.deadline === null && b.processKey !== null && -1

                    a.deadline !== null && b.processKey === null && 1 */

                    if (order === 'asc') {
                        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
                    }
                    return new Date(b.deadline).getTime() - new Date(a.deadline).getTime()
                
                case 'lawyer':
                    if (order === 'asc') {
                        return String(a.user?.name).localeCompare(String(b.user?.name))
                    }
                    return String(b.user?.name).localeCompare(String(a.user?.name))
                default:
                    if (order === 'asc') {
                        return String(a[sortBy as keyof processProps]).localeCompare(String(b[sortBy as keyof processProps]))
                    }
                    return String(b[sortBy as keyof processProps]).localeCompare(String(a[sortBy as keyof processProps]))
            }
        }))
    }

    return (
        <>
            <ModalDel isOpen={openModalDel} setOpen={setOpenModalDel} />
            <ModalFree isOpen={openModalFree} setOpen={setOpenModalFree} />
            <div className={styles.optionsContainer}>
                {pathname === '/painel/processos/aguardo' && (
                    <button className={styles.freeBtn} onClick={distributeProcesses}>
                        <RiCheckboxCircleLine />
                    </button>
                )}
                <button className={styles.deleteBtn} onClick={deleteProcesses}>
                    <RiDeleteBin6Fill />
                </button>
            </div>
            <div className={styles.tableContainer}>
                <section className={styles.tableBody}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>
                                    <input
                                        type="checkbox"
                                        onClick={selectAllProcesses}
                                        {...(isEmptyObj(trash) && {
                                            checked: false,
                                        })}
                                        style={{
                                            width: '1rem',
                                            height: '1rem',
                                        }}
                                    />
                                </th>

                                {tableHeaders.map((th, index) => (
                                    <th
                                        key={index}
                                        className={styles.th}
                                        onClick={() => {
                                            setSort({
                                                collumn: SortBy[th.toLocaleUpperCase() as keyof typeof SortBy],
                                                order:
                                                    sort.order === 'asc'
                                                        ? 'desc'
                                                        : 'asc',
                                            })
                                        }}
                                    >
                                        {sort.collumn === SortBy[th.toLocaleUpperCase() as keyof typeof SortBy] && (sort.order === 'asc' ? '▲' : '▼')}
                                        {th}
                                    </th>
                                ))}

                                <th>
                                    <label
                                        htmlFor="searchInput"
                                        className={styles.tableSearch}
                                    >
                                        <input
                                            id="searchInput"
                                            type="text"
                                            value={query}
                                            onChange={(
                                                el: React.FormEvent<HTMLInputElement>
                                            ) => {
                                                setQuery(el.currentTarget.value)
                                            }}
                                            autoComplete='off'
                                        />
                                        <AiOutlineSearch />
                                    </label>
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.map((process) => {
                                return (
                                    <tr key={process.id}>
                                        <td className={styles.td}>
                                            <input
                                                value={process.id}
                                                onChange={selectProcess}
                                                type="checkbox"
                                                style={{
                                                    width: '1rem',
                                                    height: '1rem',
                                                }}
                                                checked={
                                                    !trash[
                                                        process.id.toString()
                                                    ]
                                                        ? false
                                                        : true
                                                }
                                            />
                                        </td>
                                        {tableHeaders.map((key, index) => {
                                            return (
                                                <>
                                                    {getCollumnElement(
                                                        process,
                                                        key
                                                    )}
                                                </>
                                            )
                                        })}
                                        <td className={styles.td}>
                                            <AiOutlineComment
                                                className={styles.icon}
                                                onClick={() =>
                                                    push(
                                                        `/processo/${process.id}`
                                                    )
                                                }
                                            />
                                            {type !== 'complete' && (
                                                <AiOutlineEdit
                                                    className={styles.icon}
                                                    onClick={() =>
                                                        push(
                                                            `/painel/processos/${process.id}`
                                                        )
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </section>
            </div>
        </>
    )
}