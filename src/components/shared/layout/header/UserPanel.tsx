import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/config/pages.config'
import { IUser } from '@/services/auth/auth.types'
import { useUser } from '@/store/user.store'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Props {
  user: IUser | null
}

export function UserPanel({ user }: Props) {
  const isLoading = useUser(state => state.isLoading)

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
  }

  if (!user) {
    return (
      <Button
        variant="default"
        size="sm"
        asChild
      >
        <Link href={PAGES.PUBLIC.LOGIN}>Войти</Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <div className="hidden flex-col text-right md:flex">
        <span className="text-sm lg:text-base font-semibold">{user.name}</span>
        <span className="text-xs lg:text-sm tracking-wider text-green-600 uppercase">
          {user.rating} XP
        </span>
      </div>

      <Link href={PAGES.USER.PROFILE} title='Перейти в профиль'>
        <Avatar className="size-9 lg:size-12 border-2 border-green-50 md:size-11">
          <AvatarImage src={user.avatarUrl || ''} />
          <AvatarFallback className="bg-green-600 text-xs text-white">
            {user.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}
