/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Heading } from '@/components/shared/heading/Heading'
import { Button } from '@/components/ui/button'
import { PAGES } from '@/config/pages.config'
import { userService } from '@/services/user/user.service'
import { useUser } from '@/store/user.store'
import { useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import { UserRow } from './UserRow'

export default function LeaderboardPage() {
  const { user: me } = useUser()

  const { data, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: () => userService.getLeaderboard()
  })

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="text-primary-brand animate-spin" />
      </div>
    )

  return (
    <section className="container max-w-3xl mx-auto py-10">
      <Heading
        title="Рейтинг активистов"
        description="Наши герои экологии. Присоединяйтесь к нам, чтобы попасть в список!"
      />

      <div className="mt-12 space-y-4">
        {data?.topUsers.map((u: any) => (
          <UserRow
            key={u.id}
            person={u}
            isMe={u.id === me?.id}
          />
        ))}

        {/* Если пользователь авторизован и не в топе */}
        {data?.currentUser && (
          <>
            <div className="flex flex-col items-center gap-1 py-4 opacity-40">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
              <div className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            </div>
            <UserRow
              person={data.currentUser}
              isMe={true}
            />
          </>
        )}

        {/* Если пользователь НЕ авторизован — показываем мотивационный блок */}
        {!me && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="mb-4 text-slate-600">
              Хотите увидеть своё место в рейтинге и начать зарабатывать очки?
            </p>
            <Link href={PAGES.PUBLIC.AUTH}>
              <Button
                variant="outline"
                className="border-primary-brand text-primary-brand hover:bg-primary-brand/5"
              >
                Войти в систему
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
