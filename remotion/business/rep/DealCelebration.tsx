import { AbsoluteFill, Sequence, useCurrentFrame, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, RepOverviewData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RepOverviewData> & {
    deal?: {
      name: string
      value: number
      closedDate: string
    }
  }
}

export const RepDealCelebration: React.FC<Props> = ({ branding, data }) => {
  const { company, rep, deal } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 50, mass: 1 },
  })

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
            {/* Money emoji celebration */}
            <div style={{
              fontSize: 100,
              transform: `scale(${scale})`,
            }}>
              💰
            </div>

            <Title text="DEAL CLOSED!" delay={15} />

            <div style={{
              backgroundColor: '#22C55E',
              padding: '20px 48px',
              borderRadius: 20,
              marginTop: 16,
            }}>
              <AnimatedNumber
                value={deal?.value ?? 0}
                format="currency"
                delay={30}
                fontSize={64}
                fontWeight={800}
                color="#ffffff"
              />
            </div>

            <span style={{
              color: '#fff',
              fontSize: 28,
              fontWeight: 600,
              fontFamily: 'Inter',
              marginTop: 16,
            }}>
              {deal?.name || 'New Deal'}
            </span>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginTop: 24,
            }}>
              <ProfilePhoto
                src={rep?.photo}
                name={rep?.name || 'Rep'}
                size={80}
                borderColor={branding.accentColor}
                delay={45}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <span style={{
                  color: '#fff',
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}>
                  {rep?.name || 'Sales Rep'}
                </span>
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: 16,
                  fontFamily: 'Inter',
                }}>
                  {rep?.title || 'Account Executive'}
                </span>
              </div>
            </div>

            {deal?.closedDate && (
              <span style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 16,
                fontFamily: 'Inter',
                marginTop: 16,
              }}>
                Closed: {deal.closedDate}
              </span>
            )}

            <Logo src={branding.logoUrl || company?.logo} size={60} delay={90} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
