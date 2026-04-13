import { Metadata } from 'next'

import { EventForm } from '../EventForm'

export const metadata: Metadata = {
  title: 'Создание мероприятия | Эко-Сосед'
}

export default function CreateEventPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <EventForm variant="create" />
    </div>
  )
}
