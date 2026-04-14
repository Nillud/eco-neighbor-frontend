'use client'

import { ActionButton } from '@/components/custom-ui/ActionButton'
import { Heading } from '@/components/shared/heading/Heading'
import { Button } from '@/components/ui/button'
import { eventService } from '@/services/event/event.service'
import { EventCategory } from '@/services/event/event.types'
import { useQuery } from '@tanstack/react-query'
import { FilterX, Loader2, Plus } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import { EventCard } from './EventCard'
import { eventCategoryLabels } from './event.utils'

export default function EventsPage() {
  const [category, setCategory] = useState<EventCategory | undefined>()

  const { data: events, isLoading } = useQuery({
    queryKey: ['events', category],
    queryFn: () => eventService.getAll({ category })
  })

  return (
    <section className="container py-8">
      {/* Хедер */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
        <Heading
          title="Мероприятия"
          description="Развиваем сообщество и заботимся об экологии вместе."
          headingLevel={2}
        />

        <Link href="/events/create">
          <ActionButton className='flex items-center gap-1 mt-2 md:mt-0'>
            <Plus size={18} /> Создать
          </ActionButton>
        </Link>
      </div>

      <div className="flex flex-col gap-8 md:flex-row">
        {/* Сайдбар с фильтрами */}
        <aside className="w-full space-y-6 md:w-64">
          <div>
            <span className="mb-4 flex items-center gap-2 font-semibold">
              Категории
            </span>
            <div className="flex flex-col gap-2">
              <Button
                variant={!category ? 'secondary' : 'ghost'}
                className="justify-start font-normal"
                onClick={() => setCategory(undefined)}
              >
                <FilterX className="mr-2 h-4 w-4" /> Все события
              </Button>

              {Object.entries(eventCategoryLabels).map(([key, item]) => (
                <Button
                  key={key}
                  variant={category === key ? 'secondary' : 'ghost'}
                  className={`justify-start font-normal ${category === key ? 'ring-primary-brand/20 ring-1' : ''}`}
                  onClick={() => setCategory(key as EventCategory)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Дополнительный блок в сайдбаре (можно расширить статусами) */}
          <div className="rounded-xl border border-dashed bg-slate-50 p-4">
            <p className="text-muted-foreground text-center text-xs">
              Участвуйте в мероприятиях и получайте баллы рейтинга! 🏆
            </p>
          </div>
        </aside>

        {/* Основной контент */}
        <main className="flex-1">
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="text-primary-brand h-8 w-8 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {events?.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}

              {events?.length === 0 && (
                <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50/50">
                  <p className="text-muted-foreground">
                    В этой категории пока ничего нет
                  </p>
                  <Button
                    variant="link"
                    onClick={() => setCategory(undefined)}
                    className="text-primary-brand"
                  >
                    Сбросить фильтры
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  )
}
