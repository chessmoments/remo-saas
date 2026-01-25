import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Palette, Users, CreditCard, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default async function SettingsPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    return <div>Loading...</div>
  }

  const organization = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
  })

  return (
    <div>
      <Header
        title="Settings"
        description="Manage your organization settings"
      />

      <div className="p-8">
        <div className="max-w-2xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
              <CardDescription>
                {organization?.name} • {organization?.plan} Plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Slug: {organization?.slug}
              </p>
            </CardContent>
          </Card>

          <Link href="/dashboard/settings/branding">
            <Card className="cursor-pointer transition-shadow hover:shadow-md">
              <CardContent className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-purple-100 p-3">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Branding</h3>
                    <p className="text-sm text-gray-500">
                      Customize your logo and brand colors
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </CardContent>
            </Card>
          </Link>

          <Card className="opacity-50">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-green-100 p-3">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Billing</h3>
                  <p className="text-sm text-gray-500">
                    Manage your subscription and billing
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">Coming Soon</span>
            </CardContent>
          </Card>

          <Card className="opacity-50">
            <CardContent className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-blue-100 p-3">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Team</h3>
                  <p className="text-sm text-gray-500">
                    Manage team members and permissions
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-400">Coming Soon</span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
