import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard as LeaderboardComponent, StatCard } from '../../components'
import type { BaseCompositionProps, GymMembershipData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<GymMembershipData>
}

export const GymLeaderboard: React.FC<Props> = ({ branding, data }) => {
  const { members = [], gym, period } = data

  const totalVisits = members.reduce((sum, m) => sum + (m.visits?.length ?? 0), 0)
  const totalHours = Math.round(members.reduce((sum, m) =>
    sum + (m.visits?.reduce((vs, v) => vs + v.duration, 0) ?? 0), 0) / 60)

  const leaderboardEntries = members
    .map(member => ({
      rank: 0,
      name: member.name,
      photo: member.photo,
      value: member.visits?.length ?? 0,
    }))
    .sort((a, b) => b.value - a.value)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="dots"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || gym?.logo} size={120} />
            <Title
              text={gym?.name || 'Gym'}
              subtitle="Most Active Members"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Gym Stats */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <StatCard
              label="Total Visits"
              value={totalVisits}
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Total Hours"
              value={totalHours}
              delay={15}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Active Members"
              value={members.length}
              delay={30}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Leaderboard */}
      <Sequence from={180} durationInFrames={330}>
        <AbsoluteFill>
          <LeaderboardComponent
            entries={leaderboardEntries}
            title="Visit Leaders"
            valueLabel="visits"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={gym?.name || 'Gym'}
            subtitle={period ? `${period.start} - ${period.end}` : '2024'}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
