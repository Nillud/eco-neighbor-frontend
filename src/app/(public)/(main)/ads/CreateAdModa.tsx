'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { PlusCircle } from 'lucide-react'
import { useState } from 'react'

import { CreateAdForm } from './CreateAdForm'

interface Props {
  onRefresh: () => void
}

export function CreateAdModal({ onRefresh }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
    onRefresh() // Обновляем список объявлений
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>
        <Button size={'lg'} className="bg-primary-brand hover:bg-primary-brand-hover gap-2 rounded-full px-6 text-base shadow-lg transition-all active:scale-95">
          <PlusCircle size={20} />
          <span>Создать объявление</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-125">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Новое объявление
          </DialogTitle>
        </DialogHeader>
        <CreateAdForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  )
}
