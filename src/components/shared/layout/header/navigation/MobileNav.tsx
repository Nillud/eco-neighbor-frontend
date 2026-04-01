'use client'

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Menu } from "lucide-react" // bun add lucide-react
import { PUBLIC_NAVIGATION, USER_NAVIGATION } from "./navigation.data"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Logo } from "../Logo"

interface Props {
  isAuth: boolean
}

export function MobileNav({ isAuth }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const items = isAuth 
    ? [...PUBLIC_NAVIGATION, ...USER_NAVIGATION] 
    : PUBLIC_NAVIGATION

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="p-2 -ml-2 text-slate-600">
          <Menu size={24} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-75 sm:w-100">
        <SheetHeader>
          <SheetTitle className="text-left text-green-600 font-bold">
            <Logo />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-8">
          {items.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              onClick={() => setOpen(false)} // Закрываем при клике
              className={`text-lg font-medium py-2 px-4 border-b border-slate-50 ${
                pathname === item.link ? "text-green-600" : "text-slate-900"
              }`}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}