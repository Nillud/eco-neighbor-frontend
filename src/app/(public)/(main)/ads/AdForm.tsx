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
import { SERVER_URL } from '@/config/api.config'
import { adService } from '@/services/ad/ad.service'
import { AdType, IAd, ICreateAdDto } from '@/services/ad/ad.types'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'

interface AdFormProps {
  initialData?: IAd
  variant?: 'create' | 'edit'
}

export function AdForm({ initialData, variant = 'create' }: AdFormProps) {
  const isEditMode = !!initialData
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')

  const { register, handleSubmit, control } = useForm<ICreateAdDto>({
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      phone: initialData?.phone || '',
      type: initialData?.type || AdType.GIVEAWAY
    }
  })

  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => adService.uploadImage(file),
    onSuccess: data => setImageUrl(data.url)
  })

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data: ICreateAdDto) =>
      isEditMode
        ? adService.update(initialData.id, { ...data, imageUrl })
        : adService.create({ ...data, imageUrl }),
    onSuccess: res => {
      toast.success(isEditMode ? 'Обновлено' : 'Опубликовано')
      router.push(`/ads/${res.slug}`)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <>
      <Link
        href=""
        onClick={() => router.back()}
        className="hover:text-primary-brand mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
        Назад
      </Link>

      <h3 className="mb-8 text-3xl font-bold">
        {variant === 'create' ? 'Новое объявление' : 'Редактирование'}
      </h3>

      <form
        onSubmit={handleSubmit(data => save(data))}
        className="space-y-6"
      >
        <div className="space-y-2">
          <Label>Заголовок</Label>
          <Input
            {...register('title', { required: 'Введите заголовок' })}
            placeholder="Напр: Отдам кресло"
          />
        </div>

        {/* Категория (Shadcn Select) */}
        <div className="space-y-2">
          <Label>Категория</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AdType.GIVEAWAY}>Отдам даром</SelectItem>
                  <SelectItem value={AdType.RECYCLE}>В переработку</SelectItem>
                  <SelectItem value={AdType.NEED_HELP}>Нужна помощь</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Фотография */}
        <div className="space-y-2">
          <Label>Фотография</Label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border">
                <Image
                  src={`${SERVER_URL}${imageUrl}`}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => setImageUrl('')}
                  className="transition-hover absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-slate-400 transition-colors hover:bg-slate-50">
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload />
                )}
                <span className="mt-2 text-xs">Загрузить</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            )}
          </div>
        </div>

        {/* Описание */}
        <div className="space-y-2">
          <Label>Описание</Label>
          <Textarea
            {...register('description', { required: 'Опишите детали' })}
            rows={5}
            className="resize-none"
          />
        </div>

        {/* Телефон с маской */}
        <div className="space-y-2">
          <Label>Телефон (необязательно)</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PatternFormat
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                placeholder="+7 (___) ___-__-__"
                onValueChange={values => field.onChange(values.formattedValue)}
                value={field.value}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSaving || isUploading}
          className="bg-primary-brand w-full"
        >
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : isEditMode ? (
            'Сохранить изменения'
          ) : (
            'Опубликовать'
          )}
        </Button>
      </form>
    </>
  )
}
