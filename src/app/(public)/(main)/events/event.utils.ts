import { EventCategory } from '@/services/event/event.types'

export const eventCategoryLabels: Record<
  EventCategory,
  { label: string; color: string; icon: string }
> = {
  [EventCategory.CLEANUP]: {
    label: 'Субботник',
    color: 'bg-green-100 text-green-700 border border-green-200',
    icon: '🧹'
  },
  [EventCategory.WORKSHOP]: {
    label: 'Мастер-класс',
    color: 'bg-purple-100 text-purple-700 border border-purple-200',
    icon: '🎓'
  },
  [EventCategory.EXCHANGE]: {
    label: 'Обмен вещами',
    color: 'bg-blue-100 text-blue-700 border border-blue-200',
    icon: '🔄'
  },
  [EventCategory.OTHER]: {
    label: 'Прочее',
    color: 'bg-slate-100 text-slate-700 border border-slate-200',
    icon: '✨'
  }
}
