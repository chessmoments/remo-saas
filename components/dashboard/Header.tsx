'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'

interface HeaderProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

export function Header({ title, description, actions }: HeaderProps) {
  const { data: session } = useSession()

  return (
    <header className="border-b bg-white px-8 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          {session?.user && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">{session.user.name}</span>
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || ''}
                  width={36}
                  height={36}
                  className="rounded-full"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
