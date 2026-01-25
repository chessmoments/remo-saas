import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard, StatCard } from '../../components'
import type { BaseCompositionProps, RunningClubData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RunningClubData>
}

export const RunningClubLeaderboard: React.FC<Props> = ({ branding, data }) => {
  const { members = [], club, period } = data

  const totalDistance = members.reduce((sum, m) => sum + (m.totalDistance ?? 0), 0)
  const totalRuns = members.reduce((sum, m) => sum + (m.totalRuns ?? 0), 0)

  const leaderboardEntries = members
    .map(member => ({
      rank: 0,
      name: member.name,
      photo: member.photo,
      value: member.totalDistance ?? 0,
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
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || club?.logo} size={120} />
            <Title
              text={club?.name || 'Running Club'}
              subtitle="Distance Leaderboard"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Club Stats */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <StatCard
              label="Total Distance"
              value={totalDistance}
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Total Runs"
              value={totalRuns}
              delay={10}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Members"
              value={members.length}
              delay={20}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Leaderboard */}
      <Sequence from={180} durationInFrames={330}>
        <AbsoluteFill>
          <Leaderboard
            entries={leaderboardEntries}
            title="Distance Leaders"
            valueLabel="km"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={club?.name || 'Running Club'}
            subtitle={period ? `${period.start} - ${period.end}` : '2024'}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
