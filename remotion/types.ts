// Shared types for Remotion compositions

export interface Branding {
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily?: string
}

export interface BaseCompositionProps {
  branding: Branding
  aspectRatio?: 'LANDSCAPE' | 'PORTRAIT' | 'SQUARE'
}

// Track and Field
export interface TrackAndFieldData {
  season: { year: number; name: string }
  organization: { name: string; logo?: string }
  athletes: Array<{
    id: string
    name: string
    photo?: string
    events: Array<{
      name: string
      results: Array<{
        date: string
        meetName: string
        result: number
        place?: number
        isPB: boolean
      }>
    }>
  }>
  meets: Array<{
    date: string
    name: string
    location: string
  }>
}

// Running Club
export interface RunningClubData {
  club: { name: string; logo?: string }
  period: { start: string; end: string }
  members: Array<{
    id: string
    name: string
    photo?: string
    totalDistance: number
    totalRuns: number
    races: Array<{
      name: string
      date: string
      distance: number
      time: number
      pace: number
    }>
  }>
}

// Swimming
export interface SwimmingData {
  season: { year: number; name: string }
  team: { name: string; logo?: string }
  swimmers: Array<{
    id: string
    name: string
    photo?: string
    ageGroup: string
    events: Array<{
      stroke: string
      distance: number
      times: Array<{
        date: string
        meetName: string
        time: number
        isPB: boolean
      }>
    }>
  }>
}

// Baseball
export interface BaseballData {
  season: { year: number; league: string }
  team: { name: string; logo?: string }
  players: Array<{
    id: string
    name: string
    photo?: string
    position: string
    battingStats: {
      avg: number
      hits: number
      homeRuns: number
      rbis: number
      ops: number
    }
    pitchingStats?: {
      era: number
      wins: number
      losses: number
      strikeouts: number
      innings: number
    }
  }>
  games: Array<{
    date: string
    opponent: string
    score: { us: number; them: number }
    isHome: boolean
  }>
}

// Basketball
export interface BasketballData {
  season: { year: number; league: string }
  team: { name: string; logo?: string }
  players: Array<{
    id: string
    name: string
    photo?: string
    number: number
    position: string
    stats: {
      gamesPlayed: number
      ppg: number
      rpg: number
      apg: number
      spg: number
      bpg: number
      fgPct: number
      threePct: number
      ftPct: number
    }
  }>
  games: Array<{
    date: string
    opponent: string
    score: { us: number; them: number }
    isHome: boolean
  }>
}

// Gym Membership
export interface GymMembershipData {
  gym: { name: string; logo?: string }
  period: { start: string; end: string }
  members: Array<{
    id: string
    name: string
    photo?: string
    memberSince: string
    visits: Array<{
      date: string
      duration: number
      activities?: string[]
    }>
    achievements?: Array<{
      name: string
      date: string
      description: string
    }>
  }>
}

// Sales Team
export interface SalesTeamData {
  company: { name: string; logo?: string }
  period: { start: string; end: string; name: string }
  team: {
    name: string
    quota: number
    achieved: number
  }
  reps: Array<{
    id: string
    name: string
    photo?: string
    title: string
    quota: number
    achieved: number
    deals: Array<{
      name: string
      value: number
      closedDate: string
      stage: string
    }>
  }>
}

// Rep Overview
export interface RepOverviewData {
  company: { name: string; logo?: string }
  period: { start: string; end: string }
  rep: {
    id: string
    name: string
    photo?: string
    title: string
    territory?: string
    quota: number
    achieved: number
    dealsClosed: number
    avgDealSize: number
    winRate: number
    meetings: number
    calls: number
    emails: number
    topDeals: Array<{
      name: string
      value: number
      closedDate: string
    }>
    monthlyRevenue: Array<{
      month: string
      revenue: number
    }>
  }
}
