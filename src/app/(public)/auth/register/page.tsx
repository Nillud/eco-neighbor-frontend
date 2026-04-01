'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PAGES } from '@/config/pages.config'
import { RegisterSchema, registerSchema } from '@/services/auth/auth.schema'
import { useUser } from '@/store/user.store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useUser()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data: RegisterSchema) => {
    try {
      await registerUser(data)
      router.push(PAGES.PUBLIC.HOME)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Создать аккаунт</h1>
          <p className="text-sm text-slate-500">
            Станьте частью эко-сообщества вашего района
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Поле Имя */}
          <div className="space-y-1">
            <Label htmlFor="name">Как вас зовут?</Label>
            <Input
              id="name"
              placeholder="Иван Иванов"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Поле Email */}
          <div className="space-y-1">
            <Label htmlFor="email">Электронная почта</Label>
            <Input
              id="email"
              type="email"
              placeholder="eco@neighbor.ru"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Поле Пароль */}
          <div className="space-y-1">
            <Label htmlFor="password">Пароль</Label>
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

          {/* Поле Повтор пароля */}
          <div className="space-y-1">
            <Label htmlFor="confirmPassword">Повторите пароль</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-600">
          Уже есть аккаунт?{' '}
          <Link
            href={PAGES.PUBLIC.LOGIN}
            className="text-primary font-medium hover:underline"
          >
            Войти
          </Link>
        </div>
      </div>
    </div>
  )
}
