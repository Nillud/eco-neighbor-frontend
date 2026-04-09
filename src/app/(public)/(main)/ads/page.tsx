import type { Metadata } from 'next'
import { AdsPage } from './Ads'

export const metadata: Metadata = {
  title: 'Объявления'
}

export default function Page() {
  return <AdsPage />
}
