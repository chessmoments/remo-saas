import { Img, useCurrentFrame, interpolate } from 'remotion'

interface LogoProps {
  src?: string
  size?: number
  animate?: boolean
  delay?: number
}

export const Logo: React.FC<LogoProps> = ({ src, size = 100, animate = true, delay = 0 }) => {
  const frame = useCurrentFrame()
  const adjustedFrame = Math.max(0, frame - delay)

  const scale = animate
    ? interpolate(adjustedFrame, [0, 15], [0.8, 1], { extrapolateRight: 'clamp' })
    : 1

  const opacity = animate
    ? interpolate(adjustedFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' })
    : 1

  if (!src) {
    return null
  }

  return (
    <div
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
        opacity,
      }}
    >
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}
