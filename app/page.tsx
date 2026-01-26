import Link from 'next/link'
import { Video, Database, Palette, Zap, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Database,
    title: 'Upload Your Data',
    description: 'Upload JSON data from your sports teams, sales teams, or gym memberships.',
  },
  {
    icon: Palette,
    title: 'Custom Branding',
    description: 'Add your logo and brand colors to every video automatically.',
  },
  {
    icon: Video,
    title: 'Choose Templates',
    description: '24 professionally designed templates across 8 categories.',
  },
  {
    icon: Zap,
    title: 'Generate Videos',
    description: 'Get personalized videos in landscape, portrait, or square formats.',
  },
]

const categories = [
  { name: 'Track & Field', count: 3 },
  { name: 'Running Clubs', count: 3 },
  { name: 'Swimming', count: 3 },
  { name: 'Baseball', count: 3 },
  { name: 'Basketball', count: 3 },
  { name: 'Gym Memberships', count: 3 },
  { name: 'Sales Teams', count: 3 },
  { name: 'Sales Reps', count: 3 },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Video className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">VideoCardFactory</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Sign In
            </Link>
            <Link
              href="/login"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-purple-700 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl">
            Turn Your Data Into
            <br />
            Stunning Videos
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            Upload your sports stats, sales data, or membership info and generate personalized,
            branded videos for athletes, teams, and employees.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50"
            >
              Start Free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="#features"
              className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-lg font-semibold text-white hover:bg-white/10"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">
              Generate professional videos in four simple steps
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <div key={feature.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">24 Templates, 8 Categories</h2>
            <p className="mt-4 text-lg text-gray-600">
              Perfect for sports organizations and sales teams
            </p>
          </div>
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="rounded-lg border bg-white p-6 text-center shadow-sm"
              >
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{category.count} templates</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
          <p className="mt-4 text-lg text-gray-600">
            Sign up today and create your first video in minutes.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Create Free Account
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-6 w-6 text-blue-600" />
              <span className="font-bold">VideoCardFactory</span>
            </div>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} VideoCardFactory. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
