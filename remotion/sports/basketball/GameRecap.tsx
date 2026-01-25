import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, BasketballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BasketballData> & {
    game?: BasketballData['games'][0]
    topScorers?: Array<{ name: string; points: number }>
  }
}

export const BasketballGameRecap: React.FC<Props> = ({ branding, data }) => {
  const { game, team, topScorers = [] } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const isWin = (game?.score.us ?? 0) > (game?.score.them ?? 0)

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
      />

      {/* Game Intro */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={game?.isHome ? 'Home Game' : 'Away Game'}
            subtitle={game?.date}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Scoreboard */}
      <Sequence from={60} durationInFrames={240}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <Logo src={branding.logoUrl} size={100} />
              <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                {team?.name || 'Team'}
              </span>
              <div style={{
                fontSize: 80,
                fontWeight: 800,
                fontFamily: 'Inter',
                color: isWin ? '#22C55E' : '#fff',
              }}>
                <AnimatedNumber value={game?.score.us ?? 0} delay={30} fontSize={80} />
              </div>
            </div>

            <div style={{
              fontSize: 36,
              fontWeight: 700,
              fontFamily: 'Inter',
              color: 'rgba(255,255,255,0.5)',
              padding: '0 20px',
            }}>
              FINAL
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 40, fontFamily: 'Inter' }}>VS</span>
              </div>
              <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                {game?.opponent || 'Opponent'}
              </span>
              <div style={{
                fontSize: 80,
                fontWeight: 800,
                fontFamily: 'Inter',
                color: !isWin ? '#EF4444' : '#fff',
              }}>
                <AnimatedNumber value={game?.score.them ?? 0} delay={45} fontSize={80} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Top Scorers */}
      <Sequence from={300} durationInFrames={210}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Top Scorers" delay={0} />
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {topScorers.slice(0, 5).map((scorer, i) => {
              const delay = i * 10
              const scale = spring({
                frame: frame - 300 - delay,
                fps,
                config: { damping: 15, stiffness: 100 },
              })
              const opacity = interpolate(frame - 300 - delay, [0, 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })

              return (
                <div
                  key={scorer.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    gap: 20,
                    transform: `scale(${scale})`,
                    opacity,
                  }}
                >
                  <span style={{ color: '#fff', fontSize: 22, fontWeight: 600, fontFamily: 'Inter', flex: 1 }}>
                    {scorer.name}
                  </span>
                  <div style={{
                    backgroundColor: branding.accentColor,
                    padding: '8px 20px',
                    borderRadius: 8,
                  }}>
                    <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                      {scorer.points} PTS
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            fontSize: 64,
            fontWeight: 800,
            fontFamily: 'Inter',
            color: isWin ? '#22C55E' : '#EF4444',
          }}>
            {isWin ? 'VICTORY!' : 'DEFEAT'}
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
