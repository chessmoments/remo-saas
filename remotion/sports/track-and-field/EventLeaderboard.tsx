import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard } from '../../components'
import type { BaseCompositionProps, TrackAndFieldData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<TrackAndFieldData> & {
    eventName?: string
  }
}

export const TrackEventLeaderboard: React.FC<Props> = ({ branding, data }) => {
  const { athletes = [], season, organization, eventName = '100m' } = data

  // Find all athletes with this event and their best times
  const eventResults = athletes
    .filter(a => a.events?.some(e => e.name === eventName))
    .map(athlete => {
      const event = athlete.events?.find(e => e.name === eventName)
      const bestResult = Math.min(...(event?.results?.map(r => r.result) ?? [Infinity]))
      return {
        rank: 0,
        name: athlete.name,
        photo: athlete.photo,
        value: bestResult === Infinity ? 0 : bestResult,
      }
    })
    .filter(r => r.value > 0)
    .sort((a, b) => a.value - b.value) // Lower is better for time
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="dots"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={60}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || organization?.logo} size={100} />
            <Title
              text={eventName}
              subtitle={`${season?.name || '2024'} Leaderboard`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Leaderboard */}
      <Sequence from={60} durationInFrames={420}>
        <AbsoluteFill>
          <Leaderboard
            entries={eventResults}
            title={`${eventName} Rankings`}
            valueLabel="best time"
            valueFormat="time"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
            delay={0}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={480} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Title text={eventName} subtitle={organization?.name} />
            <Logo src={branding.logoUrl || organization?.logo} size={60} delay={10} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
