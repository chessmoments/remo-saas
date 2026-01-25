import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, ProgressBar } from '../../components'
import type { BaseCompositionProps, BasketballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BasketballData> & {
    player?: BasketballData['players'][0]
  }
}

export const BasketballPlayerHighlights: React.FC<Props> = ({ branding, data }) => {
  const { player, season, team } = data
  const stats = player?.stats

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
      />

      {/* Player Intro */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <ProfilePhoto
              src={player?.photo}
              name={player?.name || 'Player'}
              size={220}
              borderColor={branding.accentColor}
              borderWidth={6}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{
                backgroundColor: branding.accentColor,
                padding: '8px 20px',
                borderRadius: 8,
                width: 'fit-content',
              }}>
                <span style={{ color: '#fff', fontSize: 32, fontWeight: 800, fontFamily: 'Inter' }}>
                  #{player?.number}
                </span>
              </div>
              <Title
                text={player?.name || 'Player Name'}
                subtitle={`${player?.position} • ${team?.name}`}
                align="left"
                delay={15}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Per Game Stats */}
      <Sequence from={120} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Per Game Averages" />
            <div style={{ display: 'flex', gap: 24 }}>
              <StatCard
                label="PPG"
                value={stats?.ppg ?? 0}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="RPG"
                value={stats?.rpg ?? 0}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="APG"
                value={stats?.apg ?? 0}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Games"
                value={stats?.gamesPlayed ?? 0}
                delay={45}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Shooting Stats */}
      <Sequence from={330} durationInFrames={210}>
        <AbsoluteFill style={{ padding: 80 }}>
          <Title text="Shooting Percentages" delay={0} />
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#fff', fontSize: 20, fontFamily: 'Inter' }}>Field Goal %</span>
                <span style={{ color: branding.accentColor, fontSize: 20, fontWeight: 700, fontFamily: 'Inter' }}>
                  {((stats?.fgPct ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                progress={(stats?.fgPct ?? 0) * 100}
                delay={15}
                color={branding.accentColor}
                width={800}
                showLabel={false}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#fff', fontSize: 20, fontFamily: 'Inter' }}>3-Point %</span>
                <span style={{ color: branding.accentColor, fontSize: 20, fontWeight: 700, fontFamily: 'Inter' }}>
                  {((stats?.threePct ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                progress={(stats?.threePct ?? 0) * 100}
                delay={25}
                color={branding.primaryColor}
                width={800}
                showLabel={false}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ color: '#fff', fontSize: 20, fontFamily: 'Inter' }}>Free Throw %</span>
                <span style={{ color: branding.accentColor, fontSize: 20, fontWeight: 700, fontFamily: 'Inter' }}>
                  {((stats?.ftPct ?? 0) * 100).toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                progress={(stats?.ftPct ?? 0) * 100}
                delay={35}
                color="#22C55E"
                width={800}
                showLabel={false}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Defense Stats */}
      <Sequence from={540} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Defense" />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Steals"
                value={stats?.spg ?? 0}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Blocks"
                value={stats?.bpg ?? 0}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={`#${player?.number} ${player?.name || 'Player'}`}
            subtitle={`${team?.name || 'Team'} • ${season?.year || '2024'}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
