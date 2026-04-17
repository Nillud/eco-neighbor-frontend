/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SERVER_URL } from '@/config/api.config'
import { PAGES } from '@/config/pages.config'
import { eventService } from '@/services/event/event.service'
import { IEvent } from '@/services/event/event.types'
import { useUser } from '@/store/user.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import {
  Calendar,
  ChevronLeft,
  Loader2,
  MapPin,
  Phone,
  Users
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { toast } from 'sonner'

import { eventCategoryLabels } from '../event.utils'
import { EventActions } from './EventActions'
import { EventMap } from './EventMap'
import { EventContact } from './EventContact'

interface Props {
  initialEvent: IEvent
}

export default function EventSinglePage({ initialEvent }: Props) {
  const { user, isAuth } = useUser()

  const { slug } = useParams<{ slug: string }>()
  const queryClient = useQueryClient()

  const { data: event } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => eventService.getBySlug(slug),
    initialData: initialEvent
  })

  const isParticipant = event.participants?.some(p => p.userId === user?.id)

  const { mutate: toggleReg, isPending: isRegPending } = useMutation({
    mutationFn: () => eventService.toggleRegistration(event.id),
    onSuccess: data => {
      toast.success(data.isJoined ? 'Вы записались!' : 'Запись отменена')
      queryClient.invalidateQueries({ queryKey: ['event', slug] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Ошибка')
    }
  })

  const date = new Date(event.date)
  const isFull =
    event.maxParticipants && event._count.participants >= event.maxParticipants
  const isFinished = event.status === 'FINISHED'

  const imageUrl = event.imageUrl
    ? event.imageUrl.startsWith('http')
      ? event.imageUrl
      : `${SERVER_URL}${event.imageUrl}`
    : null

  const isCreator = user?.id === event.creatorId

  return (
    <div className="container py-10">
      <Link
        href={PAGES.PUBLIC.EVENTS}
        className="hover:text-primary-brand mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
        Назад к объявлениям
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="relative h-100 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
            {event.imageUrl ? (
              <Image
                src={imageUrl || ''}
                alt={event.title}
                fill
                className="object-cover"
                priority // Добавляем приоритет для LCP
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <Calendar size={80} />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                className={`px-2 py-2.5 text-sm font-medium shadow-sm ${eventCategoryLabels[event.category].color}`}
                variant="outline"
              >
                {eventCategoryLabels[event.category].icon}{' '}
                {eventCategoryLabels[event.category].label}
              </Badge>
              <span className="text-muted-foreground text-sm">
                Опубликовано {format(new Date(event.createdAt), 'dd.MM.yyyy')}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold">{event.title}</h1>
            <p className="text-lg leading-relaxed whitespace-pre-wrap text-slate-700">
              {event.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {isCreator && (
            <EventActions
              event={event}
              slug={slug}
            />
          )}

          <div className="bg-card space-y-6 rounded-2xl border p-6 shadow-sm">
            <h3 className="text-xl font-bold">Детали встречи</h3>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar
                  className="text-primary-brand mt-1"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold">Дата и время</p>
                  <p className="text-muted-foreground text-sm capitalize">
                    {format(date, 'EEEE, d MMMM', { locale: ru })}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Начало в {format(date, 'HH:mm')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin
                  className="text-primary-brand mt-1"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold">Место</p>
                  <p className="text-muted-foreground text-sm">
                    {event.location}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users
                  className="text-primary-brand mt-1"
                  size={20}
                />
                <div>
                  <p className="text-sm font-semibold">Участники</p>
                  <p className="text-muted-foreground text-sm">
                    Записано: {event._count.participants}
                    {event.maxParticipants && ` из ${event.maxParticipants}`}
                  </p>
                </div>
              </div>

              {event.phone && (
                <div className="flex items-start gap-3">
                  <Phone
                    className="text-primary-brand mt-1"
                    size={20}
                  />
                  <div>
                    <p className="text-sm font-semibold">Организатор</p>
                    <p className="text-muted-foreground text-sm">
                      {event.creator.name}
                    </p>
                    <p className="text-sm font-medium">{event.phone}</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              className={
                isParticipant
                  ? 'h-12 w-full bg-slate-200 text-lg text-slate-800 shadow-sm hover:bg-slate-300'
                  : 'bg-primary-brand hover:bg-primary-brand/90 h-12 w-full text-lg shadow-sm'
              }
              disabled={
                (!isParticipant && (isFull || isFinished)) || isRegPending
              }
              onClick={() => toggleReg()}
            >
              {isRegPending ? (
                <Loader2 className="animate-spin" />
              ) : isFinished ? (
                'Событие завершено'
              ) : isParticipant ? (
                'Отменить запись'
              ) : isFull ? (
                'Мест нет'
              ) : (
                'Записаться'
              )}
            </Button>

            {isAuth && (
              <EventContact
                eventId={event.id}
                creatorId={event.creatorId}
                isParticipant={isParticipant}
              />
            )}
          </div>

          {event.latitude && event.longitude ? (
            <EventMap
              center={[event.latitude, event.longitude]}
              title={event.title}
              address={event.location}
            />
          ) : (
            <div className="text-muted-foreground flex h-64 items-center justify-center rounded-2xl border border-dashed bg-slate-50 text-sm">
              Координаты не указаны
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
