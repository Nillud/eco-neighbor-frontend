/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2 } from 'lucide-react'
import { EventCard } from '../../events/EventCard'
import { EmptyState } from './EmptyState'
import { Heading } from '@/components/shared/heading/Heading'

interface Props {
  participating: any[]
  created: any[]
  isLoading: boolean
}

export function MyEvents({ participating, created, isLoading }: Props) {
  if (isLoading)
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="text-primary-brand animate-spin" />
      </div>
    )

  return (
    <div className="space-y-4">
      <Heading title='Мои мероприятия' headingLevel={3} />

      <Tabs
        defaultValue="participating"
        className="w-full"
      >
        <TabsList className="mb-4 grid h-12 w-full grid-cols-2 rounded-2xl bg-slate-100/50 p-1">
          <TabsTrigger
            value="participating"
            className="rounded-xl data-[state=active]:shadow-sm"
          >
            Участвую
          </TabsTrigger>
          <TabsTrigger
            value="created"
            className="rounded-xl data-[state=active]:shadow-sm"
          >
            Организатор
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="participating"
          className="grid grid-cols-1 gap-6 outline-none md:grid-cols-2"
        >
          {participating?.length > 0 ? (
            participating.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))
          ) : (
            <EmptyState
              message="Вы еще не записались на предстоящие мероприятия"
              link="/events"
              linkText="Найти мероприятия"
            />
          )}
        </TabsContent>

        {/* МОИ МЕРОПРИЯТИЯ */}
        <TabsContent
          value="created"
          className="grid grid-cols-1 gap-6 outline-none md:grid-cols-2"
        >
          {created?.length > 0 ? (
            created.map((event: any) => (
              <EventCard
                key={event.id}
                event={event}
              />
            ))
          ) : (
            <EmptyState
              message="Вы еще не организовали ни одного сбора или воркшопа"
              link="/events/create"
              linkText="Создать событие"
            />
          )}
        </TabsContent>


      </Tabs>
    </div>
  )
}
