'use client'
import { ReactNode, useState, createContext } from "react"
import { usePathname } from 'next/navigation'

import Header from "@/components/PrivateHeader"

import { BsInfoLg } from "react-icons/bs"

export const PageContext = createContext(function setPage(page: number) {})

export default function AdvogadosLayout({ children, info }: { children: ReactNode, info: ReactNode }) {
  const path = usePathname()
  const [page, setPage] = useState<number>(0)
  const pages = [children, info];

  const navbar = [
    {
        id: 1,
        title: 'INFORMAÇÕES DO PROCESSO',
        icon: BsInfoLg,
        type: 'parallelRoute'
    },
]

  return (
      <PageContext.Provider value={setPage}>
        <Header name="PROCESSO" navLinks={navbar} page={page} setPage={setPage}/>
        {pages[page]}
      </PageContext.Provider>
    )
  }