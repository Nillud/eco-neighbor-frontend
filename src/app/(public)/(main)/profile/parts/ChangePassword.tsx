/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Heading } from '@/components/shared/heading/Heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { userService } from '@/services/user/user.service'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ChangePassword() {
  const { register, handleSubmit, reset } = useForm()

  const { mutate, isPending } = useMutation({
    mutationKey: ['change password'],
    mutationFn: (data: any) => userService.changePassword(data),
    onSuccess: () => {
      toast.success('Пароль успешно изменен')
      reset()
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Ошибка при смене пароля'
      toast.error(Array.isArray(message) ? message[0] : message)
    }
  })

  const onSubmit = (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error('Пароли не совпадают')
    }

    mutate({
      oldPassword: data.oldPassword,
      newPassword: data.newPassword
    })
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-6"
    >
      <Heading
        title="Безопасность"
        headingLevel={3}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="oldPassword">Старый пароль</Label>
          <Input
            id="oldPassword"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            {...register('oldPassword', { required: 'Введите старый пароль' })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">Новый пароль</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder=" Минимум 6 символов"
            disabled={isPending}
            {...register('newPassword', {
              required: 'Введите новый пароль',
              minLength: { value: 6, message: 'Минимум 6 символов' }
            })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            disabled={isPending}
            {...register('confirmPassword', { required: 'Подтвердите пароль' })}
          />
        </div>

        <Button
          type="submit"
          className="rounded-xl"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            'Обновить пароль'
          )}
        </Button>
      </div>
    </form>
  )
}
