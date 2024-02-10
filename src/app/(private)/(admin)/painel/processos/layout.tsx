'use client'
import React from "react"
import Header from "@/components/Header (Private)"

import { AiOutlineFileAdd, AiOutlineFileSync, AiOutlineFileDone } from 'react-icons/ai'

function AdmLayout({ children }: { children: React.ReactNode }) {
  
  const navbar = [
    {id: 1, title: 'NOVO PROCESSO', page: '/painel/processos/novo', icon:  AiOutlineFileAdd},
    {id: 2, title: 'EM AGUARDO', page: '/painel/processos/aguardo', icon: AiOutlineFileSync},
    {id: 3, title: 'PROCESSOS CONCLUÍDOS', page: '/painel/processos/completo', icon: AiOutlineFileDone}
  ]
  
  return (
    <>
        <Header pageDefault='/painel/processos' section='PROCESSOS'  nav={navbar}/>
        <section className="defaultContainer">
          {children}
        </section>
      </>
  )
}

export default AdmLayout