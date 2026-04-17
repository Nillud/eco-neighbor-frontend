'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { messagesService } from '@/services/messages/messages.service'
import { useUser } from '@/store/user.store'
import { useMutation } from '@tanstack/react-query'
import { MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface EventContactProps {
  eventId: string
  creatorId: string
  isParticipant: boolean
}

export function EventContact({
  eventId,
  creatorId,
  isParticipant
}: EventContactProps) {
  const { user, isAuth } = useUser()
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  // Мутация для отправки первого сообщения (создание диалога)
  const { mutate: send, isPending } = useMutation({
    mutationFn: () =>
      messagesService.sendMessage({
        text: message,
        eventId, // Передаем eventId вместо adId
        receiverId: creatorId
      }),
    onSuccess: () => {
      const sendTimeout = setTimeout(() => {
        router.push(`/messages?eventId=${eventId}`)
        clearTimeout(sendTimeout)
      }, 0)
    }
  })

  // Если пользователь — создатель, чат ему не нужен (он и так там)
  if (user?.id === creatorId) return null

  const handleChatRedirect = () => {
    if (!isAuth) return router.push('/login')

    // Если уже участник — просто переходим в раздел сообщений
    // Если на бэкенде чаты фильтруются по eventId, можно передать query-параметр
    router.push(`/messages?eventId=${eventId}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) return router.push('/login')
    if (message.trim()) send()
  }

  return (
    <div className="mt-4">
      {/* Если участник — показываем кнопку быстрого перехода */}
      {isParticipant ? (
        <Button
          onClick={handleChatRedirect}
          variant="secondary"
          className="border-primary-brand/20 w-full gap-2 border"
        >
          <MessageCircle
            size={20}
            className="text-primary-brand"
          />
          Перейти в чат события
        </Button>
      ) : // Если не участник — логика с "Написать организатору"
      !isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full gap-2"
        >
          <MessageCircle size={20} />
          Задать вопрос организатору
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-xl bg-slate-50 p-3"
        >
          <label className="text-xs font-medium text-slate-700">
            Ваше сообщение:
          </label>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Привет! Есть вопрос..."
              className="bg-white"
              autoFocus
            />
            <Button
              disabled={isPending || !message.trim()}
              type="submit"
              className="bg-primary-brand"
            >
              {isPending ? '...' : <Send size={18} />}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-7 text-[10px]"
          >
            Отмена
          </Button>
        </form>
      )}
    </div>
  )
}
