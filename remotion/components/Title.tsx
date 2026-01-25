import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface TitleProps {
  text: string
  subtitle?: string
  delay?: number
  color?: string
  subtitleColor?: string
  align?: 'left' | 'center' | 'right'
}

export const Title: React.FC<TitleProps> = ({
  text,
  subtitle,
  delay = 0,
  color = '#ffffff',
  subtitleColor = 'rgba(255,255,255,0.8)',
  align = 'center',
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleScale = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 15,
      stiffness: 100,
      mass: 0.5,
    },
  })

  const titleOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const subtitleOpacity = interpolate(frame - delay - 10, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  const translateY = interpolate(titleScale, [0, 1], [30, 0])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        textAlign: align,
      }}
    >
      <h1
        style={{
          color,
          fontSize: 64,
          fontWeight: 800,
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${translateY}px)`,
          lineHeight: 1.1,
        }}
      >
        {text}
      </h1>
      {subtitle && (
        <p
          style={{
            color: subtitleColor,
            fontSize: 24,
            fontWeight: 500,
            fontFamily: 'Inter, sans-serif',
            margin: 0,
            opacity: subtitleOpacity,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
