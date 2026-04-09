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
    <aside className="flex flex-col gap-4 lg:h-full lg:overflow-y-auto lg:rounded-xl lg:border lg:border-slate-100 lg:bg-white lg:p-4 lg:shadow-sm">
      <div className="hidden lg:flex">
        <Heading
          title="Фильтры"
          headingLevel={3}
        />
      </div>

      <div className="no-scrollbar -mx-4 flex flex-nowrap gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-wrap lg:overflow-visible lg:px-0">
        {data?.map(el => {
          const Icon = WASTE_ICONS[el.value]
          const count = counts[el.value] || 0
          const isPressed = selectedFilters.includes(el.value)

          return (
            <Toggle
              key={el.value}
              pressed={isPressed}
              onPressedChange={() => toggleFilter(el.value)}
              className="data-[state=on]:bg-primary-brand data-[state=on]:text-white shrink-0 gap-2 border border-slate-200 bg-white lg:justify-start"
            >
              {Icon && <Icon size={16} />}
              <span className="text-xs lg:text-sm">{el.label}</span>
              <span className="text-xs opacity-60 lg:text-xs font-semibold">{count}</span>
            </Toggle>
          )
        })}
      </div>

      <hr />
      <p className="text-xs text-slate-400">
        Найдено {points?.length || 0} активных меток в вашем районе
      </p>
    </aside>
  )
}
