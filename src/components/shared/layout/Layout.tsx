'use client'

import { PropsWithChildren } from "react";
import { Header } from "./header/Header";

export function Layout({ children }: PropsWithChildren) {
  return (
    <div className='container mx-auto px-4'>
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}