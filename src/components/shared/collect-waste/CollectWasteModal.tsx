'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Toggle } from '@/components/ui/toggle'
import { IMapPoint } from '@/services/map/map.types'
import { WASTE_ICONS } from '@/services/waste/waste.data'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
  point: IMapPoint | undefined
  onSuccess: (totalPoints: number, values: Record<string, number>) => void
}

export function CollectWasteModal({
  isOpen,
  onClose,
  point,
  onSuccess
}: Props) {
  // Храним значения: { plastic: 5, paper: 2 }
  const [values, setValues] = useState<Record<string, number>>({})

  if (!point) return null

  const handleToggle = (slug: string) => {
    setValues(prev => {
      const newValues = { ...prev }
      if (newValues[slug] !== undefined) {
        delete newValues[slug]
      } else {
        newValues[slug] = 0
      }
      return newValues
    })
  }

  const handleSubmit = () => {
    const total = Object.values(values).reduce((acc, curr) => acc + curr, 0)
    if (total <= 0) return

    onSuccess(total, values)
    setValues({})
    onClose()
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Что вы сдали в «{point.title}»?</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <p className="text-sm text-slate-500">
            Выберите категории и укажите количество (кг или шт):
          </p>

          <div className="space-y-4">
            {point.wasteMapPoints.map(({ waste }) => {
              const Icon = WASTE_ICONS[waste.slug]
              const isSelected = values[waste.slug] !== undefined

              return (
                <div
                  key={waste.slug}
                  className="flex flex-col gap-2"
                >
                  <Toggle
                    pressed={isSelected}
                    onPressedChange={() => handleToggle(waste.slug)}
                    variant="outline"
                    className="w-full justify-start gap-3 data-[state=on]:border-green-500"
                  >
                    {Icon && <Icon size={16} />}
                    {waste.name}
                  </Toggle>

                  {isSelected && (
                    <Input
                      type="number"
                      placeholder="Введите количество..."
                      min="1"
                      className="ml-4 w-[calc(100%-1rem)]"
                      onChange={e =>
                        setValues(prev => ({
                          ...prev,
                          [waste.slug]: Number(e.target.value)
                        }))
                      }
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <Button
          className="w-full bg-green-600 hover:bg-green-700"
          onClick={handleSubmit}
          disabled={Object.keys(values).length === 0 || Object.values(values).some(el => el === 0)}
        >
          Подтвердить и получить баллы
        </Button>
      </DialogContent>
    </Dialog>
  )
}
