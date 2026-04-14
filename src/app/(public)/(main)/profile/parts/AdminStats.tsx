import { Heading } from '@/components/shared/heading/Heading'
import { userService } from '@/services/user/user.service'
import { useQuery } from '@tanstack/react-query'
import { AlertCircle, Calendar, Megaphone, Users } from 'lucide-react'

export function AdminStats() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => await userService.getAdminStats()
  })

  const cards = [
    {
      label: 'Пользователи',
      value: stats?.users.total,
      icon: <Users />,
      color: 'text-blue-600'
    },
    {
      label: 'Мероприятия',
      value: stats?.events.active,
      icon: <Calendar />,
      color: 'text-green-600'
    },
    {
      label: 'Объявления',
      value: stats?.ads.active,
      icon: <Megaphone />,
      color: 'text-orange-600'
    },
    {
      label: 'Нужна верификация',
      value: stats?.map.needsVerification,
      icon: <AlertCircle />,
      color:
        (stats?.map.needsVerification || 0) > 0
          ? 'text-red-600'
          : 'text-slate-400'
    }
  ]

  return (
    <>
      <Heading
        title="Админ-панель"
        headingLevel={3}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mt-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="flex items-center gap-4 rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className={`${card.color} rounded-xl bg-slate-50 p-3`}>
              {card.icon}
            </div>
            <div>
              <p className="text-muted-foreground text-sm">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
