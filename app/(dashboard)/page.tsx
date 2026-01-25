import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import { StatsCard } from '@/components/dashboard/StatsCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Video, Clock, CheckCircle, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    return <div>Loading...</div>
  }

  const [datasetsCount, videosCount, renderingCount, completedCount, recentVideos] = await Promise.all([
    prisma.dataSet.count({
      where: { organizationId: session.user.organizationId },
    }),
    prisma.renderJob.count({
      where: {
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
      },
    }),
    prisma.renderJob.count({
      where: {
        organizationId: session.user.organizationId,
        status: 'RENDERING',
      },
    }),
    prisma.renderJob.count({
      where: {
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
        completedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    }),
    prisma.renderJob.findMany({
      where: {
        organizationId: session.user.organizationId,
        status: 'COMPLETED',
      },
      orderBy: { completedAt: 'desc' },
      take: 5,
      include: {
        dataSet: { select: { name: true } },
      },
    }),
  ])

  return (
    <div>
      <Header
        title="Dashboard"
        description="Overview of your video generation activity"
        actions={
          <Link href="/dashboard/datasets/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Dataset
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Datasets"
            value={datasetsCount}
            icon={Database}
          />
          <StatsCard
            title="Videos Generated"
            value={videosCount}
            icon={Video}
          />
          <StatsCard
            title="Currently Rendering"
            value={renderingCount}
            icon={Clock}
          />
          <StatsCard
            title="Completed This Week"
            value={completedCount}
            icon={CheckCircle}
          />
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {recentVideos.length === 0 ? (
                <p className="text-sm text-gray-500">No videos generated yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div>
                        <p className="font-medium">{video.dataSet.name}</p>
                        <p className="text-sm text-gray-500">
                          {video.templateId} • {video.aspectRatio}
                        </p>
                      </div>
                      <Link href={`/dashboard/videos/${video.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                <Link href="/dashboard/datasets/new">
                  <Button variant="outline" className="w-full justify-start">
                    <Database className="mr-2 h-4 w-4" />
                    Upload New Dataset
                  </Button>
                </Link>
                <Link href="/dashboard/templates">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="mr-2 h-4 w-4" />
                    Browse Templates
                  </Button>
                </Link>
                <Link href="/dashboard/settings/branding">
                  <Button variant="outline" className="w-full justify-start">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Update Branding
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
