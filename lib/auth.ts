import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import type { NextAuthConfig } from 'next-auth'

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, profile }) {
      if (!user.email || !profile?.sub) {
        return false
      }

      // Lazy-load prisma to avoid Edge Runtime issues
      const { prisma } = await import('./prisma')

      // Upsert user in database
      const dbUser = await prisma.user.upsert({
        where: { googleId: profile.sub },
        update: {
          email: user.email,
          name: user.name,
          image: user.image,
        },
        create: {
          googleId: profile.sub,
          email: user.email,
          name: user.name,
          image: user.image,
        },
      })

      // If user has no organization, create one
      if (!dbUser.organizationId) {
        const slug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
        const org = await prisma.organization.create({
          data: {
            name: user.name || 'My Organization',
            slug: `${slug}-${Date.now()}`,
          },
        })
        await prisma.user.update({
          where: { id: dbUser.id },
          data: { organizationId: org.id, role: 'OWNER' },
        })
      }

      return true
    },
    async jwt({ token, profile }) {
      if (profile?.sub) {
        // Lazy-load prisma
        const { prisma } = await import('./prisma')
        const user = await prisma.user.findUnique({
          where: { googleId: profile.sub },
          include: { organization: true },
        })
        if (user) {
          token.dbId = user.id
          token.organizationId = user.organizationId
          token.role = user.role
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token.dbId) {
        session.user.id = token.dbId as string
        session.user.organizationId = token.organizationId as string | null
        session.user.role = token.role as string
      }
      return session
    },
  },
}

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig)

// Type augmentation for session
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      organizationId: string | null
      role: string
    }
  }
}
