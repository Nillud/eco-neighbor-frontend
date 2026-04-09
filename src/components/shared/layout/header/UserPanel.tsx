import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/config/pages.config'
import { IUser } from '@/services/auth/auth.types'
import { useUser } from '@/store/user.store'
import { LogOut, MessageSquare, User } from 'lucide-react'
import Link from 'next/link'

interface Props {
  user: IUser | null
}

export function UserPanel({ user }: Props) {
  const { isLoading, logout } = useUser()

  if (isLoading) {
    return <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
  }

  if (!user) {
    return (
      <Button
        size="lg"
        asChild
        className="px-4"
      >
        <Link href={PAGES.PUBLIC.LOGIN}>Войти</Link>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <div className="flex cursor-pointer items-center gap-3">
          <div className="hidden text-right md:block">
            <p className="text-primary-brand text-base font-bold">
              {user.name}
            </p>
            <p className="text-primary-brand-hover text-xs">
              {user.rating} эко-очков
            </p>
          </div>
          <Avatar className="h-12 w-12 border border-slate-100">
            <AvatarImage src={user.avatarUrl || ''} />
            <AvatarFallback className="bg-green-50 font-bold text-green-700">
              {user.name?.[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-48 rounded-xl p-2"
      >
        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg px-3 py-2"
        >
          <Link
            href="/messages"
            className="relative flex items-center gap-2"
          >
            <MessageSquare size={24} />
            {/* <span className="absolute top-2 left-5 h-3 w-3 rounded-full border-2 border-white bg-red-500" /> */}
            <span>Сообщения</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="cursor-pointer rounded-lg px-3 py-2"
        >
          <Link
            href={PAGES.USER.PROFILE}
            className="flex items-center gap-2"
          >
            <User size={16} />
            Профиль
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => logout()}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-red-600 focus:bg-red-50 focus:text-red-600"
        >
          <LogOut size={16} />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
