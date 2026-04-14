import { TabsTrigger } from '@/components/ui/tabs'

/* eslint-disable @typescript-eslint/no-explicit-any */
export function TabButton({
  value,
  icon,
  label
}: {
  value: string
  icon: any
  label: string
}) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:text-primary-brand w-full justify-start gap-3 rounded-xl px-4 py-3 data-[state=active]:bg-slate-100"
    >
      {icon} {label}
    </TabsTrigger>
  )
}
