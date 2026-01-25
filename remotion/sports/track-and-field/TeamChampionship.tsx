import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard, StatCard } from '../../components'
import type { BaseCompositionProps, TrackAndFieldData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<TrackAndFieldData>
}

export const TrackTeamChampionship: React.FC<Props> = ({ branding, data }) => {
  const { athletes = [], season, organization } = data

  // Calculate team stats
  const totalAthletes = athletes.length
  const allResults = athletes.flatMap(a => a.events?.flatMap(e => e.results) ?? [])
  const totalPBs = allResults.filter(r => r.isPB).length
  const totalGolds = allResults.filter(r => r.place === 1).length

  // Create leaderboard by total events participated
  const leaderboardEntries = athletes
    .map(athlete => ({
      rank: 0,
      name: athlete.name,
      photo: athlete.photo,
      value: athlete.events?.flatMap(e => e.results).length ?? 0,
    }))
    .sort((a, b) => b.value - a.value)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="gradient"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || organization?.logo} size={140} />
            <Title
              text={organization?.name || 'Team'}
              subtitle={`${season?.name || '2024'} Championship Recap`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Team Stats */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <Title text="Team Performance" />
            <div style={{ display: 'flex', gap: 40 }}>
              <StatCard
                label="Athletes"
                value={totalAthletes}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Gold Medals"
                value={totalGolds}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Personal Bests"
                value={totalPBs}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Athlete Leaderboard */}
      <Sequence from={270} durationInFrames={450}>
        <AbsoluteFill>
          <Leaderboard
            entries={leaderboardEntries}
            title="Top Performers"
            valueLabel="events"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
            delay={0}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text="Champions!"
              subtitle={`${organization?.name || 'Team'} • ${season?.name || '2024'}`}
            />
            <Logo src={branding.logoUrl || organization?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
