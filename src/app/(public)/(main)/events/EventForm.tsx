/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
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
import { useDebounce } from '@/hooks/useDebounce'
import { eventService } from '@/services/event/event.service'
import {
  EventCategory,
  ICreateEventDto,
  IEvent
} from '@/services/event/event.types'
import { Map, Placemark, SearchControl, YMaps } from '@pbe/react-yandex-maps'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'

import { eventCategoryLabels } from './event.utils'

interface EventFormProps {
  initialData?: IEvent
  variant?: 'create' | 'edit'
}

export function EventForm({ initialData, variant = 'create' }: EventFormProps) {
  const isEditMode = !!initialData
  const router = useRouter()
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '')

  const ymapsRef = useRef<any>(null)

  const { register, handleSubmit, control, setValue, watch } =
    useForm<ICreateEventDto>({
      defaultValues: {
        title: initialData?.title || '',
        description: initialData?.description || '',
        phone: initialData?.phone || '',
        category: initialData?.category || EventCategory.CLEANUP,
        // Преобразуем дату из БД (ISO) в формат для input datetime-local
        date: initialData?.date
          ? new Date(initialData.date).toISOString().slice(0, 16)
          : '',
        location: initialData?.location || '',
        latitude: initialData?.latitude || 54.698853,
        longitude: initialData?.longitude || 55.8503,
        maxParticipants: initialData?.maxParticipants || 10
      }
    })

  const address = watch('location')
  const debouncedAddress = useDebounce(address, 1000)
  const currentCoords = [watch('latitude'), watch('longitude')]

  useEffect(() => {
    const geocodeAddress = async () => {
      if (!ymapsRef.current || !debouncedAddress || debouncedAddress.length < 5)
        return

      try {
        const result = await ymapsRef.current.geocode(debouncedAddress)
        const firstGeoObject = result.geoObjects.get(0)

        if (firstGeoObject) {
          const coords = firstGeoObject.geometry.getCoordinates()
          setValue('latitude', coords[0])
          setValue('longitude', coords[1])
        }
      } catch (e) {
        console.error('Ошибка геокодирования', e)
      }
    }

    geocodeAddress()
  }, [debouncedAddress, setValue])

  const handleMapClick = async (e: any) => {
    const coords = e.get('coords')
    setValue('latitude', coords[0])
    setValue('longitude', coords[1])

    if (ymapsRef.current) {
      try {
        const result = await ymapsRef.current.geocode(coords)
        const firstGeoObject = result.geoObjects.get(0)
        const newAddress = firstGeoObject?.getAddressLine()

        if (newAddress) {
          // Используем { shouldValidate: true }, чтобы react-hook-form подхватил изменение
          setValue('location', newAddress, { shouldValidate: true })
        }
      } catch (err) {
        console.error('Ошибка обратного геокодирования', err)
      }
    }
  }

  // Загрузка фото
  const { mutate: upload, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => eventService.uploadImage(file),
    onSuccess: data => setImageUrl(data.url),
    onError: () => toast.error('Ошибка при загрузке изображения')
  })

  // Сохранение (Создание / Редактирование)
  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (data: ICreateEventDto) =>
      isEditMode
        ? eventService.update(initialData.id, { ...data, imageUrl })
        : eventService.create({ ...data, imageUrl }),
    onSuccess: res => {
      toast.success(isEditMode ? 'Изменения сохранены' : 'Мероприятие создано')
      router.push(`/events/${res.slug}`)
    },
    onError: () => toast.error('Не удалось сохранить данные')
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  return (
    <>
      <Link
        href=""
        onClick={e => {
          e.preventDefault()
          router.back()
        }}
        className="hover:text-primary-brand mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} />
        Назад
      </Link>

      <h3 className="mb-8 text-3xl font-bold">
        {variant === 'create' ? 'Новое мероприятие' : 'Редактирование'}
      </h3>

      <form
        onSubmit={handleSubmit(data => save(data))}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Название</Label>
            <Input
              {...register('title', { required: 'Введите название' })}
              placeholder="Напр: Эко-фестиваль"
            />
          </div>

          <div className="space-y-2">
            <Label>Категория</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(eventCategoryLabels).map(([key, item]) => (
                      <SelectItem
                        key={key}
                        value={key}
                      >
                        {item.icon} {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Обложка</Label>
          <div className="flex items-center gap-4">
            {imageUrl ? (
              <div className="relative h-40 w-full overflow-hidden rounded-xl border md:w-64">
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
                  className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white shadow-sm transition-colors hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed text-slate-400 transition-colors hover:bg-slate-50 md:w-64">
                {isUploading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Upload />
                )}
                <span className="mt-2 text-xs">Загрузить фото</span>
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

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Дата и время</Label>
            <Input
              type="datetime-local"
              {...register('date', { required: 'Укажите дату' })}
            />
          </div>
          <div className="space-y-2">
            <Label>Лимит участников</Label>
            <Input
              type="number"
              {...register('maxParticipants', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Описание</Label>
          <Textarea
            {...register('description', { required: 'Введите описание' })}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Адрес текстом</Label>
            <Input
              {...register('location', { required: 'Укажите адрес' })}
              placeholder="Введите адрес для поиска на карте"
            />
          </div>

          <div className="space-y-2">
            <Label>Местоположение на карте</Label>
            <div className="h-80 w-full overflow-hidden rounded-xl border border-slate-200">
              <YMaps
                query={{
                  apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
                  lang: 'ru_RU'
                }}
              >
                <Map
                  state={{ center: currentCoords, zoom: 15 }}
                  width="100%"
                  height="100%"
                  onLoad={(ymaps: any) => {
                    ymapsRef.current = ymaps // Сохраняем доступ к API
                  }}
                  onClick={handleMapClick}
                  modules={['geocode']} // Важно: загружаем модуль геокодера
                >
                  <SearchControl options={{ float: 'right' }} />
                  <Placemark
                    geometry={currentCoords}
                    options={{ preset: 'islands#darkGreenDotIcon' }}
                  />
                </Map>
              </YMaps>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Контактный телефон</Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PatternFormat
                format="+7 (###) ###-##-##"
                mask="_"
                customInput={Input}
                placeholder="+7 (___) ___-__-__"
                // Используем formattedValue, чтобы в базу летело с маской
                // Либо value, если нужны только цифры
                onValueChange={values => {
                  field.onChange(values.formattedValue)
                }}
                value={field.value}
                // Чтобы курсор не прыгал при вводе
                getInputRef={field.ref}
              />
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSaving || isUploading}
          className="bg-primary-brand h-12 w-full text-lg"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" />
          ) : isEditMode ? (
            'Сохранить изменения'
          ) : (
            'Создать мероприятие'
          )}
        </Button>
      </form>
    </>
  )
}
