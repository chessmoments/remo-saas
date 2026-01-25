import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, ProgressBar } from '../../components'
import type { BaseCompositionProps, RunningClubData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RunningClubData> & {
    member?: RunningClubData['members'][0]
  }
}

export const RunningMemberYearReview: React.FC<Props> = ({ branding, data }) => {
  const { member, club, period } = data

  const totalRaces = member?.races?.length ?? 0
  const bestPace = Math.min(...(member?.races?.map(r => r.pace) ?? [Infinity]))
  const longestRace = Math.max(...(member?.races?.map(r => r.distance) ?? [0]))

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
            <Logo src={branding.logoUrl || club?.logo} size={120} />
            <Title
              text="Year in Running"
              subtitle={period ? `${period.start} - ${period.end}` : '2024'}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Member Profile */}
      <Sequence from={90} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <ProfilePhoto
              src={member?.photo}
              name={member?.name || 'Runner'}
              size={180}
              borderColor={branding.accentColor}
            />
            <Title
              text={member?.name || 'Runner Name'}
              subtitle={club?.name}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Distance Stats */}
      <Sequence from={240} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Your Running Year" delay={0} />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Total Distance"
                value={member?.totalDistance ?? 0}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Total Runs"
                value={member?.totalRuns ?? 0}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Races"
                value={totalRaces}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, fontFamily: 'Inter' }}>
                That's like running around the world
              </span>
              <ProgressBar
                progress={(member?.totalDistance ?? 0) / 40075 * 100}
                delay={50}
                color={branding.accentColor}
                width={500}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Race Highlights */}
      <Sequence from={450} durationInFrames={270}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Race Highlights" delay={0} />
          <div style={{ marginTop: 80, display: 'flex', flexDirection: 'column', gap: 20 }}>
            {member?.races?.slice(0, 5).map((race, i) => (
              <div
                key={race.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  gap: 24,
                }}
              >
                <div style={{
                  backgroundColor: branding.accentColor,
                  borderRadius: 8,
                  padding: '8px 16px',
                }}>
                  <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Inter' }}>
                    {race.distance}km
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ color: '#fff', fontSize: 22, fontWeight: 600, fontFamily: 'Inter' }}>
                    {race.name}
                  </span>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, fontFamily: 'Inter' }}>
                    {race.date}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: '#fff', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                    {Math.floor(race.time / 3600)}:{String(Math.floor((race.time % 3600) / 60)).padStart(2, '0')}:{String(race.time % 60).padStart(2, '0')}
                  </span>
                  <div style={{ color: branding.accentColor, fontSize: 14, fontFamily: 'Inter' }}>
                    {race.pace.toFixed(2)} min/km
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={720} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text="Keep Running!"
              subtitle={`${member?.totalDistance ?? 0}km and counting`}
            />
            <Logo src={branding.logoUrl || club?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
