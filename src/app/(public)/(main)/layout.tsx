import { Layout } from '@/components/shared/layout/Layout'
import { PropsWithChildren } from 'react'

export default function MainLayout({ children }: PropsWithChildren) {
  return <Layout>{children}</Layout>
}
