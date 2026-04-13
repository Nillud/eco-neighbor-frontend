import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { SERVER_URL } from '@/config/api.config'
import { IEvent } from '@/services/event/event.types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar, MapPin, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { eventCategoryLabels } from './event.utils'

interface EventCardProps {
  event: IEvent
}

export function EventCard({ event }: EventCardProps) {
  const date = new Date(event.date)
  const isFull =
    event.maxParticipants && event._count.participants >= event.maxParticipants

  const imageUrl = event.imageUrl
    ? event.imageUrl.startsWith('http')
      ? event.imageUrl
      : `${SERVER_URL}${event.imageUrl}`
    : null

  return (
    <Link href={`/events/${event.slug}`}>
      <Card className="group overflow-hidden pt-0 transition-all hover:shadow-md">
        <CardHeader className="relative h-48 w-full overflow-hidden bg-slate-100 p-0">
          {event.imageUrl ? (
            <Image
              src={imageUrl || ''}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              unoptimized
            />
          ) : (
            <div className="bg-primary-brand/10 text-primary-brand flex h-full w-full items-center justify-center">
              <Calendar
                size={48}
                className="opacity-20"
              />
            </div>
          )}
          <Badge
            className={`absolute top-3 left-3 font-medium shadow-sm ${eventCategoryLabels[event.category].color}`}
            variant="outline"
          >
            {eventCategoryLabels[event.category].icon}{' '}
            {eventCategoryLabels[event.category].label}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-3 px-4 py-2">
          <h3 className="line-clamp-1 text-lg font-bold">{event.title}</h3>

          <div className="text-muted-foreground space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Calendar
                size={16}
                className="text-primary-brand"
              />
              <span>{format(date, 'd MMMM, HH:mm', { locale: ru })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-primary-brand"
              />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-auto flex bg-gray-50/50 items-center justify-between border-t p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Users size={16} />
            <span className={isFull ? 'text-red-500' : 'text-green-600'}>
              {event._count.participants}
              {event.maxParticipants
                ? ` / ${event.maxParticipants}`
                : ' участников'}
            </span>
          </div>
          <span className="text-muted-foreground text-xs">
            от {event.creator.name}
          </span>
        </CardFooter>
      </Card>
    </Link>
  )
}
