'use client'
import { ReactNode, useState, createContext } from "react"
import { usePathname } from 'next/navigation'

//Components
import Header from "@/components/PrivateHeader"

//Icons
import { AiOutlineFileDone } from 'react-icons/ai'
import { BiSolidUser } from 'react-icons/bi'

export const PageContext = createContext(function setPage(page: number) {})

export default function UserLayout({ children, done, profile }: { children: ReactNode, done: ReactNode, profile: ReactNode }) {
  const path = usePathname()
  const [page, setPage] = useState<number>(0)
  const pages = [children, done, profile];

  const navbar = [
    {
        id: 1,
        title: 'PROCESSOS CONCLUÍDOS',
        icon: AiOutlineFileDone,
    },
    {
        id: 2,
        title: 'PERFIL',
        icon: BiSolidUser,
    },
]

  return (
      <PageContext.Provider value={setPage}>
        <section>

          <Header name="PROCESSOS" navLinks={navbar} page={page} setPage={setPage}/>
          <section className="childSection">
            {pages[page]}
          </section>

        </section>
      </PageContext.Provider>
    )
  }