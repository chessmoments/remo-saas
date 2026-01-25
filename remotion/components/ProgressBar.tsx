import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface ProgressBarProps {
  progress: number // 0-100 or 0-1
  max?: number
  delay?: number
  color?: string
  backgroundColor?: string
  height?: number
  width?: number
  borderRadius?: number
  showLabel?: boolean
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  max = 100,
  delay = 0,
  color = '#3B82F6',
  backgroundColor = 'rgba(255,255,255,0.2)',
  height = 20,
  width = 400,
  borderRadius = 10,
  showLabel = true,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const normalizedProgress = max === 1 ? progress * 100 : progress

  const animatedProgress = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 20,
      stiffness: 80,
      mass: 0.8,
    },
  })

  const currentWidth = interpolate(animatedProgress, [0, 1], [0, normalizedProgress])

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
      }}
    >
      <div
        style={{
          width,
          height,
          backgroundColor,
          borderRadius,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${currentWidth}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius,
            transition: 'width 0.1s ease-out',
          }}
        />
      </div>
      {showLabel && (
        <span
          style={{
            color: '#ffffff',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            minWidth: 50,
          }}
        >
          {Math.round(currentWidth)}%
        </span>
      )}
    </div>
  )
}
