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
import { useDebounce } from '@/hooks/useDebounce'
import { mapService } from '@/services/map/map.service'
import { ICreateMapPointDto, IMapPoint } from '@/services/map/map.types'
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { useMutation } from '@tanstack/react-query'
import { ChevronLeft, Loader2, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface PointFormProps {
  initialData?: IMapPoint
}

export function PointForm({ initialData }: PointFormProps) {
  const isEditMode = !!initialData
  const router = useRouter()
  const ymapsRef = useRef<any>(null)

  const { register, handleSubmit, control, setValue, watch } =
    useForm<ICreateMapPointDto>({
      defaultValues: {
        title: initialData?.title || '',
        address: initialData?.address || '',
        latitude: initialData?.latitude || 54.698853,
        longitude: initialData?.longitude || 55.8503,
        type: initialData?.type || 'CONTAINER',
        wasteIds: initialData?.wasteMapPoints?.map(w => w.waste.wasteId) || []
      }
    })

  const address = watch('address')
  const debouncedAddress = useDebounce(address, 1000)
  const coords = [watch('latitude'), watch('longitude')]

  // Геокодирование (Адрес -> Координаты)
  useEffect(() => {
    const getCoords = async () => {
      if (!ymapsRef.current || !debouncedAddress || debouncedAddress.length < 5)
        return

      try {
        const res = await ymapsRef.current.geocode(debouncedAddress)
        const obj = res.geoObjects.get(0)
        if (obj) {
          const newCoords = obj.geometry.getCoordinates()
          setValue('latitude', newCoords[0])
          setValue('longitude', newCoords[1])
        }
      } catch (e) {
        console.error('Geocoding error', e)
      }
    }
    getCoords()
  }, [debouncedAddress, setValue])

  const handleMapClick = async (e: any) => {
    const newCoords = e.get('coords')
    setValue('latitude', newCoords[0])
    setValue('longitude', newCoords[1])

    if (ymapsRef.current) {
      try {
        const res = await ymapsRef.current.geocode(newCoords)
        const obj = res.geoObjects.get(0)
        if (obj) setValue('address', obj.getAddressLine())
      } catch (e) {
        console.error('Reverse geocoding error', e)
      }
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ICreateMapPointDto) =>
      isEditMode
        ? mapService.update(initialData.id, data) // Предполагаем наличие метода update в сервисе
        : mapService.create(data),
    onSuccess: () => {
      toast.success(
        isEditMode ? 'Точка обновлена' : 'Точка предложена и ушла на модерацию'
      )
      router.push('/')
      router.refresh()
    },
    onError: () => toast.error('Ошибка при сохранении данных')
  })

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="hover:text-primary-brand mb-6 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors"
      >
        <ChevronLeft size={16} /> Назад к карте
      </Link>

      <h1 className="mb-8 flex items-center gap-3 text-3xl font-bold">
        <MapPin
          className="text-primary-brand"
          size={32}
        />
        {isEditMode ? 'Редактировать точку' : 'Предложить новую точку'}
      </h1>

      <form
        onSubmit={handleSubmit(data => mutate(data))}
        className="grid gap-8 lg:grid-cols-2"
      >
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Название точки</Label>
            <Input
              {...register('title', { required: 'Введите название' })}
              placeholder="Напр: Контейнеры для пластика"
            />
          </div>

          <div className="space-y-2">
            <Label>Тип объекта</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONTAINER">Контейнер</SelectItem>
                    <SelectItem value="POINT">Пункт приема</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label>Адрес</Label>
            <Input
              {...register('address', { required: 'Укажите адрес' })}
              placeholder="Введите адрес или кликните на карте"
            />
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary-brand h-12 w-full text-lg shadow-lg transition-opacity hover:opacity-90"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : isEditMode ? (
              'Сохранить изменения'
            ) : (
              'Отправить на проверку'
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label>Местоположение</Label>
          <div className="h-100 w-full overflow-hidden rounded-2xl border border-slate-200 shadow-inner">
            <YMaps
              query={{
                apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
                lang: 'ru_RU'
              }}
            >
              <Map
                state={{ center: coords, zoom: 14 }}
                width="100%"
                height="100%"
                onLoad={(ymaps: any) => {
                  ymapsRef.current = ymaps // Сохраняем доступ к API
                }}
                onClick={handleMapClick}
                modules={['geocode']}
              >
                <Placemark
                  geometry={coords}
                  options={{
                    preset: 'islands#darkGreenDotIcon',
                    draggable: false
                  }}
                />
              </Map>
            </YMaps>
          </div>
          <p className="mt-2 text-xs text-slate-400 italic">
            * Кликните на карту, чтобы автоматически определить адрес и
            координаты.
          </p>
        </div>
      </form>
    </div>
  )
}
