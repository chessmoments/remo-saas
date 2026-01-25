import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface AnimatedNumberProps {
  value: number
  format?: 'number' | 'currency' | 'percent' | 'time'
  delay?: number
  color?: string
  fontSize?: number
  fontWeight?: number
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = 'number',
  delay = 0,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const progress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const currentValue = interpolate(progress, [0, 1], [0, value])

  const formatValue = (val: number): string => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(Math.round(val))
      case 'percent':
        return `${Math.round(val)}%`
      case 'time':
        const mins = Math.floor(val / 60)
        const secs = Math.round(val % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
      default:
        return new Intl.NumberFormat('en-US').format(Math.round(val))
    }
  }

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <span
      style={{
        color,
        fontSize,
        fontWeight,
        fontFamily: 'Inter, sans-serif',
        opacity,
      }}
    >
      {formatValue(currentValue)}
    </span>
  )
}
