import { Img, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'

interface ProfilePhotoProps {
  src?: string
  name: string
  size?: number
  delay?: number
  borderColor?: string
  borderWidth?: number
}

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  src,
  name,
  size = 120,
  delay = 0,
  borderColor = '#3B82F6',
  borderWidth = 4,
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

  // Generate initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: `${borderWidth}px solid ${borderColor}`,
        overflow: 'hidden',
        transform: `scale(${scale})`,
        opacity,
        backgroundColor: borderColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {src ? (
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span
          style={{
            color: '#ffffff',
            fontSize: size * 0.4,
            fontWeight: 700,
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
