export enum AdType {
  GIVEAWAY = 'GIVEAWAY',
  RECYCLE = 'RECYCLE',
  NEED_HELP = 'NEED_HELP'
}

export interface IAd {
  id: string
  title: string
  slug: string // Добавили
  description: string
  phone?: string
  type: AdType
  imageUrl?: string
  authorId: string
  status: 'ACTIVE' | 'CLOSED'
  createdAt: string
  author: {
    id: string
    name: string
    avatarUrl: string
    rating: number
  }
}

export type ICreateAdDto = Omit<IAd, 'id' | 'authorId' | 'status' | 'createdAt' | 'author'>