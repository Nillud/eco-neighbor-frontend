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
    // Добавлен горизонтальный padding px-4 для мобильных
    <section className="container mx-auto max-w-3xl px-4 py-6 md:py-10">
      <Heading
        title="Рейтинг активистов"
        description="Наши герои экологии. Присоединяйтесь к нам, чтобы попасть в список!"
      />

      <div className="mt-8 space-y-3 md:mt-12 md:space-y-4">
        {data?.topUsers.map((u: any) => (
          <UserRow
            key={u.id}
            person={u}
            isMe={u.id === me?.id}
          />
        ))}

        {data?.currentUser && (
          <>
            <div className="flex flex-col items-center gap-1 py-2 opacity-40 md:py-4">
              <div className="h-1 w-1 rounded-full bg-slate-400 md:h-1.5 md:w-1.5" />
              <div className="h-1 w-1 rounded-full bg-slate-400 md:h-1.5 md:w-1.5" />
            </div>
            <UserRow
              person={data.currentUser}
              isMe={true}
            />
          </>
        )}

        {!me && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
            <p className="mb-4 text-sm text-slate-600 md:text-base">
              Хотите увидеть своё место в рейтинге и начать зарабатывать очки?
            </p>
            <Link
              href={PAGES.PUBLIC.AUTH}
              className="inline-block w-full md:w-auto"
            >
              <Button
                variant="outline"
                className="border-primary-brand text-primary-brand hover:bg-primary-brand/5 w-full md:w-auto"
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
