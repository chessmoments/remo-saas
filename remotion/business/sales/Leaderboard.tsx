import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard as LeaderboardComponent, StatCard } from '../../components'
import type { BaseCompositionProps, SalesTeamData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SalesTeamData>
}

export const SalesLeaderboard: React.FC<Props> = ({ branding, data }) => {
  const { company, period, reps = [] } = data

  const totalRevenue = reps.reduce((sum, r) => sum + r.achieved, 0)
  const avgDealSize = reps.reduce((sum, r) => {
    const deals = r.deals ?? []
    return sum + deals.reduce((ds, d) => ds + d.value, 0)
  }, 0) / Math.max(reps.reduce((sum, r) => sum + (r.deals?.length ?? 0), 0), 1)

  const leaderboardEntries = reps
    .map(rep => ({
      rank: 0,
      name: rep.name,
      photo: rep.photo,
      value: rep.achieved,
      highlight: (rep.achieved / rep.quota) >= 1,
    }))
    .sort((a, b) => b.value - a.value)
    .map((e, i) => ({ ...e, rank: i + 1 }))

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || company?.logo} size={100} />
            <Title
              text="Sales Leaderboard"
              subtitle={period?.name || 'Q4 2024'}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quick Stats */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <StatCard
              label="Total Revenue"
              value={totalRevenue}
              format="currency"
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Avg Deal Size"
              value={avgDealSize}
              format="currency"
              delay={15}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Reps"
              value={reps.length}
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
            title="Revenue Rankings"
            valueLabel="closed"
            valueFormat="currency"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={company?.name || 'Company'}
            subtitle={period?.name || 'Q4 2024'}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
