import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion'
import { Background, Logo, Title } from '../components'
import type { BaseCompositionProps, LibraryData } from '../types'

interface Props extends BaseCompositionProps {
  data: Partial<LibraryData>
}

export const LibraryTopBooksShowcase: React.FC<Props> = ({ branding, data }) => {
  const { library, period, books = [] } = data
  const frame = useCurrentFrame()

  // Sort by total loans and get top 10
  const topBooks = [...books].sort((a, b) => b.totalLoans - a.totalLoans).slice(0, 10)
  const totalLoans = books.reduce((sum, b) => sum + b.totalLoans, 0)

  return (
    <AbsoluteFill>
      <Background
        primaryColor={branding.primaryColor}
        secondaryColor={branding.secondaryColor}
        pattern="gradient"
      />

      {/* Intro */}
      <Sequence from={0} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Logo src={branding.logoUrl || library?.logo} size={120} />
            <Title
              text="Most Loved Books"
              subtitle={period?.name || `${period?.start || '2024'} - ${period?.end || '2024'}`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Total Stats */}
      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                color: branding.accentColor,
                fontSize: 120,
                fontWeight: 800,
                fontFamily: 'Inter',
              }}
            >
              {totalLoans.toLocaleString()}
            </span>
            <span
              style={{
                color: '#fff',
                fontSize: 32,
                fontWeight: 500,
                fontFamily: 'Inter',
              }}
            >
              Total Books Borrowed
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Top 3 Podium */}
      <Sequence from={180} durationInFrames={210}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Top 3 Most Borrowed" delay={0} />
          <div
            style={{
              marginTop: 60,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'flex-end',
              gap: 40,
              height: 500,
            }}
          >
            {/* 2nd Place */}
            {topBooks[1] && (
              <PodiumBook
                book={topBooks[1]}
                rank={2}
                height={320}
                branding={branding}
                frame={frame}
                startFrame={180}
                delay={15}
              />
            )}
            {/* 1st Place */}
            {topBooks[0] && (
              <PodiumBook
                book={topBooks[0]}
                rank={1}
                height={400}
                branding={branding}
                frame={frame}
                startFrame={180}
                delay={0}
              />
            )}
            {/* 3rd Place */}
            {topBooks[2] && (
              <PodiumBook
                book={topBooks[2]}
                rank={3}
                height={260}
                branding={branding}
                frame={frame}
                startFrame={180}
                delay={30}
              />
            )}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Books 4-10 Grid */}
      <Sequence from={390} durationInFrames={240}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="More Popular Reads" delay={0} />
          <div
            style={{
              marginTop: 80,
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 24,
              justifyItems: 'center',
            }}
          >
            {topBooks.slice(3, 10).map((book, i) => {
              const delay = i * 6
              const localFrame = frame - 390
              const opacity = interpolate(localFrame - delay, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
              const translateY = interpolate(localFrame - delay, [0, 15], [30, 0], { extrapolateRight: 'clamp' })

              return (
                <div
                  key={book.id}
                  style={{
                    opacity,
                    transform: `translateY(${translateY}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: 120,
                      height: 170,
                      borderRadius: 8,
                      backgroundColor: book.coverUrl ? 'transparent' : branding.primaryColor,
                      backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: book.coverUrl ? 0 : 8,
                    }}
                  >
                    {!book.coverUrl && (
                      <span
                        style={{
                          color: '#fff',
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: 'Inter',
                          textAlign: 'center',
                        }}
                      >
                        {book.title}
                      </span>
                    )}
                    <div
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        backgroundColor: branding.secondaryColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        color: '#fff',
                        fontSize: 12,
                        fontFamily: 'Inter',
                      }}
                    >
                      #{i + 4}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', maxWidth: 150 }}>
                    <div
                      style={{
                        color: '#fff',
                        fontSize: 12,
                        fontWeight: 600,
                        fontFamily: 'Inter',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {book.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: 10,
                        fontFamily: 'Inter',
                      }}
                    >
                      {book.totalLoans} loans
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={630} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text="What Will You Read Next?"
              subtitle={library?.name || 'Your Library'}
            />
            <Logo src={branding.logoUrl || library?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}

interface PodiumBookProps {
  book: LibraryData['books'][0]
  rank: number
  height: number
  branding: { primaryColor: string; secondaryColor: string; accentColor: string }
  frame: number
  startFrame: number
  delay: number
}

const PodiumBook: React.FC<PodiumBookProps> = ({ book, rank, height, branding, frame, startFrame, delay }) => {
  const localFrame = frame - startFrame
  const opacity = interpolate(localFrame - delay, [0, 20], [0, 1], { extrapolateRight: 'clamp' })
  const scale = interpolate(localFrame - delay, [0, 20], [0.8, 1], { extrapolateRight: 'clamp' })
  const translateY = interpolate(localFrame - delay, [0, 20], [50, 0], { extrapolateRight: 'clamp' })

  const medalColors: Record<number, string> = {
    1: '#FFD700',
    2: '#C0C0C0',
    3: '#CD7F32',
  }

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${translateY}px)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 16,
      }}
    >
      <div
        style={{
          position: 'relative',
          width: rank === 1 ? 180 : 150,
          height: rank === 1 ? 260 : 220,
          borderRadius: 12,
          backgroundColor: book.coverUrl ? 'transparent' : branding.primaryColor,
          backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 0 4px ${medalColors[rank]}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: book.coverUrl ? 0 : 16,
        }}
      >
        {!book.coverUrl && (
          <span
            style={{
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              fontFamily: 'Inter',
              textAlign: 'center',
            }}
          >
            {book.title}
          </span>
        )}
        <div
          style={{
            position: 'absolute',
            top: -16,
            right: -16,
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: medalColors[rank],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            color: rank === 1 ? '#000' : '#fff',
            fontSize: 24,
            fontFamily: 'Inter',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          }}
        >
          {rank}
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: rank === 1 ? 200 : 170 }}>
        <div
          style={{
            color: '#fff',
            fontSize: rank === 1 ? 18 : 14,
            fontWeight: 700,
            fontFamily: 'Inter',
            marginBottom: 4,
          }}
        >
          {book.title}
        </div>
        <div
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: rank === 1 ? 14 : 12,
            fontFamily: 'Inter',
            marginBottom: 8,
          }}
        >
          {book.author}
        </div>
        <div
          style={{
            color: medalColors[rank],
            fontSize: rank === 1 ? 20 : 16,
            fontWeight: 700,
            fontFamily: 'Inter',
          }}
        >
          {book.totalLoans} loans
        </div>
      </div>
    </div>
  )
}
