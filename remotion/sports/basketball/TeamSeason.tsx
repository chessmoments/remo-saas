import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, StatCard, Leaderboard } from '../../components'
import type { BaseCompositionProps, BasketballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BasketballData>
}

export const BasketballTeamSeason: React.FC<Props> = ({ branding, data }) => {
  const { players = [], games = [], season, team } = data

  const wins = games.filter(g => g.score.us > g.score.them).length
  const losses = games.filter(g => g.score.us < g.score.them).length
  const totalPoints = games.reduce((sum, g) => sum + g.score.us, 0)
  const avgPoints = games.length > 0 ? totalPoints / games.length : 0

  const scoringLeaders = players
    .map(p => ({
      rank: 0,
      name: p.name,
      photo: p.photo,
      value: p.stats?.ppg ?? 0,
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
            <Logo src={branding.logoUrl || team?.logo} size={140} />
            <Title
              text={team?.name || 'Team'}
              subtitle={`${season?.year || '2024'} Season`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Team Record */}
      <Sequence from={90} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <div style={{
              fontSize: 96,
              fontWeight: 800,
              fontFamily: 'Inter',
              color: '#fff',
            }}>
              {wins} - {losses}
            </div>
            <div style={{ display: 'flex', gap: 40 }}>
              <StatCard
                label="Avg Points"
                value={avgPoints}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Total Points"
                value={totalPoints}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Games"
                value={games.length}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Scoring Leaders */}
      <Sequence from={270} durationInFrames={450}>
        <AbsoluteFill>
          <Leaderboard
            entries={scoringLeaders}
            title="Scoring Leaders"
            valueLabel="PPG"
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
