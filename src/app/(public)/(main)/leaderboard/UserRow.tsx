/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SERVER_URL } from '@/config/api.config'
import { Award, Star, Trophy } from 'lucide-react'

export const UserRow = ({ person, isMe }: { person: any; isMe: boolean }) => {
  const getRankIcon = (rank: number) => {
    // Уменьшаем размер иконок для мобилок (size={20} vs {26})
    const size =
      typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 26

    if (rank === 1)
      return (
        <Trophy
          className="text-yellow-500"
          size={size}
        />
      )
    if (rank === 2)
      return (
        <Trophy
          className="text-slate-400"
          size={size}
        />
      )
    if (rank === 3)
      return (
        <Trophy
          className="text-amber-600"
          size={size}
        />
      )

    return (
      <span className="text-muted-foreground w-5 text-center font-mono text-sm font-bold md:w-6 md:text-base">
        {rank}
      </span>
    )
  }

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border p-3 transition-all md:p-4 ${
        isMe
          ? 'bg-primary-brand/5 border-primary-brand ring-primary-brand/20 ring-1'
          : 'border-slate-100 bg-white'
      } ${person.rank <= 3 ? 'shadow-md' : ''}`}
    >
      <div className="flex items-center gap-2 overflow-hidden md:gap-4">
        {/* Индикатор ранга */}
        <div className="flex w-6 shrink-0 justify-center md:w-10">
          {getRankIcon(person.rank)}
        </div>

        {/* Аватар: h-10 на мобильных, h-12 на десктопе */}
        <Avatar className="h-10 w-10 shrink-0 border-2 border-white shadow-sm md:h-12 md:w-12">
          <AvatarImage
            src={person.avatarUrl ? `${SERVER_URL}${person.avatarUrl}` : ''}
          />
          <AvatarFallback className="bg-slate-200 text-xs">
            {person.name[0]}
          </AvatarFallback>
        </Avatar>

        <div className="overflow-hidden">
          <p className="flex items-center gap-1.5 truncate text-sm font-bold md:text-base">
            <span className="truncate">{person.name}</span>
            {isMe && (
              <span className="bg-primary-brand shrink-0 rounded-full px-1.5 py-0.5 text-[8px] text-white md:text-[10px]">
                ВЫ
              </span>
            )}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-[10px] md:text-xs">
            <Award
              size={12}
              className="text-primary-brand shrink-0"
            />
            <span className="truncate">
              Достижений: {person._count.achievements}
            </span>
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2 text-right">
        <div className="flex items-center justify-end gap-1 text-base leading-none font-black text-slate-900 md:text-xl">
          {person.rating}
          <Star
            size={16}
            className="fill-primary-brand-hover text-primary-brand-hover md:size-5"
          />
        </div>
        <p className="text-primary-brand-hover mt-0.5 text-[8px] font-bold tracking-tighter uppercase md:text-[10px]">
          Эко-очков
        </p>
      </div>
    </div>
  )
}
