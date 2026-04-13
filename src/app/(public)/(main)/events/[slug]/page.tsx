/* eslint-disable react-hooks/error-boundaries */
import { eventService } from '@/services/event/event.service'
import { TPageSlugProp } from '@/types/page.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import EventSinglePage from './Event'

export async function generateMetadata({
  params
}: TPageSlugProp): Promise<Metadata> {
  const { slug } = await params
  const event = await eventService.getBySlug(slug).catch(() => null)

  if (!event) return { title: 'Мероприятие не найдено' }

  return {
    title: `${event.title} | Эко-Сосед`,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : [],
      type: 'article'
    }
  }
}

export default async function EventPage({ params }: TPageSlugProp) {
  const { slug } = await params

  try {
    const event = await eventService.getBySlug(slug)
    return <EventSinglePage initialEvent={event} />
  } catch {
    notFound()
  }
}
