'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { messagesService } from '@/services/messages/messages.service'
import { useUser } from '@/store/user.store'
import { useMutation } from '@tanstack/react-query'
import { MessageCircle, Send } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface AdContactProps {
  adId: string
  authorId: string
  authorName: string
}

export function AdContact({ adId, authorId, authorName }: AdContactProps) {
  const { user, isAuth } = useUser()
  const [message, setMessage] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const { mutate: send, isPending } = useMutation({
    mutationFn: () =>
      messagesService.sendMessage({
        text: message,
        adId,
        receiverId: authorId
      }),
    onSuccess: () => {
      const sendTimeout = setTimeout(() => {
        router.push('/messages')
        clearTimeout(sendTimeout)
      }, 0)
    }
  })

  // Если это наше объявление, кнопку не показываем
  if (user?.id === authorId) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuth) return router.push('/login')
    if (message.trim()) send()
  }

  return (
    <div className="mt-6 border-t pt-6">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary-brand w-full gap-2 hover:bg-emerald-600"
        >
          <MessageCircle size={20} />
          Написать
          <span className="hidden lg:block">{authorName}</span>
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-3"
        >
          <label className="text-sm font-medium text-slate-700">
            Ваше сообщение:
          </label>
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Напр: Привет! Еще актуально?"
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
            className="text-slate-400"
          >
            Отмена
          </Button>
        </form>
      )}
    </div>
  )
}
