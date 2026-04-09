'use client'

import { IMapPoint } from '@/services/map/map.types'
import {
  GeolocationControl,
  Map,
  Placemark,
  YMaps,
  ZoomControl
} from '@pbe/react-yandex-maps'

import { DISTRICTS } from '@/app/(public)/(main)/(home)/mock/districts.data'

interface MapProps {
  points?: IMapPoint[]
  center?: [number, number] // [широта, долгота]
  zoom?: number
  className?: string
}

const DEFAULT_CENTER: [number, number] = [
  DISTRICTS[0].latitude,
  DISTRICTS[0].longitude
]

export function YandexMap({
  points = [],
  center = DEFAULT_CENTER,
  zoom = 12,
  className = 'w-full h-125'
}: MapProps) {
  return (
    <YMaps
      query={{
        apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
        lang: 'ru_RU'
      }}
    >
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-200 ${className}`}
      >
        <Map
          defaultState={{ center, zoom }}
          width="100%"
          height="100%"
          modules={[
            'control.ZoomControl',
            'control.FullscreenControl',
            'geoObject.addon.balloon',
            'geoObject.addon.hint'
          ]}
        >
          <ZoomControl options={{ size: 'small' }} />
          <GeolocationControl options={{ float: 'left' }} />

          {points.map(point => {
            const wasteBadges = point.wasteMapPoints
              .map(
                w =>
                  `<span style="background: #f0fdf4; color: var(--primary-brand); padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-right: 4px;">${w.waste.name}</span>`
              )
              .join('')

            return (
              <Placemark
                key={point.id}
                geometry={[point.latitude, point.longitude]}
                properties={{
                  hintContent:
                    point.title +
                    (point.type === 'CONTAINER'
                      ? '(Контейнер)'
                      : '(Пункт приема)'),
                  balloonContentHeader: `<div style="font-weight: bold; font-size: 16px;">${point.title}</div>`,
                  balloonContentBody: `
                  <div style="font-family: sans-serif; padding: 5px 0;">
                    <div style="color: #64748b; font-size: 13px; margin-bottom: 4px;"><span>${point.address}</span><span style="background: var(--primary-brand); color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-left: 5px;">${point.type === 'CONTAINER' ? 'Контейнер' : 'Пункт приема'}</span></div>
                    <div style="font-size: 14px; margin-bottom: 12px;">${point.description || 'Описание отсутствует'}</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 15px;">
                      ${wasteBadges}
                    </div>
                    <button 
                      onclick="window.dispatchEvent(new CustomEvent('open-waste-modal', { detail: { pointId: '${point.id}' } }))"
                      style="background: var(--primary-brand); color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; width: 100%; font-weight: 600;"
                    >
                      Отметить сдачу мусора
                    </button>
                  </div>
                `
                }}
                options={{
                  preset:
                    point.type === 'CONTAINER'
                      ? 'islands#blueCircleDotIcon'
                      : 'islands#greenCircleDotIcon',
                  hideIconOnBalloonOpen: false,
                  balloonMaxWidth: 250
                }}
              />
            )
          })}
        </Map>
      </div>
    </YMaps>
  )
}
