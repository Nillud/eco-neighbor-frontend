import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, PropsWithChildren } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function ActionButton({
  children,
  className,
  onClick,
  ...data
}: PropsWithChildren<Props>) {
  return (
    <button
      className={cn(
        'bg-primary-brand hover:bg-primary-brand-hover rounded-full px-6 py-3 font-semibold text-white shadow-lg transition-all active:scale-95',
        className
      )}
      onClick={onClick}
      {...data}
    >
      {children}
    </button>
  )
}
