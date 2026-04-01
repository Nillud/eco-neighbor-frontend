'use client'

import { YandexIcon } from '@/components/icons/YandexIcon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { API_URL } from '@/config/api.config'
import { PAGES } from '@/config/pages.config'
import { LoginSchema, loginSchema } from '@/services/auth/auth.schema'
import { useUser } from '@/store/user.store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function LoginPage() {
  const { login, isLoading } = useUser()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginSchema) => {
    try {
      await login(data)
      router.push(PAGES.PUBLIC.HOME)
    } catch (e) {
      console.error('Ошибка при входе:', e)
    }
  }

  const handleYandexLogin = () => {
    window.location.href = `${API_URL}/auth/yandex`
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-slate-900">С возвращением!</h1>
          <p className="text-sm text-slate-500">
            Войдите, чтобы продолжить заботу о районе
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Пароль</Label>
              <Link
                href={PAGES.PUBLIC.FORGOT_PASSWORD}
                className="text-primary text-xs hover:underline"
              >
                Забыли пароль?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Входим...' : 'Войти'}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-400">Или</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-red-100 text-slate-700 transition-colors hover:bg-red-50 hover:text-red-600"
              onClick={handleYandexLogin}
            >
              <YandexIcon size={20} />
              Войти с Яндекс ID
            </Button>

            <div className="pt-2 text-center text-sm text-slate-600">
              Впервые у нас?{' '}
              <Link
                href={PAGES.PUBLIC.REGISTER}
                className="text-primary font-medium hover:underline"
              >
                Создать аккаунт
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
