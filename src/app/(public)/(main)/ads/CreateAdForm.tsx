/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { adService } from '@/services/ad/ad.service'
import { AdType } from '@/services/ad/ad.types'
import { Upload, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function CreateAdForm({ onSuccess }: { onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const { register, handleSubmit, control, reset } = useForm<any>()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const onSubmit = async (data: any) => {
    setIsLoading(true)
    try {
      let imageUrl = ''

      if (selectedFile) {
        const uploadRes = await adService.uploadImage(selectedFile)
        imageUrl = uploadRes.url
      }

      await adService.create({ ...data, imageUrl })

      toast.success('Объявление создано!', {
        description: '+15 эко-очков начислено'
      })
      reset()
      setImagePreview(null)
      onSuccess()
    } catch {
      toast.error('Ошибка при создании')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 py-4"
    >
      {/* Загрузка фото */}
      <div className="flex flex-col items-center gap-4">
        {imagePreview ? (
          <div className="relative h-40 w-full overflow-hidden rounded-xl border">
            <Image
              src={imagePreview}
              className="h-full w-full object-cover"
              alt="Preview"
            />
            <button
              type="button"
              onClick={() => {
                setImagePreview(null)
                setSelectedFile(null)
              }}
              className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <Label className="hover:border-primary-brand flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 hover:bg-slate-50">
            <Upload className="mb-2 text-slate-400" />
            <span className="text-sm text-slate-500">Добавить фото</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept="image/*"
            />
          </Label>
        )}
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Заголовок</Label>
        <Input
          {...register('title', { required: true })}
          placeholder="Например: Отдам детские вещи"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Категория</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <SelectTrigger className="focus:ring-primary-brand w-full">
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={AdType.GIVEAWAY}>🎁 Отдам даром</SelectItem>
                <SelectItem value={AdType.RECYCLE}>♻️ Переработка</SelectItem>
                <SelectItem value={AdType.NEED_HELP}>
                  🤝 Нужна помощь
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Описание</Label>
        <Textarea
          {...register('description', { required: true })}
          placeholder="Опишите детали..."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium">Телефон (необязательно)</Label>
        <Input
          {...register('phone')}
          placeholder="+7 (999) 000-00-00"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="bg-primary-brand hover:bg-primary-brand-hover h-12 w-full text-base text-white shadow-lg"
      >
        {isLoading ? 'Публикация...' : 'Опубликовать'}
      </Button>
    </form>
  )
}
