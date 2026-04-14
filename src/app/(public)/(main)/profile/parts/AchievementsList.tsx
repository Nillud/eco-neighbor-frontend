/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading } from '@/components/shared/heading/Heading'
import { Progress } from '@/components/ui/progress'
import { Award, Lock } from 'lucide-react'
import Image from 'next/image'

export function AchievementsList({ achievements }: { achievements: any[] }) {
  return (
    <div className="space-y-6">
      <Heading
        title="Ваши достижения"
        description={
          <>
            Открыто: {achievements.filter(a => a.isUnlocked).length} из{' '}
            {achievements.length}
          </>
        }
        headingLevel={3}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {achievements.map(ach => (
          <div
            key={ach.id}
            className={`relative rounded-2xl border p-4 transition-all ${
              ach.isUnlocked
                ? 'border-primary-brand/20 bg-white shadow-sm'
                : 'bg-slate-50/50 opacity-70 grayscale'
            }`}
          >
            <div className="flex gap-4">
              <div className="relative hidden md:flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100">
                {ach.iconUrl ? (
                  <Image
                    src={ach.iconUrl}
                    alt={ach.title}
                    className="object-cover"
                    fill
                  />
                ) : (
                  <Award
                    className="text-slate-400"
                    size={24}
                  />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold">{ach.title}</h4>
                  <span className="text-primary-brand text-[10px] min-w-10 font-bold">
                    +{ach.points} XP
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-tight">
                  {ach.description}
                </p>

                <div className="pt-2">
                  <div className="mb-1 flex justify-between text-[10px]">
                    <span>Прогресс</span>
                    <span>
                      {ach.currentValue} / {ach.requirementCount}{' '}
                      {ach.unit === 'KG' ? 'кг' : 'шт'}
                    </span>
                  </div>
                  <Progress
                    value={ach.progressPercentage}
                    className="h-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
