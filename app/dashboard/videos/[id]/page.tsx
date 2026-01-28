'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Download, RefreshCw } from 'lucide-react'
import Link from 'next/link'

interface RenderJob {
  id: string
  templateId: string
  aspectRatio: string
  status: string
  progress: number
  videoUrl: string | null
  duration: number | null
  completedAt: string | null
  dataSet: {
    name: string
    category: string
  }
}

export default function VideoDetailPage() {
  const params = useParams()
  const [video, setVideo] = useState<RenderJob | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchDownloadUrl = async () => {
    try {
      const response = await fetch(`/api/videos/${params.id}/download`)
      if (response.ok) {
        const data = await response.json()
        setDownloadUrl(data.downloadUrl)
      }
    } catch (err) {
      console.error('Failed to get download URL:', err)
    }
  }

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/render/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setVideo(data.renderJob)
          if (data.renderJob.status === 'COMPLETED' && data.renderJob.videoUrl && !downloadUrl) {
            fetchDownloadUrl()
          }
        }
      } catch (err) {
        console.error('Failed to fetch video:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVideo()

    // Poll for updates if rendering
    const interval = setInterval(async () => {
      if (video?.status === 'RENDERING' || video?.status === 'QUEUED') {
        fetchVideo()
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [params.id, video?.status])

  const handleDownload = async () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank')
    } else {
      await fetchDownloadUrl()
      // downloadUrl state won't be updated yet, fetch directly
      try {
        const response = await fetch(`/api/videos/${params.id}/download`)
        if (response.ok) {
          const data = await response.json()
          window.open(data.downloadUrl, '_blank')
        }
      } catch (err) {
        console.error('Failed to get download URL:', err)
      }
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>
  }

  if (!video) {
    return <div className="p-8 text-center">Video not found</div>
  }

  return (
    <div>
      <Header
        title={video.dataSet.name}
        description={`${video.templateId} • ${video.aspectRatio}`}
        actions={
          <div className="flex gap-2">
            <Link href="/dashboard/videos">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            </Link>
            {video.status === 'COMPLETED' && (
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        }
      />

      <div className="p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {video.status === 'COMPLETED' && downloadUrl ? (
                <video
                  src={downloadUrl}
                  controls
                  className="w-full rounded-lg"
                />
              ) : video.status === 'RENDERING' || video.status === 'QUEUED' ? (
                <div className="aspect-video rounded-lg bg-gray-100 flex flex-col items-center justify-center">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  <p className="mt-4 text-sm text-gray-500">
                    {video.status === 'RENDERING'
                      ? `Rendering... ${video.progress}%`
                      : 'Queued for rendering...'}
                  </p>
                </div>
              ) : (
                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
                  <p className="text-sm text-gray-500">
                    Video preview not available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        video.status === 'COMPLETED'
                          ? 'bg-green-100 text-green-800'
                          : video.status === 'FAILED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {video.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Dataset</dt>
                  <dd className="mt-1 text-sm text-gray-900">{video.dataSet.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900">{video.dataSet.category}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Template</dt>
                  <dd className="mt-1 text-sm text-gray-900">{video.templateId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Aspect Ratio</dt>
                  <dd className="mt-1 text-sm text-gray-900">{video.aspectRatio}</dd>
                </div>
                {video.duration && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Duration</dt>
                    <dd className="mt-1 text-sm text-gray-900">{video.duration} seconds</dd>
                  </div>
                )}
                {video.completedAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Completed</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(video.completedAt).toLocaleString()}
                    </dd>
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
