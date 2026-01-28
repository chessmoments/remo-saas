import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Database, ChevronRight } from 'lucide-react'
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

export default async function DatasetsPage() {
  const session = await auth()

  if (!session?.user?.organizationId) {
    return <div>Loading...</div>
  }

  const datasets = await prisma.dataSet.findMany({
    where: { organizationId: session.user.organizationId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { renderJobs: true } },
    },
  })

  return (
    <div>
      <Header
        title="Datasets"
        description="Manage your uploaded data for video generation"
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
        {datasets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Database className="h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No datasets yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Upload your first dataset to start generating videos.
              </p>
              <Link href="/dashboard/datasets/new" className="mt-4">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Dataset
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {datasets.map((dataset) => (
              <Link key={dataset.id} href={`/dashboard/datasets/${dataset.id}`}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="rounded-lg bg-blue-100 p-3">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{dataset.name}</h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-500">
                          <span className="rounded-full bg-gray-100 px-2 py-0.5">
                            {CATEGORY_LABELS[dataset.category] || dataset.category}
                          </span>
                          <span>{dataset._count.renderJobs} videos generated</span>
                          <span>
                            Created {new Date(dataset.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
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
