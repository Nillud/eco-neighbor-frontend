import { AdType } from '@/services/ad/ad.types'

export const adTypeLabels: Record<AdType, { label: string; color: string }> = {
  [AdType.GIVEAWAY]: {
    label: 'Отдам даром',
    color: 'bg-emerald-100 text-emerald-700 border border-emerald-200'
  },
  [AdType.RECYCLE]: {
    label: 'Вторсырьё',
    color: 'bg-blue-100 text-blue-700 border border-blue-200'
  },
  [AdType.NEED_HELP]: {
    label: 'Нужна помощь',
    color: 'bg-amber-100 text-amber-700 border border-amber-200'
  }
}
