import './globals.css'
import React from 'react'
import type { Metadata } from 'next'
import { Kadwa } from 'next/font/google'
import { Toaster } from "react-hot-toast"
import AuthProvider from '@/contexts/AuthContext'

const kadwa = Kadwa({
  weight: '400',
  subsets: ['latin']
 })

export const metadata: Metadata = {
  title: {
    default:'Sistema de Advocacia',
    template: '%s | Sistema de Advocacia'
  },
  icons: [{ rel: 'icon', url: '@/../public/favicon.png', sizes: '32x32' }]
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={kadwa.className}>
        <Toaster />
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
