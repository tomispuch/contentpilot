import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

// Usar Geist como display font también, con peso extra
// Unbounded se carga via @import en globals.css para mayor compatibilidad

export const metadata: Metadata = {
  title: 'ContentPilot — Contenido para redes sin esfuerzo',
  description: 'Generá publicaciones para Instagram en minutos. Sin conocimientos creativos ni técnicos.',
  icons: {
    icon: '/icon-contentpilot.png',
    shortcut: '/icon-contentpilot.png',
    apple: '/icon-contentpilot.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&display=swap" rel="stylesheet" />
      </head>
      <body className={`${geist.variable} ${geist.className} antialiased h-full`}>
        {children}
      </body>
    </html>
  )
}
