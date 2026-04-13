import { eventService } from '@/services/event/event.service'
import { TPageIdProp } from '@/types/page.types'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { EventForm } from '../../EventForm'

export const metadata: Metadata = {
  title: 'Редактирование мероприятия | Эко-Сосед'
}

export default async function EditEventPage({ params }: TPageIdProp) {
  const { id } = await params

  let event
  try {
    // Здесь можно искать по ID или Slug, в зависимости от того, что придет
    event = await eventService.getBySlug(id)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <EventForm
        variant="edit"
        initialData={event}
      />
    </div>
  )
}
