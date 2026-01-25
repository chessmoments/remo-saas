import { useCurrentFrame, interpolate, AbsoluteFill } from 'remotion'

interface BackgroundProps {
  primaryColor: string
  secondaryColor: string
  pattern?: 'gradient' | 'mesh' | 'dots' | 'waves'
  animated?: boolean
}

export const Background: React.FC<BackgroundProps> = ({
  primaryColor,
  secondaryColor,
  pattern = 'gradient',
  animated = true,
}) => {
  const frame = useCurrentFrame()

  const gradientAngle = animated
    ? interpolate(frame, [0, 300], [135, 225], {
        extrapolateRight: 'extend',
      })
    : 135

  const renderPattern = () => {
    switch (pattern) {
      case 'mesh':
        return (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(ellipse at 20% 30%, ${primaryColor}66 0%, transparent 50%),
                  radial-gradient(ellipse at 80% 70%, ${secondaryColor}66 0%, transparent 50%),
                  radial-gradient(ellipse at 50% 50%, ${primaryColor}33 0%, transparent 70%)
                `,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(${gradientAngle}deg, ${primaryColor}22, ${secondaryColor}22)`,
              }}
            />
          </>
        )

      case 'dots':
        return (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
              }}
            />
          </>
        )

      case 'waves':
        const waveOffset = animated ? frame * 0.5 : 0
        return (
          <>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(180deg, ${primaryColor}, ${secondaryColor})`,
              }}
            />
            <svg
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '40%',
                opacity: 0.3,
              }}
              viewBox="0 0 1920 400"
              preserveAspectRatio="none"
            >
              <path
                d={`M0,200 C480,${100 + Math.sin(waveOffset * 0.02) * 50},960,${300 + Math.sin(waveOffset * 0.02 + 1) * 50},1920,200 L1920,400 L0,400 Z`}
                fill="rgba(255,255,255,0.1)"
              />
            </svg>
          </>
        )

      default: // gradient
        return (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(${gradientAngle}deg, ${primaryColor}, ${secondaryColor})`,
            }}
          />
        )
    }
  }

  return (
    <AbsoluteFill
      style={{
        backgroundColor: primaryColor,
      }}
    >
      {renderPattern()}
    </AbsoluteFill>
  )
}
