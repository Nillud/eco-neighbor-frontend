import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SERVER_URL } from '@/config/api.config'
import { Award, Star, Trophy } from 'lucide-react'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const UserRow = ({ person, isMe }: { person: any; isMe: boolean }) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return (
        <Trophy
          className="text-yellow-500"
          size={26}
        />
      )
    if (rank === 2)
      return (
        <Trophy
          className="text-slate-400"
          size={26}
        />
      )
    if (rank === 3)
      return (
        <Trophy
          className="text-amber-600"
          size={26}
        />
      )
    return (
      <span className="text-muted-foreground w-6 text-center font-mono font-bold">
        {rank}
      </span>
    )
  }

  return (
    <div
      className={`flex items-center justify-between rounded-2xl border p-4 transition-all ${
        isMe
          ? 'bg-primary-brand/5 border-primary-brand ring-primary-brand/20 ring-1'
          : 'border-slate-100 bg-white'
      } ${person.rank <= 3 ? 'shadow-md' : ''}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex w-10 justify-center">
          {getRankIcon(person.rank)}
        </div>

        <Avatar className="h-12 w-12 border-2 border-white">
          <AvatarImage
            src={person.avatarUrl ? `${SERVER_URL}${person.avatarUrl}` : ''}
          />
          <AvatarFallback className="bg-slate-200">
            {person.name[0]}
          </AvatarFallback>
        </Avatar>

        <div>
          <p className="flex items-center gap-2 font-bold">
            {person.name}
            {isMe && (
              <span className="bg-primary-brand rounded-full px-2 py-0.5 text-[10px] text-white">
                ВЫ
              </span>
            )}
          </p>
          <p className="text-muted-foreground flex items-center gap-1 text-xs">
            <Award
              size={14}
              className="text-primary-brand"
            />
            Достижений: {person._count.achievements}
          </p>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center justify-end gap-1.5 text-xl font-black text-slate-900">
          {person.rating}
          <Star
            size={20}
            className="fill-primary-brand-hover text-primary-brand-hover"
          />
        </div>
        <p className="text-primary-brand-hover text-[10px] font-bold tracking-tighter uppercase">
          Эко-очков
        </p>
      </div>
    </div>
  )
}
