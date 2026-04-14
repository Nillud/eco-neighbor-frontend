/* eslint-disable @typescript-eslint/no-explicit-any */
import { Heading } from '@/components/shared/heading/Heading'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function ProfileInfo({ profile }: { profile: any }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: profile.name,
      email: profile.email // Только для чтения
    }
  })

  const onSubmit = () => {
    toast.success('Профиль обновлен')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md space-y-6"
    >
      <Heading
        title="Личные данные"
        headingLevel={3}
      />

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Ваше имя</Label>
          <Input
            {...register('name')}
            placeholder="Имя Фамилия"
          />
        </div>

        <div className="space-y-2">
          <Label>Email (нельзя изменить)</Label>
          <Input
            {...register('email')}
            disabled
            className="bg-slate-50"
          />
        </div>

        <Button
          type="submit"
          className="bg-primary-brand"
        >
          Сохранить изменения
        </Button>
      </div>
    </form>
  )
}
