import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, ProfilePhoto } from '../../components'
import type { BaseCompositionProps, GymMembershipData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<GymMembershipData> & {
    member?: GymMembershipData['members'][0]
    milestone?: {
      name: string
      description: string
      value?: number
    }
  }
}

export const GymMilestoneCelebration: React.FC<Props> = ({ branding, data }) => {
  const { member, gym, milestone } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
        animated
      />

      {/* Celebration */}
      <Sequence from={0} durationInFrames={300}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          {(() => {
            const scale = spring({
              frame,
              fps,
              config: { damping: 8, stiffness: 50, mass: 1 },
            })
            const rotate = interpolate(frame, [0, 60], [0, 360], {
              extrapolateRight: 'clamp',
            })
            const opacity = interpolate(frame, [0, 30], [0, 1], {
              extrapolateRight: 'clamp',
            })

            return (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 32,
                opacity,
              }}>
                {/* Trophy animation */}
                <div style={{
                  fontSize: 120,
                  transform: `scale(${scale})`,
                }}>
                  🏆
                </div>

                <Title
                  text="MILESTONE ACHIEVED!"
                  delay={30}
                />

                <ProfilePhoto
                  src={member?.photo}
                  name={member?.name || 'Member'}
                  size={120}
                  borderColor={branding.accentColor}
                  delay={45}
                />

                <span style={{
                  color: '#fff',
                  fontSize: 32,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}>
                  {member?.name || 'Member'}
                </span>

                <div style={{
                  backgroundColor: branding.accentColor,
                  padding: '16px 40px',
                  borderRadius: 16,
                  marginTop: 16,
                }}>
                  <span style={{
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                  }}>
                    {milestone?.name || 'Achievement Unlocked'}
                  </span>
                </div>

                {milestone?.description && (
                  <span style={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: 20,
                    fontFamily: 'Inter',
                    textAlign: 'center',
                    maxWidth: 600,
                  }}>
                    {milestone.description}
                  </span>
                )}

                {milestone?.value && (
                  <div style={{
                    fontSize: 64,
                    fontWeight: 800,
                    fontFamily: 'Inter',
                    color: branding.accentColor,
                    marginTop: 16,
                  }}>
                    {milestone.value}
                  </div>
                )}

                <Logo src={branding.logoUrl || gym?.logo} size={60} delay={90} />
              </div>
            )
          })()}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
