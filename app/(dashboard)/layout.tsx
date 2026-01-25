import { Sidebar } from '@/components/dashboard/Sidebar'
import { SessionProvider } from 'next-auth/react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </SessionProvider>
  )
}
