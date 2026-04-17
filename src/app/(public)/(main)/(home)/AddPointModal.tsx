/* eslint-disable react-hooks/incompatible-library */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2, MapPin } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function AddPointModal({
  isOpen,
  onClose
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const queryClient = useQueryClient()
  const ymapsRef = useRef<any>(null)

  const { register, handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      title: '',
      address: '',
      latitude: 54.698853,
      longitude: 55.8503,
      type: 'CONTAINER',
      wasteIds: [] as string[]
    }
  })

  const address = watch('address')
  const debouncedAddress = useDebounce(address, 1000)
  const coords = [watch('latitude'), watch('longitude')]

  // Геокодирование: Адрес -> Координаты
  useEffect(() => {
    if (ymapsRef.current && debouncedAddress?.length > 5) {
      ymapsRef.current.geocode(debouncedAddress).then((res: any) => {
        const firstGeoObject = res.geoObjects.get(0)
        if (firstGeoObject) {
          const newCoords = firstGeoObject.geometry.getCoordinates()
          setValue('latitude', newCoords[0])
          setValue('longitude', newCoords[1])
        }
      })
    }
  }, [debouncedAddress, setValue])

  const handleMapClick = async (e: any) => {
    const newCoords = e.get('coords')
    setValue('latitude', newCoords[0])
    setValue('longitude', newCoords[1])

    if (ymapsRef.current) {
      const res = await ymapsRef.current.geocode(newCoords)
      const firstGeoObject = res.geoObjects.get(0)
      const addressLine = firstGeoObject?.getAddressLine()
      if (addressLine) setValue('address', addressLine)
    }
  }

  const { mutate, isPending } = useMutation({
    mutationFn: (data: any) => mapService.create(data),
    onSuccess: () => {
      toast.success('Точка отправлена на модерацию')
      queryClient.invalidateQueries({ queryKey: ['points'] })
      onClose()
    },
    onError: () => toast.error('Ошибка при создании точки')
  })

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold">
            <MapPin className="text-primary-brand" /> Добавить точку сбора
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(data => mutate(data))}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Название</Label>
              <Input
                {...register('title', { required: true })}
                placeholder="Напр: Эко-бокс в ЖК"
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
          </div>

          <div className="space-y-2">
            <Label>Адрес текстом</Label>
            <Input
              {...register('address', { required: true })}
              placeholder="Город, улица, дом..."
            />
          </div>

          <div className="h-64 w-full overflow-hidden rounded-xl border">
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
                onLoad={ymaps => (ymapsRef.current = ymaps)}
                onClick={handleMapClick}
                modules={['geocode']}
              >
                <Placemark
                  geometry={coords}
                  options={{ preset: 'islands#darkGreenDotIcon' }}
                />
              </Map>
            </YMaps>
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="bg-primary-brand h-12 w-full"
          >
            {isPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              'Предложить точку'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
