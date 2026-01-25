import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, Leaderboard, StatCard } from '../../components'
import type { BaseCompositionProps, RunningClubData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RunningClubData> & {
    raceName?: string
    raceDate?: string
    raceDistance?: number
  }
}

export const RunningRaceRecap: React.FC<Props> = ({ branding, data }) => {
  const { members = [], club, raceName = 'Race', raceDate, raceDistance } = data

  // Get all members who ran this race
  const raceParticipants = members
    .filter(m => m.races?.some(r => r.name === raceName))
    .map(member => {
      const race = member.races?.find(r => r.name === raceName)
      return {
        rank: 0,
        name: member.name,
        photo: member.photo,
        value: race?.time ?? Infinity,
      }
    })
    .filter(p => p.value < Infinity)
    .sort((a, b) => a.value - b.value)
    .map((entry, i) => ({ ...entry, rank: i + 1 }))

  const totalParticipants = raceParticipants.length
  const fastestTime = raceParticipants[0]?.value ?? 0

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="dots"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || club?.logo} size={100} />
            <Title
              text={raceName}
              subtitle={raceDate || 'Race Day Recap'}
            />
            {raceDistance && (
              <div style={{
                backgroundColor: branding.accentColor,
                padding: '12px 24px',
                borderRadius: 30,
                marginTop: 16,
              }}>
                <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                  {raceDistance}km
                </span>
              </div>
            )}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Race Stats */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 40 }}>
            <StatCard
              label="Club Runners"
              value={totalParticipants}
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Fastest Time"
              value={fastestTime}
              format="time"
              delay={15}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Results */}
      <Sequence from={210} durationInFrames={300}>
        <AbsoluteFill>
          <Leaderboard
            entries={raceParticipants}
            title="Club Results"
            valueLabel="finish time"
            valueFormat="time"
            primaryColor={branding.primaryColor}
            accentColor={branding.accentColor}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={510} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Title
            text="Great Race!"
            subtitle={`${club?.name || 'Club'} at ${raceName}`}
          />
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
