import { ReactNode } from "react"


import Header from '@/components/Header (Private)'



export default function RelatorioLayout({ children }: { children: ReactNode }) {

  return (
    <>
      <Header section="RELATÓRIO" />
      <section >
          {children}
      </section>
    </>
  )
}