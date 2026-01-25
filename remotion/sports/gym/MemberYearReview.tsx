import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, ProgressBar } from '../../components'
import type { BaseCompositionProps, GymMembershipData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<GymMembershipData> & {
    member?: GymMembershipData['members'][0]
  }
}

export const GymMemberYearReview: React.FC<Props> = ({ branding, data }) => {
  const { member, gym, period } = data

  const totalVisits = member?.visits?.length ?? 0
  const totalMinutes = member?.visits?.reduce((sum, v) => sum + v.duration, 0) ?? 0
  const totalHours = Math.round(totalMinutes / 60)
  const achievements = member?.achievements?.length ?? 0

  // Calculate consistency (visits per week)
  const weeks = period ? Math.ceil((new Date(period.end).getTime() - new Date(period.start).getTime()) / (7 * 24 * 60 * 60 * 1000)) : 52
  const visitsPerWeek = weeks > 0 ? (totalVisits / weeks).toFixed(1) : '0'

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
            <Logo src={branding.logoUrl || gym?.logo} size={120} />
            <Title
              text="Your Year at the Gym"
              subtitle={period ? `${period.start} - ${period.end}` : '2024'}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Member Profile */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <ProfilePhoto
              src={member?.photo}
              name={member?.name || 'Member'}
              size={180}
              borderColor={branding.accentColor}
            />
            <Title
              text={member?.name || 'Member'}
              subtitle={`Member since ${member?.memberSince || '2024'}`}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Stats Overview */}
      <Sequence from={210} durationInFrames={210}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <Title text="Your Dedication" />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Total Visits"
                value={totalVisits}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Hours Trained"
                value={totalHours}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Per Week"
                value={parseFloat(visitsPerWeek)}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Consistency Meter */}
      <Sequence from={420} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <Title text="Consistency Score" />
            <div style={{ width: 600 }}>
              <ProgressBar
                progress={Math.min((parseFloat(visitsPerWeek) / 5) * 100, 100)}
                delay={15}
                color={branding.accentColor}
                width={600}
                height={30}
              />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, fontFamily: 'Inter' }}>
              {parseFloat(visitsPerWeek) >= 3 ? 'Excellent consistency!' : parseFloat(visitsPerWeek) >= 2 ? 'Good progress!' : 'Keep pushing!'}
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Achievements */}
      <Sequence from={570} durationInFrames={150}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Achievements Unlocked" delay={0} />
          <div style={{ marginTop: 60, display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            {member?.achievements?.slice(0, 6).map((achievement, i) => (
              <div
                key={achievement.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 20,
                  backgroundColor: `${branding.accentColor}33`,
                  borderRadius: 16,
                  border: `2px solid ${branding.accentColor}`,
                  width: 200,
                  gap: 8,
                }}
              >
                <span style={{ fontSize: 36 }}>🏆</span>
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 600, fontFamily: 'Inter', textAlign: 'center' }}>
                  {achievement.name}
                </span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontFamily: 'Inter' }}>
                  {achievement.date}
                </span>
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
              text="Keep Going!"
              subtitle={`${totalVisits} visits and counting`}
            />
            <Logo src={branding.logoUrl || gym?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
