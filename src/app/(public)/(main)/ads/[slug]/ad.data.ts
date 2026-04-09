import { AdType } from "@/services/ad/ad.types";

export const adTypeLabels = {
  [AdType.GIVEAWAY]: {
    label: 'Отдам даром',
    color: 'bg-green-100 text-green-700'
  },
  [AdType.RECYCLE]: {
    label: 'Вторсырьё',
    color: 'bg-blue-100 text-blue-700'
  },
  [AdType.NEED_HELP]: {
    label: 'Нужна помощь',
    color: 'bg-orange-100 text-orange-700'
  }
}
