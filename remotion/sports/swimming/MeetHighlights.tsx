import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard, StatCard } from '../../components'
import type { BaseCompositionProps, SwimmingData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<SwimmingData> & {
    meetName?: string
  }
}

export const SwimMeetHighlights: React.FC<Props> = ({ branding, data }) => {
  const { swimmers = [], season, team, meetName = 'Swim Meet' } = data

  // Find results from this meet
  const meetResults = swimmers
    .flatMap(swimmer =>
      swimmer.events?.flatMap(event =>
        event.times
          .filter(t => t.meetName === meetName)
          .map(time => ({
            swimmer: swimmer.name,
            photo: swimmer.photo,
            event: `${event.distance}m ${event.stroke}`,
            time: time.time,
            isPB: time.isPB,
          }))
      ) ?? []
    )
    .sort((a, b) => a.time - b.time)

  const totalSwimmers = new Set(meetResults.map(r => r.swimmer)).size
  const totalPBs = meetResults.filter(r => r.isPB).length

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
            <Logo src={branding.logoUrl || team?.logo} size={120} />
            <Title
              text={meetName}
              subtitle={team?.name || 'Team Results'}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Meet Stats */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <StatCard
              label="Swimmers"
              value={totalSwimmers}
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Swims"
              value={meetResults.length}
              delay={15}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Personal Bests"
              value={totalPBs}
              delay={30}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Results List */}
      <Sequence from={210} durationInFrames={300}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Top Performances" delay={0} />
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {meetResults.slice(0, 8).map((result, i) => (
              <div
                key={`${result.swimmer}-${result.event}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 16,
                  backgroundColor: result.isPB ? `${branding.accentColor}33` : 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  border: result.isPB ? `2px solid ${branding.accentColor}` : 'none',
                  gap: 20,
                }}
              >
                <span style={{ color: '#fff', fontSize: 20, fontWeight: 600, fontFamily: 'Inter', width: 180 }}>
                  {result.swimmer}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, fontFamily: 'Inter', flex: 1 }}>
                  {result.event}
                </span>
                <span style={{ color: '#fff', fontSize: 22, fontWeight: 700, fontFamily: 'Inter' }}>
                  {Math.floor(result.time / 60)}:{(result.time % 60).toFixed(2).padStart(5, '0')}
                </span>
                {result.isPB && (
                  <span style={{
                    backgroundColor: branding.accentColor,
                    padding: '4px 12px',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                  }}>
                    PB!
                  </span>
                )}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text="Great Meet!"
            subtitle={`${team?.name || 'Team'} • ${meetName}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
