import MainProvider from '@/components/providers/main-provider'
import type { Metadata } from 'next'
import { Open_Sans } from 'next/font/google'

import './globals.css'
import { SITE_NAME } from '@/constants/app.constants'
import { Toaster } from '@/components/ui/sonner'

const sans = Open_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800']
})

export const metadata: Metadata = {
  title: { absolute: SITE_NAME, template: `%s · ${SITE_NAME}` },
  description: 'Помогай соседям, береги природу, копи баллы!'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ru"
      className={`${sans.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col">
        <MainProvider>{children}</MainProvider>
        <Toaster position='top-center' theme={'light'} richColors />
      </body>
    </html>
  )
}
