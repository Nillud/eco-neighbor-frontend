/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button'
import { PAGES } from '@/config/pages.config'
import { eventService } from '@/services/event/event.service'
import { IEvent } from '@/services/event/event.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, Edit, Loader2, Trash } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Props {
  event: IEvent
  slug: string
}

export function EventActions({ event, slug }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Мутация завершения (начисление баллов)
  const { mutate: finishEvent, isPending: isFinishing } = useMutation({
    mutationFn: () => eventService.finish(event.id),
    onSuccess: data => {
      toast.success(
        `Событие завершено! Начислено баллов участникам: ${data.rewardedParticipants}`
      )
      queryClient.invalidateQueries({ queryKey: ['event', slug] })
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || 'Не удалось завершить событие'
      )
    }
  })

  // Мутация удаления
  const { mutate: deleteEvent, isPending: isDeleting } = useMutation({
    mutationFn: () => eventService.delete(event.id),
    onSuccess: () => {
      toast.success('Событие удалено')
      router.push(PAGES.PUBLIC.EVENTS)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Не удалось удалить')
    }
  })

  return (
    <div className="mb-6 space-y-4 rounded-2xl bg-white p-6 text-primary shadow-xl border">
      <div className="mb-2 flex items-center gap-2">
        <div className="bg-primary-brand h-2 w-2 animate-pulse rounded-full" />
        <h3 className="text-lg font-bold">Панель организатора</h3>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Кнопка Редактировать */}
        <Link href={`/events/${event.slug}/edit`}>
          <Button
            variant="secondary"
            className="h-11 w-full justify-start gap-2"
          >
            <Edit size={18} /> Редактировать данные
          </Button>
        </Link>

        {/* Кнопка Завершить (только если еще не завершено) */}
        {event.status !== 'FINISHED' && (
          <Button
            className="h-11 w-full justify-start gap-2 bg-green-600 text-white hover:bg-green-700"
            onClick={() => {
              if (
                confirm(
                  'Завершить событие? Всем участникам будет начислен рейтинг.'
                )
              )
                finishEvent()
            }}
            disabled={isFinishing}
          >
            {isFinishing ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CheckCircle size={18} />
            )}
            Завершить
          </Button>
        )}

        {/* Кнопка Удалить */}
        <Button
          variant="ghost"
          className="h-11 w-full justify-start gap-2 text-red-400 hover:bg-white/10 hover:text-red-300"
          onClick={() => {
            if (confirm('Вы уверены? Это действие нельзя отменить.'))
              deleteEvent()
          }}
          disabled={isDeleting}
        >
          {isDeleting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Trash size={18} />
          )}
          Удалить объявление
        </Button>
      </div>
    </div>
  )
}
