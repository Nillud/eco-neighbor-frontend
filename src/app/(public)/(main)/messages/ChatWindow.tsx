/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocket } from '@/hooks/useSocket'
import { messagesService } from '@/services/messages/messages.service'
import { IChatItem, IMessage } from '@/services/messages/messages.types'
import { useUser } from '@/store/user.store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft, Send } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export function ChatWindow({
  chat,
  onBack
}: {
  chat: IChatItem
  onBack: () => void
}) {
  const [text, setText] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()
  const { user: currentUser } = useUser()
  const { socket } = useSocket()

  // 1. История
  const { data: messages = [] } = useQuery({
    queryKey: ['chat-history', chat.id],
    queryFn: () =>
      messagesService.getHistory({
        adId: chat.metadata.adId,
        eventId: chat.metadata.eventId,
        participantId: chat.partner.id
      })
  })

  // 2. Отправка
  const { mutate: send } = useMutation({
    mutationFn: () =>
      messagesService.sendMessage({
        text,
        adId: chat.metadata.adId,
        eventId: chat.metadata.eventId,
        receiverId: chat.partner.id
      }),
    onSuccess: newMsg => {
      setText('')
      queryClient.setQueryData(['chat-history', chat.id], (old: any) => [
        ...(old || []),
        newMsg
      ])
    }
  })

  // 3. Сокеты
  useEffect(() => {
    if (!socket || !chat.id) return

    socket.emit('join_room', { roomId: chat.id })

    socket.on('new_message', (msg: IMessage) => {
      // Чтобы избежать дублей (если мы сами отправили и получили через сокет), можно добавить проверку по ID
      queryClient.setQueryData(['chat-history', chat.id], (old: any) => {
        if (old?.find((m: any) => m.id === msg.id)) return old
        return [...(old || []), msg]
      })
    })

    return () => {
      socket.off('new_message')
      socket.emit('leave_room', { roomId: chat.id })
    }
  }, [chat.id, socket, queryClient])

  // 4. Скролл
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages])

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-4 border-b p-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onBack}
        >
          <ChevronLeft />
        </Button>

        <Image
          src={chat.partner.avatarUrl || '/images/default-avatar.png'}
          className="h-10 w-10 rounded-full object-cover"
          width={40}
          height={40}
          alt=""
        />

        <div className="overflow-hidden">
          <h3 className="truncate font-bold">{chat.partner.name}</h3>
          <p className="text-primary-brand truncate text-xs">{chat.title}</p>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-slate-50/50 p-4"
      >
        {messages.map(msg => {
          const isMe = msg.senderId === currentUser?.id
          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                  isMe
                    ? 'bg-primary-brand rounded-tr-none text-white'
                    : 'rounded-tl-none border border-slate-100 bg-white text-slate-800'
                }`}
              >
                {msg.text}
                <div
                  className={`mt-1 text-right text-[10px] ${isMe ? 'text-emerald-100' : 'text-slate-400'}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="border-t p-4">
        <form
          className="flex gap-2"
          onSubmit={e => {
            e.preventDefault()
            if (text.trim()) send()
          }}
        >
          <Input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Сообщение..."
            className="flex-1"
          />
          <Button
            type="submit"
            className="bg-primary-brand hover:bg-emerald-600"
          >
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  )
}
