import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, SwimmingData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SwimmingData> & {
    swimmer?: SwimmingData['swimmers'][0]
  }
}

export const SwimAthleteProgression: React.FC<Props> = ({ branding, data }) => {
  const { swimmer, season, team } = data

  const allTimes = swimmer?.events?.flatMap(e => e.times) ?? []
  const totalSwims = allTimes.length
  const personalBests = allTimes.filter(t => t.isPB).length

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="waves"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || team?.logo} size={120} />
            <Title
              text={season?.name || '2024 Season'}
              subtitle="Swimmer Progression"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Swimmer Profile */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <ProfilePhoto
              src={swimmer?.photo}
              name={swimmer?.name || 'Swimmer'}
              size={180}
              borderColor={branding.accentColor}
            />
            <Title
              text={swimmer?.name || 'Swimmer Name'}
              subtitle={`${swimmer?.ageGroup || ''} • ${team?.name || ''}`}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Season Stats */}
      <Sequence from={240} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Season Progress" delay={0} />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Total Swims"
                value={totalSwims}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Personal Bests"
                value={personalBests}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Events"
                value={swimmer?.events?.length ?? 0}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Event Breakdown */}
      <Sequence from={420} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Event Times" delay={0} />
          <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {swimmer?.events?.slice(0, 4).map((event, i) => {
              const bestTime = Math.min(...event.times.map(t => t.time))
              const improvement = event.times.length > 1
                ? event.times[0].time - bestTime
                : 0

              return (
                <div
                  key={`${event.stroke}-${event.distance}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    gap: 24,
                  }}
                >
                  <div style={{ width: 200 }}>
                    <span style={{ color: '#fff', fontSize: 22, fontWeight: 600, fontFamily: 'Inter' }}>
                      {event.distance}m {event.stroke}
                    </span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: 40 }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Inter' }}>
                        BEST TIME
                      </span>
                      <div>
                        <AnimatedNumber
                          value={bestTime}
                          format="time"
                          delay={i * 15 + 30}
                          fontSize={28}
                        />
                      </div>
                    </div>
                    {improvement > 0 && (
                      <div style={{
                        backgroundColor: '#22C55E',
                        padding: '8px 16px',
                        borderRadius: 8,
                        alignSelf: 'center',
                      }}>
                        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter' }}>
                          -{improvement.toFixed(2)}s
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text="Keep Swimming!"
              subtitle={`${swimmer?.name || 'Swimmer'} • ${season?.name || '2024'}`}
            />
            <Logo src={branding.logoUrl || team?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
