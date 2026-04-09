import { $api } from '@/lib/api/axios'

import { IChatItem, IMessage } from './messages.types'

class MessagesService {
  async getChatList() {
    const response = await $api.get<IChatItem[]>('/messages/chats')
    return response.data
  }

  async getHistory(params: {
    adId?: string
    eventId?: string
    participantId?: string
  }) {
    const response = await $api.get<IMessage[]>('/messages', { params })
    return response.data
  }

  async sendMessage(data: {
    text: string
    adId?: string
    eventId?: string
    receiverId?: string
  }) {
    const response = await $api.post<IMessage>('/messages', data)
    return response.data
  }
}

export const messagesService = new MessagesService()
