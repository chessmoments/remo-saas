import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Video, Clock, CheckCircle, XCircle } from 'lucide-react'
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

const STATUS_ICONS = {
  QUEUED: Clock,
  RENDERING: Clock,
  COMPLETED: CheckCircle,
  FAILED: XCircle,
}

export default async function DatasetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  const { id } = await params

  if (!session?.user?.organizationId) {
    return <div>Loading...</div>
  }

  const dataset = await prisma.dataSet.findFirst({
    where: {
      id,
      organizationId: session.user.organizationId,
    },
    include: {
      renderJobs: {
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!dataset) {
    notFound()
  }

  return (
    <div>
      <Header
        title={dataset.name}
        description={CATEGORY_LABELS[dataset.category] || dataset.category}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/datasets">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            <Link href={`/dashboard/templates?category=${dataset.category}&datasetId=${dataset.id}`}>
              <Button>
                <Video className="mr-2 h-4 w-4" />
                Generate Video
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Data Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-96 overflow-auto rounded-lg bg-gray-50 p-4 text-sm">
                {JSON.stringify(dataset.parsedData, null, 2)}
              </pre>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Videos</CardTitle>
            </CardHeader>
            <CardContent>
              {dataset.renderJobs.length === 0 ? (
                <p className="text-sm text-gray-500">No videos generated yet.</p>
              ) : (
                <div className="space-y-3">
                  {dataset.renderJobs.map((job) => {
                    const StatusIcon = STATUS_ICONS[job.status]
                    return (
                      <div
                        key={job.id}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center gap-3">
                          <StatusIcon
                            className={`h-5 w-5 ${
                              job.status === 'COMPLETED'
                                ? 'text-green-500'
                                : job.status === 'FAILED'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                            }`}
                          />
                          <div>
                            <p className="font-medium">{job.templateId}</p>
                            <p className="text-sm text-gray-500">
                              {job.aspectRatio} • {job.status}
                            </p>
                          </div>
                        </div>
                        {job.status === 'COMPLETED' && (
                          <Link href={`/dashboard/videos/${job.id}`}>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </Link>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
