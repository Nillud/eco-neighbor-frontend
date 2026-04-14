'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList } from '@/components/ui/tabs'
import { SERVER_URL } from '@/config/api.config'
import { userService } from '@/services/user/user.service'
import { useQuery } from '@tanstack/react-query'
import {
  Calendar,
  Loader2,
  Lock,
  ShieldCheck,
  Trophy,
  User
} from 'lucide-react'

import { AchievementsList } from './parts/AchievementsList'
import { AdminStats } from './parts/AdminStats'
import { ChangePassword } from './parts/ChangePassword'
import { MyAds } from './parts/MyAds'
import { MyEvents } from './parts/MyEvents'
import { ProfileInfo } from './parts/ProfileInfo'
import { TabButton } from './ui/TabButton'

export default function ProfilePage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['full-profile'],
    queryFn: () => userService.getFullProfile()
  })

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['activity'],
    queryFn: () => userService.getActivity()
  })

  if (isLoading)
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader2 className="text-primary-brand h-10 w-10 animate-spin" />
      </div>
    )

  if (!profile)
    return (
      <div className="py-20 text-center text-red-500">Профиль не найден</div>
    )

  const avatarUrl = profile.avatarUrl?.startsWith('https:')
    ? profile.avatarUrl
    : `${SERVER_URL}${profile.avatarUrl}`

  return (
    <section className="container px-4 py-12">
      <Tabs
        defaultValue="general"
        className="flex items-start gap-10 data-horizontal:lg:flex-row"
      >
        <aside className="w-full space-y-6 lg:sticky lg:top-24 lg:w-75">
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm ring-1 ring-slate-200/50">
            <div className="relative h-20 bg-slate-50">
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: profile.level.color }}
              />
            </div>
            <div className="relative px-6 pb-6 text-center">
              <div className="relative -mt-10 mb-4 inline-block">
                <Avatar className="h-24 w-24 border-4 border-white shadow-md">
                  <AvatarImage src={profile.avatarUrl ? avatarUrl : ''} />
                  <AvatarFallback className="bg-slate-100 text-2xl text-slate-600">
                    {profile.name[0]}
                  </AvatarFallback>
                </Avatar>
                <div
                  className="absolute right-0 bottom-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: profile.level.color }}
                >
                  <Trophy
                    size={10}
                    className="text-white"
                  />
                </div>
              </div>

              <h2 className="line-clamp-1 text-xl font-black text-slate-900">
                {profile.name}
              </h2>

              <p className="mb-4 truncate text-sm font-medium text-slate-500">
                {profile.email}
              </p>

              <div
                className="inline-flex items-center rounded-full px-4 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase shadow-sm"
                style={{ backgroundColor: profile.level.color }}
              >
                {profile.level.current}
              </div>

              <div className="bg-primary-brand/5 border-primary-brand/10 mt-4 rounded-xl border p-4">
                <p className="text-primary-brand text-sm">
                  Текущий рейтинг: <strong>{profile.rating}</strong>
                </p>
              </div>
            </div>
          </div>

          <nav className="rounded-3xl border border-slate-100 bg-white p-2 shadow-sm ring-1 ring-slate-200/50">
            <TabsList className="flex h-auto w-full flex-col gap-1 bg-transparent p-0 group-data-horizontal/tabs:h-auto">
              <TabButton
                value="general"
                icon={<User size={18} />}
                label="Личные данные"
              />
              <TabButton
                value="achievements"
                icon={<Trophy size={18} />}
                label="Достижения"
              />
              <TabButton
                value="ads"
                icon={<Calendar size={18} />}
                label="Мои объявления"
              />
              <TabButton
                value="events"
                icon={<Calendar size={18} />}
                label="Мои мероприятия"
              />
              <TabButton
                value="security"
                icon={<Lock size={18} />}
                label="Безопасность"
              />

              {profile.role === 'ADMIN' && (
                <div className="mx-2 my-2 border-t border-slate-100" />
              )}

              {profile.role === 'ADMIN' && (
                <TabButton
                  value="admin"
                  icon={
                    <ShieldCheck
                      size={18}
                      className="text-red-500"
                    />
                  }
                  label="Админ-панель"
                />
              )}
            </TabsList>
          </nav>
        </aside>

        <div className="h-full flex-1 rounded-[32px] border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-200/50 md:p-10">
          <TabsContent
            value="general"
            className="mt-0 focus-visible:outline-none"
          >
            <ProfileInfo profile={profile} />
          </TabsContent>

          <TabsContent
            value="achievements"
            className="mt-0 focus-visible:outline-none"
          >
            <AchievementsList achievements={profile.achievements} />
          </TabsContent>

          <TabsContent
            value="ads"
            className="mt-0 focus-visible:outline-none"
          >
            <MyAds
              ads={activity?.ads || []}
              isLoading={isLoadingActivity}
            />
          </TabsContent>

          <TabsContent
            value="events"
            className="mt-0 focus-visible:outline-none"
          >
            <MyEvents
              participating={activity?.participating || []}
              created={activity?.created || []}
              isLoading={isLoadingActivity}
            />
          </TabsContent>

          <TabsContent
            value="security"
            className="mt-0 focus-visible:outline-none"
          >
            <ChangePassword />
          </TabsContent>

          {profile.role === 'ADMIN' && (
            <TabsContent
              value="admin"
              className="mt-0 focus-visible:outline-none"
            >
              <AdminStats />
            </TabsContent>
          )}
        </div>
      </Tabs>
    </section>
  )
}
