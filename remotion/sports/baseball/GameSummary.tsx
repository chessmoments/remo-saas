import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, BaseballData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<BaseballData> & {
    game?: BaseballData['games'][0]
  }
}

export const BaseballGameSummary: React.FC<Props> = ({ branding, data }) => {
  const { game, team } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const isWin = (game?.score.us ?? 0) > (game?.score.them ?? 0)

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="gradient"
      />

      {/* Game Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl} size={100} />
            <Title
              text={game?.isHome ? 'Home Game' : 'Away Game'}
              subtitle={game?.date}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Matchup */}
      <Sequence from={90} durationInFrames={240}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 80 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <Logo src={branding.logoUrl} size={120} />
              <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, fontFamily: 'Inter' }}>
                {team?.name || 'Team'}
              </span>
              <div style={{
                fontSize: 72,
                fontWeight: 800,
                fontFamily: 'Inter',
                color: isWin ? '#22C55E' : '#fff',
              }}>
                <AnimatedNumber value={game?.score.us ?? 0} delay={30} fontSize={72} />
              </div>
            </div>

            <div style={{
              fontSize: 48,
              fontWeight: 700,
              fontFamily: 'Inter',
              color: 'rgba(255,255,255,0.5)',
            }}>
              VS
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 48, fontFamily: 'Inter' }}>?</span>
              </div>
              <span style={{ color: '#fff', fontSize: 28, fontWeight: 700, fontFamily: 'Inter' }}>
                {game?.opponent || 'Opponent'}
              </span>
              <div style={{
                fontSize: 72,
                fontWeight: 800,
                fontFamily: 'Inter',
                color: !isWin ? '#EF4444' : '#fff',
              }}>
                <AnimatedNumber value={game?.score.them ?? 0} delay={45} fontSize={72} />
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Result */}
      <Sequence from={330} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {(() => {
            const scale = spring({
              frame: frame - 330,
              fps,
              config: { damping: 10, stiffness: 80, mass: 0.8 },
            })
            const opacity = interpolate(frame - 330, [0, 20], [0, 1], {
              extrapolateRight: 'clamp',
            })

            return (
              <div style={{
                transform: `scale(${scale})`,
                opacity,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
              }}>
                <div style={{
                  fontSize: 96,
                  fontWeight: 800,
                  fontFamily: 'Inter',
                  color: isWin ? '#22C55E' : '#EF4444',
                }}>
                  {isWin ? 'WIN!' : 'LOSS'}
                </div>
                <div style={{
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                  color: '#fff',
                }}>
                  {game?.score.us} - {game?.score.them}
                </div>
              </div>
            )
          })()}
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text={team?.name || 'Team'}
            subtitle={`vs ${game?.opponent || 'Opponent'} • ${game?.date || ''}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
