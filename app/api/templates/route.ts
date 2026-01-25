import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApiErrors } from '@/lib/api-error'
import { Category } from '@prisma/client'

// Template registry - maps to Remotion compositions
const TEMPLATE_REGISTRY = [
  // Track and Field
  { id: 'track-athlete-season-recap', name: 'Athlete Season Recap', category: 'TRACK_AND_FIELD', compositionId: 'track-athlete-season-recap', description: 'Individual athlete highlights with PBs and season progression' },
  { id: 'track-team-championship', name: 'Team Championship', category: 'TRACK_AND_FIELD', compositionId: 'track-team-championship', description: 'Team performance summary with top athletes' },
  { id: 'track-event-leaderboard', name: 'Event Leaderboard', category: 'TRACK_AND_FIELD', compositionId: 'track-event-leaderboard', description: 'Rankings for a specific event' },

  // Running Club
  { id: 'running-member-year-review', name: 'Member Year Review', category: 'RUNNING_CLUB', compositionId: 'running-member-year-review', description: 'Individual member running stats and races' },
  { id: 'running-club-leaderboard', name: 'Club Leaderboard', category: 'RUNNING_CLUB', compositionId: 'running-club-leaderboard', description: 'Club distance and activity rankings' },
  { id: 'running-race-recap', name: 'Race Recap', category: 'RUNNING_CLUB', compositionId: 'running-race-recap', description: 'Race day highlights and results' },

  // Swimming
  { id: 'swim-athlete-progression', name: 'Athlete Progression', category: 'SWIMMING', compositionId: 'swim-athlete-progression', description: 'Swimmer improvement over the season' },
  { id: 'swim-meet-highlights', name: 'Meet Highlights', category: 'SWIMMING', compositionId: 'swim-meet-highlights', description: 'Swim meet results and PBs' },
  { id: 'swim-team-records', name: 'Team Records', category: 'SWIMMING', compositionId: 'swim-team-records', description: 'Team record board by event' },

  // Baseball
  { id: 'baseball-player-card', name: 'Player Card', category: 'BASEBALL', compositionId: 'baseball-player-card', description: 'Animated player stats card' },
  { id: 'baseball-season-recap', name: 'Season Recap', category: 'BASEBALL', compositionId: 'baseball-season-recap', description: 'Team season summary with leaders' },
  { id: 'baseball-game-summary', name: 'Game Summary', category: 'BASEBALL', compositionId: 'baseball-game-summary', description: 'Single game recap' },

  // Basketball
  { id: 'basketball-player-highlights', name: 'Player Highlights', category: 'BASKETBALL', compositionId: 'basketball-player-highlights', description: 'Player stats and shooting percentages' },
  { id: 'basketball-team-season', name: 'Team Season', category: 'BASKETBALL', compositionId: 'basketball-team-season', description: 'Team season summary' },
  { id: 'basketball-game-recap', name: 'Game Recap', category: 'BASKETBALL', compositionId: 'basketball-game-recap', description: 'Game highlights with box score' },

  // Gym
  { id: 'gym-member-year-review', name: 'Member Year Review', category: 'GYM_MEMBERSHIP', compositionId: 'gym-member-year-review', description: 'Member attendance and achievements' },
  { id: 'gym-leaderboard', name: 'Leaderboard', category: 'GYM_MEMBERSHIP', compositionId: 'gym-leaderboard', description: 'Most active members ranking' },
  { id: 'gym-milestone-celebration', name: 'Milestone Celebration', category: 'GYM_MEMBERSHIP', compositionId: 'gym-milestone-celebration', description: 'Achievement unlocked animation' },

  // Sales
  { id: 'sales-team-quarter', name: 'Team Quarter', category: 'SALES_TEAM', compositionId: 'sales-team-quarter', description: 'Quarterly team performance' },
  { id: 'sales-leaderboard', name: 'Sales Leaderboard', category: 'SALES_TEAM', compositionId: 'sales-leaderboard', description: 'Rep revenue rankings' },
  { id: 'sales-celebration', name: 'Celebration', category: 'SALES_TEAM', compositionId: 'sales-celebration', description: 'Quota or deal celebration' },

  // Rep Overview
  { id: 'rep-performance-card', name: 'Performance Card', category: 'REP_OVERVIEW', compositionId: 'rep-performance-card', description: 'Individual rep stats card' },
  { id: 'rep-year-in-review', name: 'Year in Review', category: 'REP_OVERVIEW', compositionId: 'rep-year-in-review', description: 'Annual performance summary' },
  { id: 'rep-deal-celebration', name: 'Deal Celebration', category: 'REP_OVERVIEW', compositionId: 'rep-deal-celebration', description: 'Big deal closed animation' },
]

export async function GET(request: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return ApiErrors.unauthorized()
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as Category | null

    let templates = TEMPLATE_REGISTRY

    if (category) {
      templates = templates.filter(t => t.category === category)
    }

    // Group by category for easier frontend consumption
    const grouped = templates.reduce((acc, template) => {
      if (!acc[template.category]) {
        acc[template.category] = []
      }
      acc[template.category].push(template)
      return acc
    }, {} as Record<string, typeof templates>)

    return NextResponse.json({
      templates,
      grouped,
      categories: Object.keys(Category),
    })
  } catch (error) {
    return ApiErrors.internal('Failed to fetch templates', error)
  }
}
