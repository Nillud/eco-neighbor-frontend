import * as z from 'zod'

export const loginSchema = z.object({
  email: z.string().email({ message: 'Введите корректный email' }),
  password: z
    .string()
    .min(6, { message: 'Пароль должен быть не менее 6 символов' })
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Имя слишком короткое'),
    email: z.string().email('Неверный формат email'),
    password: z.string().min(6, 'Минимум 6 символов'),
    confirmPassword: z.string()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают',
    path: ['confirmPassword'] // Ошибка привяжется к этому полю
  })

export type RegisterSchema = z.infer<typeof registerSchema>
export type LoginSchema = z.infer<typeof loginSchema>
