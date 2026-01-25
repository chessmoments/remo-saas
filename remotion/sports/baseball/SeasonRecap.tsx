import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, StatCard, Leaderboard } from '../../components'
import type { BaseCompositionProps, BaseballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BaseballData>
}

export const BaseballSeasonRecap: React.FC<Props> = ({ branding, data }) => {
  const { players = [], games = [], season, team } = data

  const wins = games.filter(g => g.score.us > g.score.them).length
  const losses = games.filter(g => g.score.us < g.score.them).length
  const totalHRs = players.reduce((sum, p) => sum + (p.battingStats?.homeRuns ?? 0), 0)
  const totalRBIs = players.reduce((sum, p) => sum + (p.battingStats?.rbis ?? 0), 0)

  const hrLeaders = players
    .map(p => ({
      rank: 0,
      name: p.name,
      photo: p.photo,
      value: p.battingStats?.homeRuns ?? 0,
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
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || team?.logo} size={140} />
            <Title
              text={team?.name || 'Team'}
              subtitle={`${season?.year || '2024'} Season Recap`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Season Record */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <Title text="Season Record" />
            <div style={{ display: 'flex', gap: 40 }}>
              <StatCard
                label="Wins"
                value={wins}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Losses"
                value={losses}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Home Runs"
                value={totalHRs}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="RBIs"
                value={totalRBIs}
                delay={45}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* HR Leaders */}
      <Sequence from={270} durationInFrames={450}>
        <AbsoluteFill>
          <Leaderboard
            entries={hrLeaders}
            title="Home Run Leaders"
            valueLabel="HRs"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={`${wins}-${losses}`}
            subtitle={`${team?.name || 'Team'} • ${season?.year || '2024'}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
