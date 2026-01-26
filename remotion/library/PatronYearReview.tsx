import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion'
import { Background, Logo, Title, ProfilePhoto, StatCard } from '../components'
import type { BaseCompositionProps, LibraryData } from '../types'

interface Props extends BaseCompositionProps {
  data: Partial<LibraryData> & {
    patron?: LibraryData['patrons'][0]
  }
}

export const LibraryPatronYearReview: React.FC<Props> = ({ branding, data }) => {
  const { patron, library, period } = data
  const frame = useCurrentFrame()

  const loans = patron?.loans ?? []
  const totalBooks = loans.length
  const uniqueAuthors = new Set(loans.map(l => l.book.author)).size
  const genres = loans.reduce((acc, l) => {
    const genre = l.book.genre || 'Unknown'
    acc[genre] = (acc[genre] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  const topGenre = Object.entries(genres).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Various'
  const totalPages = loans.reduce((sum, l) => sum + (l.book.pageCount || 250), 0)

  // Get top 6 books for display
  const topBooks = loans.slice(0, 6)

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
              text="Your Reading Year"
              subtitle={period?.name || `${period?.start || '2024'} - ${period?.end || '2024'}`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Patron Profile */}
      <Sequence from={90} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <ProfilePhoto
              src={patron?.photo}
              name={patron?.name || 'Reader'}
              size={180}
              borderColor={branding.accentColor}
            />
            <Title
              text={patron?.name || 'Reader'}
              subtitle={`Member since ${patron?.memberSince || '2024'}`}
              delay={15}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Stats Overview */}
      <Sequence from={210} durationInFrames={180}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
            <Title text="Your Reading Stats" />
            <div style={{ display: 'flex', gap: 32 }}>
              <StatCard
                label="Books Read"
                value={totalBooks}
                delay={15}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Authors"
                value={uniqueAuthors}
                delay={25}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
              <StatCard
                label="Pages"
                value={totalPages}
                delay={35}
                primaryColor={branding.primaryColor}
                accentColor={branding.accentColor}
              />
            </div>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Top Genre */}
      <Sequence from={390} durationInFrames={120}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 60 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <Title text="Your Top Genre" />
            <div
              style={{
                padding: '32px 64px',
                backgroundColor: `${branding.accentColor}33`,
                borderRadius: 24,
                border: `3px solid ${branding.accentColor}`,
              }}
            >
              <span
                style={{
                  color: '#fff',
                  fontSize: 48,
                  fontWeight: 700,
                  fontFamily: 'Inter',
                }}
              >
                {topGenre}
              </span>
            </div>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 20, fontFamily: 'Inter' }}>
              {genres[topGenre] || 0} books in this genre
            </span>
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Books Display - Creative Book Covers Grid */}
      <Sequence from={510} durationInFrames={240}>
        <AbsoluteFill style={{ padding: 60 }}>
          <Title text="Books You Discovered" delay={0} />
          <div
            style={{
              marginTop: 80,
              display: 'flex',
              flexWrap: 'wrap',
              gap: 24,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {topBooks.map((loan, i) => {
              const delay = i * 8
              const opacity = interpolate(frame - 510 - delay, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
              const scale = interpolate(frame - 510 - delay, [0, 15], [0.8, 1], { extrapolateRight: 'clamp' })
              const rotation = interpolate(frame - 510 - delay, [0, 15], [-5, (i % 2 === 0 ? -2 : 2)], { extrapolateRight: 'clamp' })

              return (
                <div
                  key={loan.book.title + i}
                  style={{
                    opacity,
                    transform: `scale(${scale}) rotate(${rotation}deg)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 12,
                    width: 200,
                  }}
                >
                  <div
                    style={{
                      width: 140,
                      height: 200,
                      borderRadius: 8,
                      backgroundColor: loan.book.coverUrl ? 'transparent' : branding.accentColor,
                      backgroundImage: loan.book.coverUrl ? `url(${loan.book.coverUrl})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: loan.book.coverUrl ? 0 : 12,
                    }}
                  >
                    {!loan.book.coverUrl && (
                      <span
                        style={{
                          color: '#fff',
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily: 'Inter',
                          textAlign: 'center',
                        }}
                      >
                        {loan.book.title}
                      </span>
                    )}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        fontFamily: 'Inter',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 180,
                      }}
                    >
                      {loan.book.title}
                    </div>
                    <div
                      style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: 12,
                        fontFamily: 'Inter',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 180,
                      }}
                    >
                      {loan.book.author}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Outro */}
      <Sequence from={750} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Title
              text="Keep Reading!"
              subtitle={`${totalBooks} books and counting`}
            />
            <Logo src={branding.logoUrl || library?.logo} size={80} delay={20} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
