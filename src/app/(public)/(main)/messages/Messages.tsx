'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { messagesService } from '@/services/messages/messages.service'
import { ChatList } from './ChatList'
import { ChatWindow } from './ChatWindow'
import { MessageSquare } from 'lucide-react'
import { IChatItem } from '@/services/messages/messages.types'

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState<IChatItem | null>(null)

  // Получаем список всех чатов
  const { data: chats, isLoading, refetch } = useQuery({
    queryKey: ['chat-list'],
    queryFn: () => messagesService.getChatList()
  })

  return (
    <div className="container mx-auto h-[calc(100vh-120px)] py-4 px-4">
      <div className="flex h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        
        {/* Левая часть: Список чатов */}
        <aside className={`w-full border-r border-slate-100 md:w-80 lg:w-96 ${selectedChat ? 'hidden md:block' : 'block'}`}>
          <div className="p-4 border-bottom bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-900">Сообщения</h2>
          </div>
          <div className="overflow-y-auto h-full pb-20">
            <ChatList 
              chats={chats || []} 
              selectedId={selectedChat?.id} 
              onSelect={setSelectedChat} 
              isLoading={isLoading}
            />
          </div>
        </aside>

        {/* Правая часть: Окно чата */}
        <main className={`flex-1 flex flex-col ${!selectedChat ? 'hidden md:flex' : 'flex'}`}>
          {selectedChat ? (
            <ChatWindow 
              chat={selectedChat} 
              onBack={() => setSelectedChat(null)} 
            />
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center text-slate-400 bg-slate-50/30">
              <div className="mb-4 rounded-full bg-slate-100 p-6">
                <MessageSquare size={48} />
              </div>
              <p className="text-lg">Выберите чат, чтобы начать общение</p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}