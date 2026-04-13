'use client'

import { Map, Placemark, YMaps } from '@pbe/react-yandex-maps'

interface EventMapProps {
  center: [number, number]
  title: string
  address: string
  className?: string
}

export function EventMap({
  center,
  title,
  address,
  className = 'w-full h-64'
}: EventMapProps) {
  return (
    <YMaps
      query={{
        apikey: process.env.NEXT_PUBLIC_YANDEX_MAPS_API_KEY,
        lang: 'ru_RU'
      }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-slate-200 ${className}`}
      >
        <Map
          defaultState={{ center, zoom: 15 }}
          width="100%"
          height="100%"
          modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
        >
          <Placemark
            geometry={center}
            properties={{
              hintContent: title,
              balloonContentHeader: `<div style="font-weight: bold;">${title}</div>`,
              balloonContentBody: `<div style="font-size: 13px;">${address}</div>`
            }}
            options={{
              preset: 'islands#darkGreenCircleDotIcon'
            }}
          />
        </Map>
      </div>
    </YMaps>
  )
}
