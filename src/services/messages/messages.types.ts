export interface IMessage {
  id: string
  text: string
  createdAt: string
  senderId: string
  sender: {
    id: string
    name: string
    avatarUrl: string
  }
  adId?: string
  eventId?: string
}

export interface IChatItem {
  id: string // Это наш roomId (ad_id_partnerId или event_id)
  lastMessage: string
  date: string
  type: 'AD' | 'EVENT'
  title: string
  partner: {
    id: string
    name: string
    avatarUrl: string
  }
  metadata: {
    adId?: string
    eventId?: string
  }
}