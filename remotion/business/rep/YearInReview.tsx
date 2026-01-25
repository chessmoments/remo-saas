import { AbsoluteFill, Sequence, useCurrentFrame, interpolate } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, AnimatedNumber } from '../../components'
import type { BaseCompositionProps, RepOverviewData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RepOverviewData>
}

export const RepYearInReview: React.FC<Props> = ({ branding, data }) => {
  const { company, period, rep } = data
  const frame = useCurrentFrame()

  const attainment = rep ? (rep.achieved / rep.quota) * 100 : 0

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
            <Logo src={branding.logoUrl || company?.logo} size={100} />
            <Title
              text="Year in Review"
              subtitle={period ? `${period.start} - ${period.end}` : '2024'}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Rep Profile */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <ProfilePhoto
              src={rep?.photo}
              name={rep?.name || 'Rep'}
              size={160}
              borderColor={branding.accentColor}
            />
            <Title
              text={rep?.name || 'Sales Rep'}
              subtitle={rep?.title}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Revenue Stats */}
      <Sequence from={210} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Revenue Performance" />
            <div style={{ display: 'flex', gap: 40 }}>
              <StatCard
                label="Total Revenue"
                value={rep?.achieved ?? 0}
                format="currency"
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Quota"
                value={rep?.quota ?? 0}
                format="currency"
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Attainment"
                value={attainment}
                format="percent"
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Activity Stats */}
      <Sequence from={390} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
            <Title text="Activity Summary" />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Meetings"
                value={rep?.meetings ?? 0}
                delay={0}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Calls"
                value={rep?.calls ?? 0}
                delay={10}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Emails"
                value={rep?.emails ?? 0}
                delay={20}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Top Deals */}
      <Sequence from={540} durationInFrames={180}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Top Deals" delay={0} />
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {rep?.topDeals?.slice(0, 5).map((deal, i) => {
              const opacity = interpolate(frame - 540 - i * 10, [0, 15], [0, 1], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              })

              return (
                <div
                  key={deal.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: 20,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 12,
                    gap: 20,
                    opacity,
                  }}
                >
                  <div style={{
                    backgroundColor: branding.accentColor,
                    padding: '8px 16px',
                    borderRadius: 8,
                  }}>
                    <span style={{ color: '#fff', fontSize: 14, fontWeight: 700, fontFamily: 'Inter' }}>
                      #{i + 1}
                    </span>
                  </div>
                  <span style={{ color: '#fff', fontSize: 20, fontWeight: 600, fontFamily: 'Inter', flex: 1 }}>
                    {deal.name}
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, fontFamily: 'Inter' }}>
                    {deal.closedDate}
                  </span>
                  <span style={{ color: '#22C55E', fontSize: 24, fontWeight: 700, fontFamily: 'Inter' }}>
                    ${deal.value.toLocaleString()}
                  </span>
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
              text={attainment >= 100 ? 'Incredible Year!' : 'Great Progress!'}
              subtitle={`${rep?.name || 'Rep'} • ${period?.end?.split('-')[0] || '2024'}`}
            />
            <Logo src={branding.logoUrl || company?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
