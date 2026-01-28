'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/dashboard/Header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Upload, ArrowLeft, Download } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  { value: 'TRACK_AND_FIELD', label: 'Track & Field', group: 'Sports', sample: '/samples/track-and-field.json' },
  { value: 'RUNNING_CLUB', label: 'Running Club', group: 'Sports', sample: '/samples/running-club.json' },
  { value: 'SWIMMING', label: 'Swimming', group: 'Sports', sample: '/samples/swimming.json' },
  { value: 'BASEBALL', label: 'Baseball', group: 'Sports', sample: '/samples/baseball.json' },
  { value: 'BASKETBALL', label: 'Basketball', group: 'Sports', sample: '/samples/basketball.json' },
  { value: 'GYM_MEMBERSHIP', label: 'Gym Membership', group: 'Sports', sample: '/samples/gym-membership.json' },
  { value: 'SALES_TEAM', label: 'Sales Team', group: 'Business', sample: '/samples/sales-team.json' },
  { value: 'REP_OVERVIEW', label: 'Rep Overview', group: 'Business', sample: '/samples/rep-overview.json' },
  { value: 'LIBRARY', label: 'Library', group: 'Education', sample: '/samples/library.json' },
]

export default function NewDatasetPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [jsonData, setJsonData] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const json = JSON.parse(text)
      setJsonData(JSON.stringify(json, null, 2))
      if (!name) {
        setName(file.name.replace('.json', ''))
      }
    } catch (err) {
      setError('Invalid JSON file')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const rawData = JSON.parse(jsonData)

      const response = await fetch('/api/datasets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, rawData }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create dataset')
      }

      const { dataset } = await response.json()
      router.push(`/dashboard/datasets/${dataset.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create dataset')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <Header
        title="New Dataset"
        description="Upload data to generate personalized videos"
        actions={
          <Link href="/dashboard/datasets">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="p-8">
        <form onSubmit={handleSubmit}>
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Dataset Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., 2024 Season Data"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>JSON Data</Label>
                {category && (
                  <p className="text-sm text-gray-500">
                    Not sure about the format?{' '}
                    <a
                      href={CATEGORIES.find((c) => c.value === category)?.sample}
                      download
                      className="inline-flex items-center gap-1 font-medium text-blue-600 hover:text-blue-800"
                    >
                      <Download className="h-3 w-3" />
                      Download sample JSON
                    </a>
                  </p>
                )}
                <div className="relative rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Drag and drop a JSON file, or click to browse
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </div>
              </div>

              {jsonData && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <textarea
                    value={jsonData}
                    onChange={(e) => setJsonData(e.target.value)}
                    className="h-64 w-full rounded-md border bg-gray-50 p-3 font-mono text-sm"
                  />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" disabled={isLoading || !name || !category || !jsonData}>
                {isLoading ? 'Creating...' : 'Create Dataset'}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
