import { AbsoluteFill, Sequence } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard, ProgressBar } from '../../components'
import type { BaseCompositionProps, RepOverviewData } from '../../types'

interface Props extends BaseCompositionProps {
  data: Partial<RepOverviewData>
}

export const RepPerformanceCard: React.FC<Props> = ({ branding, data }) => {
  const { company, period, rep } = data

  const attainment = rep ? (rep.achieved / rep.quota) * 100 : 0

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="gradient"
      />

      {/* Rep Profile */}
      <Sequence from={0} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            <ProfilePhoto
              src={rep?.photo}
              name={rep?.name || 'Rep'}
              size={200}
              borderColor={branding.accentColor}
              borderWidth={6}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Title
                text={rep?.name || 'Sales Rep'}
                subtitle={rep?.title}
                align="left"
                delay={15}
              />
              {rep?.territory && (
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18, fontFamily: 'Inter' }}>
                  Territory: {rep.territory}
                </span>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                <Logo src={branding.logoUrl || company?.logo} size={40} delay={25} />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 18, fontFamily: 'Inter' }}>
                  {company?.name}
                </span>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Quota Progress */}
      <Sequence from={120} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 80 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <Title text="Quota Attainment" />
            <div style={{
              fontSize: 80,
              fontWeight: 800,
              fontFamily: 'Inter',
              color: attainment >= 100 ? '#22C55E' : branding.accentColor,
            }}>
              {attainment.toFixed(0)}%
            </div>
            <ProgressBar
              progress={Math.min(attainment, 100)}
              delay={20}
              color={attainment >= 100 ? '#22C55E' : branding.accentColor}
              width={600}
              height={20}
              showLabel={false}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Key Stats */}
      <Sequence from={270} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatCard
              label="Revenue"
              value={rep?.achieved ?? 0}
              format="currency"
              delay={0}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Deals Closed"
              value={rep?.dealsClosed ?? 0}
              delay={10}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Avg Deal"
              value={rep?.avgDealSize ?? 0}
              format="currency"
              delay={20}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
            <StatCard
              label="Win Rate"
              value={(rep?.winRate ?? 0) * 100}
              format="percent"
              delay={30}
              primaryColor={branding.primaryColor}
              accentColor={branding.accentColor}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
