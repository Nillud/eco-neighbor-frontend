import { Heading } from '@/components/shared/heading/Heading'
import { Toggle } from '@/components/ui/toggle'
import { useWaste } from '@/hooks/useWaste'
import { IMapPoint } from '@/services/map/map.types'
import { WASTE_ICONS } from '@/services/waste/waste.data'
import { useMemo } from 'react'

interface Props {
  points: IMapPoint[] | undefined
  selectedFilters: string[]
  toggleFilter: (value: string) => void
}

export function Filters({ points, selectedFilters, toggleFilter }: Props) {
  const { data } = useWaste()

  const counts = useMemo(() => {
    const map: Record<string, number> = {}

    points?.forEach(point => {
      point.wasteMapPoints.forEach(w => {
        const slug = w.waste.slug
        map[slug] = (map[slug] || 0) + 1
      })
    })

    return map
  }, [points])

  return (
    <aside className="hidden flex-col gap-4 overflow-y-auto rounded-xl border border-slate-100 bg-white p-4 shadow-sm lg:flex">
      <Heading
        title="Фильтры"
        headingLevel={3}
      />

      <div className="flex flex-wrap gap-2">
        {data?.map(el => {
          const Icon = WASTE_ICONS[el.value]
          const count = counts[el.value] || 0
          const isPressed = selectedFilters.includes(el.value)

          return (
            <Toggle
              key={el.value}
              pressed={isPressed}
              onPressedChange={() => toggleFilter(el.value)}
              variant="default"
              className="data-[state=on]:bg-primary-brand justify-start gap-3 bg-gray-100 text-gray-600 data-[state=on]:text-white"
            >
              {Icon && (
                <Icon
                  size={18}
                  className={isPressed ? 'text-white' : 'text-gray-500'}
                />
              )}
              <span className="text-sm font-medium">{el.label}</span>
              <span className={`font-semibold`}>{count}</span>
            </Toggle>
          )
        })}
      </div>

      <hr className="my-2" />
      <p className="text-xs text-slate-400">
        Найдено {points?.length || 0} активных меток в вашем районе
      </p>
    </aside>
  )
}
