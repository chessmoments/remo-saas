import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from 'remotion'
import { Background, Logo, Title, ProfilePhoto } from '../components'
import type { BaseCompositionProps, LibraryData } from '../types'

interface Props extends BaseCompositionProps {
  data: Partial<LibraryData> & {
    patron?: LibraryData['patrons'][0]
  }
}

export const LibraryReadingJourney: React.FC<Props> = ({ branding, data }) => {
  const { patron, library, period } = data
  const frame = useCurrentFrame()

  const loans = patron?.loans ?? []

  // Group loans by month
  const loansByMonth = loans.reduce((acc, loan) => {
    const date = new Date(loan.borrowedDate)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    if (!acc[monthKey]) {
      acc[monthKey] = { name: monthName, books: [] }
    }
    acc[monthKey].books.push(loan.book)
    return acc
  }, {} as Record<string, { name: string; books: typeof loans[0]['book'][] }>)

  const months = Object.entries(loansByMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(0, 6)

  const totalBooks = loans.length

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
              text="Your Reading Journey"
              subtitle={period?.name || `${period?.start || '2024'} - ${period?.end || '2024'}`}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Patron Intro */}
      <Sequence from={90} durationInFrames={90}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <ProfilePhoto
              src={patron?.photo}
              name={patron?.name || 'Reader'}
              size={140}
              borderColor={branding.accentColor}
            />
            <Title
              text={patron?.name || 'Reader'}
              subtitle={`${totalBooks} books borrowed`}
              delay={10}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* Timeline Journey - Each month gets featured */}
      {months.map(([ , monthData], monthIndex) => (
        <Sequence key={monthData.name} from={180 + monthIndex * 120} durationInFrames={120}>
          <AbsoluteFill style={{ padding: 60 }}>
            {/* Month Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                marginBottom: 40,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 60,
                  backgroundColor: branding.accentColor,
                  borderRadius: 4,
                }}
              />
              <div>
                <div
                  style={{
                    color: branding.accentColor,
                    fontSize: 20,
                    fontWeight: 500,
                    fontFamily: 'Inter',
                    textTransform: 'uppercase',
                    letterSpacing: 2,
                  }}
                >
                  {monthData.name}
                </div>
                <div
                  style={{
                    color: '#fff',
                    fontSize: 32,
                    fontWeight: 700,
                    fontFamily: 'Inter',
                  }}
                >
                  {monthData.books.length} {monthData.books.length === 1 ? 'Book' : 'Books'} Read
                </div>
              </div>
            </div>

            {/* Books for this month - Stacked/Fanned display */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 400,
                position: 'relative',
              }}
            >
              {monthData.books.slice(0, 5).map((book, bookIndex) => {
                const localFrame = frame - (180 + monthIndex * 120)
                const delay = bookIndex * 6
                const opacity = interpolate(localFrame - delay, [0, 12], [0, 1], { extrapolateRight: 'clamp' })
                const rotation = (bookIndex - Math.floor(monthData.books.slice(0, 5).length / 2)) * 8
                const translateX = (bookIndex - Math.floor(monthData.books.slice(0, 5).length / 2)) * 80
                const translateY = Math.abs(bookIndex - Math.floor(monthData.books.slice(0, 5).length / 2)) * 15
                const scale = interpolate(localFrame - delay, [0, 12], [0.8, 1], { extrapolateRight: 'clamp' })

                return (
                  <div
                    key={book.title + bookIndex}
                    style={{
                      position: 'absolute',
                      opacity,
                      transform: `translateX(${translateX}px) translateY(${translateY}px) rotate(${rotation}deg) scale(${scale})`,
                      zIndex: 10 - Math.abs(bookIndex - Math.floor(monthData.books.slice(0, 5).length / 2)),
                    }}
                  >
                    <div
                      style={{
                        width: 160,
                        height: 230,
                        borderRadius: 10,
                        backgroundColor: book.coverUrl ? 'transparent' : branding.primaryColor,
                        backgroundImage: book.coverUrl ? `url(${book.coverUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                        border: '4px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: book.coverUrl ? 0 : 16,
                      }}
                    >
                      {!book.coverUrl && (
                        <>
                          <span
                            style={{
                              color: '#fff',
                              fontSize: 14,
                              fontWeight: 700,
                              fontFamily: 'Inter',
                              textAlign: 'center',
                              marginBottom: 8,
                            }}
                          >
                            {book.title}
                          </span>
                          <span
                            style={{
                              color: 'rgba(255,255,255,0.8)',
                              fontSize: 11,
                              fontFamily: 'Inter',
                              textAlign: 'center',
                            }}
                          >
                            {book.author}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Book titles below */}
            <div
              style={{
                position: 'absolute',
                bottom: 60,
                left: 60,
                right: 60,
                display: 'flex',
                justifyContent: 'center',
                gap: 32,
                flexWrap: 'wrap',
              }}
            >
              {monthData.books.slice(0, 5).map((book, i) => {
                const localFrame = frame - (180 + monthIndex * 120)
                const delay = 30 + i * 4
                const opacity = interpolate(localFrame - delay, [0, 10], [0, 1], { extrapolateRight: 'clamp' })

                return (
                  <div
                    key={book.title + i + 'label'}
                    style={{
                      opacity,
                      textAlign: 'center',
                      maxWidth: 150,
                    }}
                  >
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
                      {book.author}
                    </div>
                  </div>
                )
              })}
            </div>
          </AbsoluteFill>
        </Sequence>
      ))}

      {/* Outro */}
      <Sequence from={180 + months.length * 120} durationInFrames={150}>
        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32 }}>
            <Title
              text="Your Journey Continues..."
              subtitle={`${totalBooks} stories discovered`}
            />
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 16,
              }}
            >
              {months.map(([ , monthData], i) => (
                <div
                  key={monthData.name}
                  style={{
                    width: 40,
                    height: 8 + monthData.books.length * 6,
                    backgroundColor: branding.accentColor,
                    borderRadius: 4,
                    opacity: 0.6 + (i / months.length) * 0.4,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: 14,
                fontFamily: 'Inter',
              }}
            >
              Books read by month
            </span>
            <Logo src={branding.logoUrl || library?.logo} size={60} delay={30} />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  )
}
