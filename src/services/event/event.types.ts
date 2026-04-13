export enum EventCategory {
  CLEANUP = 'CLEANUP',
  WORKSHOP = 'WORKSHOP',
  EXCHANGE = 'EXCHANGE',
  OTHER = 'OTHER'
}

export enum EventStatus {
  UPCOMING = 'UPCOMING',
  FINISHED = 'FINISHED',
  CANCELLED = 'CANCELLED'
}

export interface IEvent {
  id: string
  title: string
  slug: string
  description: string
  category: EventCategory
  phone?: string
  imageUrl?: string
  date: string
  location: string
  latitude: number
  longitude: number
  maxParticipants?: number
  status: EventStatus
  creatorId: string
  creator: {
    name: string
    avatarUrl?: string
  }
  participants: {
    userId: string
    user: {
      id: string
      name: string
      avatarUrl?: string
    }
  }[]
  _count: {
    participants: number
  }
  createdAt: string
}

export type ICreateEventDto = Omit<
  IEvent,
  'id' | 'slug' | 'status' | 'creator' | 'participants' | '_count' | 'createdAt'
>
