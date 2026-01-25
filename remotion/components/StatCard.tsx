import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { AnimatedNumber } from './AnimatedNumber'

interface StatCardProps {
  label: string
  value: number
  format?: 'number' | 'currency' | 'percent' | 'time'
  delay?: number
  primaryColor?: string
  accentColor?: string
  icon?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  format = 'number',
  delay = 0,
  primaryColor = '#3B82F6',
  accentColor = '#F59E0B',
  icon,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const scale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 24,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: `scale(${scale})`,
        opacity,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        minWidth: 150,
      }}
    >
      {icon && (
        <div style={{ color: accentColor, marginBottom: 8 }}>
          {icon}
        </div>
      )}
      <span
        style={{
          color: 'rgba(255,255,255,0.7)',
          fontSize: 14,
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: 1,
        }}
      >
        {label}
      </span>
      <AnimatedNumber
        value={value}
        format={format}
        delay={delay + 5}
        color="#ffffff"
        fontSize={36}
        fontWeight={700}
      />
    </div>
  )
}
