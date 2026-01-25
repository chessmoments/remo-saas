import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, SalesTeamData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SalesTeamData> & {
    rep?: SalesTeamData['reps'][0]
    celebrationType?: 'quota' | 'deal' | 'milestone'
  }
}

export const SalesCelebration: React.FC<Props> = ({ branding, data }) => {
  const { company, rep, celebrationType = 'quota' } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 50, mass: 1 },
  })

  const getCelebrationText = () => {
    switch (celebrationType) {
      case 'quota':
        return { title: 'QUOTA ACHIEVED!', emoji: '🎯' }
      case 'deal':
        return { title: 'BIG DEAL CLOSED!', emoji: '💰' }
      case 'milestone':
        return { title: 'MILESTONE REACHED!', emoji: '🏆' }
      default:
        return { title: 'CONGRATULATIONS!', emoji: '🎉' }
    }
  }

  const { title, emoji } = getCelebrationText()
  const attainment = rep ? (rep.achieved / rep.quota) * 100 : 0

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
        animated
      />

      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}>
            {/* Emoji celebration */}
            <div style={{
              fontSize: 100,
              transform: `scale(${scale})`,
            }}>
              {emoji}
            </div>

            <Title text={title} delay={15} />

            <ProfilePhoto
              src={rep?.photo}
              name={rep?.name || 'Rep'}
              size={140}
              borderColor={branding.accentColor}
              delay={30}
            />

            <span style={{
              color: '#fff',
              fontSize: 36,
              fontWeight: 700,
              fontFamily: 'Inter',
            }}>
              {rep?.name || 'Sales Rep'}
            </span>

            <span style={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: 20,
              fontFamily: 'Inter',
            }}>
              {rep?.title || 'Account Executive'}
            </span>

            {celebrationType === 'quota' && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
              }}>
                <div style={{
                  fontSize: 64,
                  fontWeight: 800,
                  fontFamily: 'Inter',
                  color: '#22C55E',
                }}>
                  <AnimatedNumber
                    value={attainment}
                    format="percent"
                    delay={60}
                    fontSize={64}
                    color="#22C55E"
                  />
                </div>
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 18,
                  fontFamily: 'Inter',
                }}>
                  Quota Attainment
                </span>
              </div>
            )}

            {celebrationType === 'deal' && rep?.deals?.[0] && (
              <div style={{
                backgroundColor: branding.accentColor,
                padding: '16px 32px',
                borderRadius: 16,
                marginTop: 16,
              }}>
                <span style={{
                  color: '#fff',
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}>
                  ${rep.deals[0].value.toLocaleString()}
                </span>
              </div>
            )}

            <Logo src={branding.logoUrl || company?.logo} size={60} delay={90} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
