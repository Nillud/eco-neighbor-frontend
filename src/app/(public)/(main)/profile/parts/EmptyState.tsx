import { Button } from '@/components/ui/button'
import { Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export const EmptyState = ({
  message,
  link,
  linkText
}: {
  message: string
  link?: string
  linkText?: string
}) => (
  <div className="col-span-full flex flex-col items-center rounded-[2rem] border-2 border-dashed border-slate-100 bg-slate-50/50 py-16 text-center">
    <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
      <Calendar
        className="text-slate-300"
        size={32}
      />
    </div>
    <p className="mb-6 max-w-62.5 font-medium text-slate-500">{message}</p>
    {link && (
      <Link href={link}>
        <Button
          variant="outline"
          className="gap-2 rounded-full"
        >
          <Plus size={16} /> {linkText}
        </Button>
      </Link>
    )}
  </div>
)
