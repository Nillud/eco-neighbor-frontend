import { AuthProvider } from '@/components/providers/auth-provider'
import { Layout } from '@/components/shared/layout/Layout'
import { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  )
}
