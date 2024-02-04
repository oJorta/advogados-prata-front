'use client'
import { ReactNode, useState, createContext } from "react"
import { usePathname } from 'next/navigation'

import Header from "@/components/PrivateHeader"
import AddCategoryInput from "@/components/AddCategoryInput"

import { AiOutlineUserAdd } from 'react-icons/ai'
import { MdAddToPhotos } from "react-icons/md";

import styles from './layout.module.css'

export const PageContext = createContext(function setPage(page: number) {})

export default function AdvogadosLayout({ children, add }: { children: ReactNode, add: ReactNode }) {
  const path = usePathname()
  const [page, setPage] = useState<number>(0)
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(true)
  const pages = [children, add];

  const navbar = [
    {
        id: 1,
        title: 'CADASTRAR ADVOGADO',
        icon: AiOutlineUserAdd,
        type: 'parallelRoute'
    },
    {
        id: 2,
        title: 'CADASTRAR ÁREA',
        icon: MdAddToPhotos,
        type: 'modal',
        Modal: AddCategoryInput,
        modalIsOpen: categoryModalIsOpen,
        setModalIsOpen: setCategoryModalIsOpen
    },
  ]

  return (
      <PageContext.Provider value={setPage}>
        {path === '/painel/advogados' ? (
                <Header name="ADVOGADOS" navLinks={navbar} page={page} setPage={setPage}/>
            ) : (
                <Header name="ADVOGADOS" navLinks={[]} page={page} setPage={setPage}/>
            )}
        {pages[page]}
      </PageContext.Provider>
    )
  }