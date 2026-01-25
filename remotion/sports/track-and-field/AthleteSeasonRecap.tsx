import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, TrackAndFieldData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<TrackAndFieldData> & {
    athlete?: TrackAndFieldData['athletes'][0]
  }
}

export const TrackAthleteSeasonRecap: React.FC<Props> = ({ branding, data }) => {
  const { athlete, season, organization } = data

  // Calculate stats
  const allResults = athlete?.events?.flatMap(e => e.results) ?? []
  const totalEvents = allResults.length
  const personalBests = allResults.filter(r => r.isPB).length
  const bestPlacement = Math.min(...allResults.map(r => r.place ?? 999).filter(p => p < 999)) || 0

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="mesh"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || organization?.logo} size={120} />
            <Title
              text={season?.name || '2024 Season'}
              subtitle="Athlete Season Recap"
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Athlete Profile */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <ProfilePhoto
              src={athlete?.photo}
              name={athlete?.name || 'Athlete'}
              size={180}
              borderColor={branding.accentColor}
            />
            <Title
              text={athlete?.name || 'Athlete Name'}
              subtitle={organization?.name}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Season Stats */}
      <Sequence from={240} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Season Highlights" delay={0} />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Events"
                value={totalEvents}
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
                label="Best Place"
                value={bestPlacement || 0}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Events Breakdown */}
      <Sequence from={420} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Event Performance" delay={0} />
          <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 24 }}>
            {athlete?.events?.slice(0, 4).map((event, i) => {
              const bestResult = Math.min(...event.results.map(r => r.result))
              const pbCount = event.results.filter(r => r.isPB).length

              return (
                <div
                  key={event.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 24,
                    padding: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    borderLeft: `4px solid ${branding.accentColor}`,
                  }}
                >
                  <span style={{
                    color: '#fff',
                    fontSize: 28,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                    width: 150
                  }}>
                    {event.name}
                  </span>
                  <div style={{ flex: 1, display: 'flex', gap: 40 }}>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Inter' }}>
                        BEST
                      </span>
                      <div>
                        <AnimatedNumber
                          value={bestResult}
                          format="time"
                          delay={i * 15 + 30}
                          fontSize={32}
                        />
                      </div>
                    </div>
                    <div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Inter' }}>
                        COMPETITIONS
                      </span>
                      <div>
                        <AnimatedNumber
                          value={event.results.length}
                          delay={i * 15 + 35}
                          fontSize={32}
                        />
                      </div>
                    </div>
                    {pbCount > 0 && (
                      <div style={{
                        backgroundColor: branding.accentColor,
                        padding: '8px 16px',
                        borderRadius: 8,
                        alignSelf: 'center'
                      }}>
                        <span style={{ color: '#fff', fontSize: 16, fontWeight: 700, fontFamily: 'Inter' }}>
                          {pbCount} PB{pbCount > 1 ? 's' : ''}!
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
              text="Great Season!"
              subtitle={`${athlete?.name || 'Athlete'} • ${season?.name || '2024'}`}
            />
            <Logo src={branding.logoUrl || organization?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
