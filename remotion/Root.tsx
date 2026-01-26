import { Composition } from 'remotion'

// Type helper for compositions - cast to any to bypass strict typing
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asLoose = <T,>(component: T): any => component

// Sports Templates
import { TrackAthleteSeasonRecap } from './sports/track-and-field/AthleteSeasonRecap'
import { TrackTeamChampionship } from './sports/track-and-field/TeamChampionship'
import { TrackEventLeaderboard } from './sports/track-and-field/EventLeaderboard'

import { RunningMemberYearReview } from './sports/running-club/MemberYearReview'
import { RunningClubLeaderboard } from './sports/running-club/ClubLeaderboard'
import { RunningRaceRecap } from './sports/running-club/RaceRecap'

import { SwimAthleteProgression } from './sports/swimming/AthleteProgression'
import { SwimMeetHighlights } from './sports/swimming/MeetHighlights'
import { SwimTeamRecords } from './sports/swimming/TeamRecords'

import { BaseballPlayerCard } from './sports/baseball/PlayerCard'
import { BaseballSeasonRecap } from './sports/baseball/SeasonRecap'
import { BaseballGameSummary } from './sports/baseball/GameSummary'

import { BasketballPlayerHighlights } from './sports/basketball/PlayerHighlights'
import { BasketballTeamSeason } from './sports/basketball/TeamSeason'
import { BasketballGameRecap } from './sports/basketball/GameRecap'

import { GymMemberYearReview } from './sports/gym/MemberYearReview'
import { GymLeaderboard } from './sports/gym/Leaderboard'
import { GymMilestoneCelebration } from './sports/gym/MilestoneCelebration'

// Business Templates
import { SalesTeamQuarter } from './business/sales/TeamQuarter'
import { SalesLeaderboard } from './business/sales/Leaderboard'
import { SalesCelebration } from './business/sales/Celebration'

import { RepPerformanceCard } from './business/rep/PerformanceCard'
import { RepYearInReview } from './business/rep/YearInReview'
import { RepDealCelebration } from './business/rep/DealCelebration'

// Library Templates
import { LibraryPatronYearReview } from './library/PatronYearReview'
import { LibraryTopBooksShowcase } from './library/TopBooksShowcase'
import { LibraryReadingJourney } from './library/ReadingJourney'

// Aspect ratio configurations
const ASPECT_RATIOS = {
  LANDSCAPE: { width: 1920, height: 1080 },
  PORTRAIT: { width: 1080, height: 1920 },
  SQUARE: { width: 1080, height: 1080 },
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Track and Field */}
      <Composition
        id="track-athlete-season-recap"
        component={asLoose(TrackAthleteSeasonRecap)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="track-team-championship"
        component={asLoose(TrackTeamChampionship)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="track-event-leaderboard"
        component={asLoose(TrackEventLeaderboard)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Running Club */}
      <Composition
        id="running-member-year-review"
        component={asLoose(RunningMemberYearReview)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="running-club-leaderboard"
        component={asLoose(RunningClubLeaderboard)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="running-race-recap"
        component={asLoose(RunningRaceRecap)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Swimming */}
      <Composition
        id="swim-athlete-progression"
        component={asLoose(SwimAthleteProgression)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="swim-meet-highlights"
        component={asLoose(SwimMeetHighlights)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="swim-team-records"
        component={asLoose(SwimTeamRecords)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Baseball */}
      <Composition
        id="baseball-player-card"
        component={asLoose(BaseballPlayerCard)}
        durationInFrames={450}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="baseball-season-recap"
        component={asLoose(BaseballSeasonRecap)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="baseball-game-summary"
        component={asLoose(BaseballGameSummary)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Basketball */}
      <Composition
        id="basketball-player-highlights"
        component={asLoose(BasketballPlayerHighlights)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="basketball-team-season"
        component={asLoose(BasketballTeamSeason)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="basketball-game-recap"
        component={asLoose(BasketballGameRecap)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Gym */}
      <Composition
        id="gym-member-year-review"
        component={asLoose(GymMemberYearReview)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="gym-leaderboard"
        component={asLoose(GymLeaderboard)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="gym-milestone-celebration"
        component={asLoose(GymMilestoneCelebration)}
        durationInFrames={300}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Sales */}
      <Composition
        id="sales-team-quarter"
        component={asLoose(SalesTeamQuarter)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="sales-leaderboard"
        component={asLoose(SalesLeaderboard)}
        durationInFrames={600}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="sales-celebration"
        component={asLoose(SalesCelebration)}
        durationInFrames={300}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Rep Overview */}
      <Composition
        id="rep-performance-card"
        component={asLoose(RepPerformanceCard)}
        durationInFrames={450}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="rep-year-in-review"
        component={asLoose(RepYearInReview)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="rep-deal-celebration"
        component={asLoose(RepDealCelebration)}
        durationInFrames={300}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />

      {/* Library */}
      <Composition
        id="library-patron-year-review"
        component={asLoose(LibraryPatronYearReview)}
        durationInFrames={900}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="library-top-books-showcase"
        component={asLoose(LibraryTopBooksShowcase)}
        durationInFrames={750}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
      <Composition
        id="library-reading-journey"
        component={asLoose(LibraryReadingJourney)}
        durationInFrames={1050}
        fps={30}
        {...ASPECT_RATIOS.LANDSCAPE}
        defaultProps={{
          branding: { primaryColor: '#3B82F6', secondaryColor: '#1E40AF', accentColor: '#F59E0B' },
          data: {},
        }}
      />
    </>
  )
}
