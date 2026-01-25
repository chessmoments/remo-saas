import { useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import { ProfilePhoto } from './ProfilePhoto'
import { AnimatedNumber } from './AnimatedNumber'

interface LeaderboardEntry {
  rank: number
  name: string
  photo?: string
  value: number
  highlight?: boolean
}

interface LeaderboardProps {
  entries: LeaderboardEntry[]
  title: string
  valueLabel: string
  valueFormat?: 'number' | 'currency' | 'percent' | 'time'
  primaryColor?: string
  accentColor?: string
  delay?: number
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  title,
  valueLabel,
  valueFormat = 'number',
  primaryColor = '#3B82F6',
  accentColor = '#F59E0B',
  delay = 0,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const titleOpacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 40,
      }}
    >
      <h2
        style={{
          color: '#ffffff',
          fontSize: 36,
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          opacity: titleOpacity,
          textAlign: 'center',
        }}
      >
        {title}
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {entries.slice(0, 10).map((entry, index) => {
          const entryDelay = delay + 15 + index * 8

          const slideIn = spring({
            frame: frame - entryDelay,
            fps,
            config: {
              damping: 20,
              stiffness: 100,
              mass: 0.5,
            },
          })

          const opacity = interpolate(frame - entryDelay, [0, 10], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })

          const translateX = interpolate(slideIn, [0, 1], [100, 0])

          const isTop3 = entry.rank <= 3
          const rankColors = ['#FFD700', '#C0C0C0', '#CD7F32']

          return (
            <div
              key={entry.rank}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '12px 20px',
                backgroundColor: entry.highlight
                  ? `${accentColor}33`
                  : 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                border: entry.highlight
                  ? `2px solid ${accentColor}`
                  : '1px solid rgba(255,255,255,0.1)',
                opacity,
                transform: `translateX(${translateX}px)`,
              }}
            >
              <span
                style={{
                  color: isTop3 ? rankColors[entry.rank - 1] : '#ffffff',
                  fontSize: 24,
                  fontWeight: 700,
                  fontFamily: 'Inter, sans-serif',
                  width: 40,
                  textAlign: 'center',
                }}
              >
                #{entry.rank}
              </span>

              <ProfilePhoto
                src={entry.photo}
                name={entry.name}
                size={50}
                delay={entryDelay}
                borderColor={isTop3 ? rankColors[entry.rank - 1] : primaryColor}
                borderWidth={2}
              />

              <span
                style={{
                  color: '#ffffff',
                  fontSize: 20,
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  flex: 1,
                }}
              >
                {entry.name}
              </span>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                }}
              >
                <AnimatedNumber
                  value={entry.value}
                  format={valueFormat}
                  delay={entryDelay + 5}
                  fontSize={22}
                  fontWeight={700}
                  color={isTop3 ? rankColors[entry.rank - 1] : '#ffffff'}
                />
                <span
                  style={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: 12,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {valueLabel}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
