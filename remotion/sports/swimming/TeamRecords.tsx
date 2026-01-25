import { AbsoluteFill, Sequence, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { Background, Logo, Title, ProfilePhoto } from '../../components'
import type { BaseCompositionProps, SwimmingData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SwimmingData>
}

export const SwimTeamRecords: React.FC<Props> = ({ branding, data }) => {
  const { swimmers = [], season, team } = data
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Calculate team records per event
  const eventRecords = swimmers
    .flatMap(swimmer =>
      swimmer.events?.map(event => ({
        event: `${event.distance}m ${event.stroke}`,
        swimmerName: swimmer.name,
        swimmerPhoto: swimmer.photo,
        bestTime: Math.min(...event.times.map(t => t.time)),
      })) ?? []
    )
    .reduce((acc, curr) => {
      const existing = acc.find(r => r.event === curr.event)
      if (!existing || curr.bestTime < existing.bestTime) {
        return [...acc.filter(r => r.event !== curr.event), curr]
      }
      return acc
    }, [] as { event: string; swimmerName: string; swimmerPhoto?: string; bestTime: number }[])
    .sort((a, b) => a.event.localeCompare(b.event))

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
              text="Team Records"
              subtitle={`${team?.name || 'Team'} • ${season?.name || '2024'}`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Records Board */}
      <Sequence from={90} durationInFrames={420}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Record Board" delay={0} />
          <div style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 20,
          }}>
            {eventRecords.slice(0, 8).map((record, i) => {
              const delay = i * 10
              const scale = spring({
                frame: frame - 90 - delay,
                fps,
                config: { damping: 15, stiffness: 100, mass: 0.5 },
              })
              const opacity = interpolate(frame - 90 - delay, [0, 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })

              return (
                <div
                  key={record.event}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    border: `2px solid ${branding.accentColor}`,
                    gap: 16,
                    transform: `scale(${scale})`,
                    opacity,
                  }}
                >
                  <ProfilePhoto
                    src={record.swimmerPhoto}
                    name={record.swimmerName}
                    size={60}
                    borderColor={branding.accentColor}
                    borderWidth={2}
                    delay={delay}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: branding.accentColor, fontSize: 14, fontWeight: 600, fontFamily: 'Inter' }}>
                      {record.event}
                    </div>
                    <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, fontFamily: 'Inter' }}>
                      {record.swimmerName}
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: branding.accentColor,
                    padding: '8px 16px',
                    borderRadius: 8,
                  }}>
                    <span style={{ color: '#fff', fontSize: 20, fontWeight: 700, fontFamily: 'Inter' }}>
                      {Math.floor(record.bestTime / 60)}:{(record.bestTime % 60).toFixed(2).padStart(5, '0')}
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
          <Title
            text={team?.name || 'Team'}
            subtitle="Record Holders"
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
