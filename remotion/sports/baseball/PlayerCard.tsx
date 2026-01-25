import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard } from '../../components'
import type { BaseCompositionProps, BaseballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BaseballData> & {
    player?: BaseballData['players'][0]
  }
}

export const BaseballPlayerCard: React.FC<Props> = ({ branding, data }) => {
  const { player, season, team } = data
  const stats = player?.battingStats

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="gradient"
      />

      {/* Player Intro */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <ProfilePhoto
              src={player?.photo}
              name={player?.name || 'Player'}
              size={250}
              borderColor={branding.accentColor}
              borderWidth={6}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <Title
                text={player?.name || 'Player Name'}
                subtitle={player?.position}
                align="left"
                delay={15}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <Logo src={branding.logoUrl || team?.logo} size={50} delay={25} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 20, fontFamily: 'Inter' }}>
                  {team?.name} • {season?.year}
                </span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Batting Stats */}
      <Sequence from={120} durationInFrames={240}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <Title text="Batting Statistics" />
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
              <StatCard
                label="AVG"
                value={(stats?.avg ?? 0) * 1000}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Hits"
                value={stats?.hits ?? 0}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Home Runs"
                value={stats?.homeRuns ?? 0}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="RBIs"
                value={stats?.rbis ?? 0}
                delay={45}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="OPS"
                value={(stats?.ops ?? 0) * 1000}
                delay={55}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={360} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={player?.name || 'Player'}
            subtitle={`${team?.name || 'Team'} • ${season?.year || '2024'}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
