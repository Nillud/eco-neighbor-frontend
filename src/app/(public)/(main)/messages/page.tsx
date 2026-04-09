import type { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import MessagesPage from './Messages'

export const metadata: Metadata = {
  title: 'Сообщения',
  ...NO_INDEX_PAGE
}

export default function Page() {
  return <MessagesPage />
}
