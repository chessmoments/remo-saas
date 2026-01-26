'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Video, Play } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  compositionId: string
}

const CATEGORY_LABELS: Record<string, string> = {
  TRACK_AND_FIELD: 'Track & Field',
  RUNNING_CLUB: 'Running Club',
  SWIMMING: 'Swimming',
  BASEBALL: 'Baseball',
  BASKETBALL: 'Basketball',
  GYM_MEMBERSHIP: 'Gym Membership',
  SALES_TEAM: 'Sales Team',
  REP_OVERVIEW: 'Rep Overview',
  LIBRARY: 'Library',
}

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <TemplatesContent />
    </Suspense>
  )
}

function TemplatesContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [templates, setTemplates] = useState<Template[]>([])
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [isLoading, setIsLoading] = useState(true)

  const datasetId = searchParams.get('datasetId')

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const url = category
          ? `/api/templates?category=${category}`
          : '/api/templates'
        const response = await fetch(url)
        const data = await response.json()
        setTemplates(data.templates)
      } catch (err) {
        console.error('Failed to fetch templates:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTemplates()
  }, [category])

  const handleGenerateVideo = async (templateId: string) => {
    if (!datasetId) {
      router.push('/dashboard/datasets')
      return
    }

    try {
      const response = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dataSetId: datasetId,
          templateId,
          aspectRatio: 'LANDSCAPE',
        }),
      })

      if (response.ok) {
        const { renderJob } = await response.json()
        router.push(`/dashboard/videos/${renderJob.id}`)
      }
    } catch (err) {
      console.error('Failed to start render:', err)
    }
  }

  const groupedTemplates = templates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<string, Template[]>)

  return (
    <div>
      <Header
        title="Templates"
        description={datasetId ? 'Select a template to generate a video' : 'Browse available video templates'}
        actions={
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
      />

      <div className="p-8">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading templates...</div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedTemplates).map(([cat, catTemplates]) => (
              <div key={cat}>
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {CATEGORY_LABELS[cat] || cat}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {catTemplates.map((template) => (
                    <Card key={template.id} className="transition-shadow hover:shadow-md">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="rounded-lg bg-blue-100 p-2">
                            <Video className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {datasetId ? (
                          <Button
                            onClick={() => handleGenerateVideo(template.id)}
                            className="w-full"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Generate Video
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" asChild>
                            <a href={`/dashboard/datasets?category=${template.category}`}>
                              Select Dataset
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
