import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, StatCard, ProgressBar, Leaderboard } from '../../components'
import type { BaseCompositionProps, SalesTeamData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SalesTeamData>
}

export const SalesTeamQuarter: React.FC<Props> = ({ branding, data }) => {
  const { company, period, team, reps = [] } = data

  const quotaAttainment = team ? (team.achieved / team.quota) * 100 : 0
  const totalDeals = reps.reduce((sum, r) => sum + (r.deals?.length ?? 0), 0)

  const repLeaderboard = reps
    .map(rep => ({
      rank: 0,
      name: rep.name,
      photo: rep.photo,
      value: rep.achieved,
    }))
    .sort((a, b) => b.value - a.value)
    .map((e, i) => ({ ...e, rank: i + 1 }))

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
            <Logo src={branding.logoUrl || company?.logo} size={120} />
            <Title
              text={period?.name || 'Q4 2024'}
              subtitle={`${team?.name || 'Sales Team'} Performance`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quota Progress */}
      <Sequence from={90} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Team Quota Attainment" />
            <div style={{
              fontSize: 96,
              fontWeight: 800,
              fontFamily: 'Inter',
              color: quotaAttainment >= 100 ? '#22C55E' : branding.accentColor,
            }}>
              {quotaAttainment.toFixed(0)}%
            </div>
            <ProgressBar
              progress={Math.min(quotaAttainment, 100)}
              delay={30}
              color={quotaAttainment >= 100 ? '#22C55E' : branding.accentColor}
              width={700}
              height={24}
              showLabel={false}
            />
            <div style={{ display: 'flex', gap: 40, marginTop: 20 }}>
              <StatCard
                label="Achieved"
                value={team?.achieved ?? 0}
                format="currency"
                delay={45}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Quota"
                value={team?.quota ?? 0}
                format="currency"
                delay={55}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Deals Closed"
                value={totalDeals}
                delay={65}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Rep Leaderboard */}
      <Sequence from={300} durationInFrames={420}>
        <AbsoluteFill>
          <Leaderboard
            entries={repLeaderboard}
            title="Top Performers"
            valueLabel="revenue"
            valueFormat="currency"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text={quotaAttainment >= 100 ? 'Quota Crushed!' : 'Keep Pushing!'}
              subtitle={`${team?.name || 'Team'} • ${period?.name || 'Q4 2024'}`}
            />
            <Logo src={branding.logoUrl || company?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
