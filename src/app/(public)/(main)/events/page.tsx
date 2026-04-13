import type { Metadata } from 'next'

import EventsPage from './Events'

export const metadata: Metadata = {
  title: 'Мероприятия'
}

export default function Page() {
  return <EventsPage />
}
