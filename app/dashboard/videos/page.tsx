import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, ChevronRight, Download } from 'lucide-react'
import Link from 'next/link'

const CATEGORY_LABELS: Record<string, string> = {
  TRACK_AND_FIELD: 'Track & Field',
  RUNNING_CLUB: 'Running Club',
  SWIMMING: 'Swimming',
  BASEBALL: 'Baseball',
  BASKETBALL: 'Basketball',
  GYM_MEMBERSHIP: 'Gym Membership',
  SALES_TEAM: 'Sales Team',
  REP_OVERVIEW: 'Rep Overview',
}

export default async function VideosPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    return <div>Loading...</div>
  }

  const videos = await prisma.renderJob.findMany({
    where: {
      organizationId: session.user.organizationId,
      status: 'COMPLETED',
      videoUrl: { not: null },
    },
    orderBy: { completedAt: 'desc' },
    include: {
      dataSet: { select: { name: true } },
    },
  })

  return (
    <div>
      <Header
        title="Videos"
        description="All your generated videos"
      />

      <div className="p-8">
        {videos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Video className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No videos yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Generate your first video from a dataset.
              </p>
              <Link href="/dashboard/datasets" className="mt-4">
                <Button>Go to Datasets</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Link key={video.id} href={`/dashboard/videos/${video.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                      <Video className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{video.dataSet.name}</h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5">
                        {video.templateId}
                      </span>
                      <span>{video.aspectRatio}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      {video.duration ? `${video.duration}s` : ''} •{' '}
                      {video.completedAt && new Date(video.completedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
