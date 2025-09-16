import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { connectToDatabase } from "@/lib/db"
import User from "@/lib/models/user"
import type { JWT } from "next-auth/jwt"

// Define a more complete session and JWT types
interface ExtendedJWT extends JWT {
  id?: string
  role?: string
}

interface ExtendedSession {
  user: {
    id?: string
    name?: string | null
    email?: string | null
    role?: string
    image?: string | null
  }
  expires: string
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials")
        }

        await connectToDatabase()

        const user = await User.findOne({ email: credentials.email }).select("+password")

        if (!user) {
          throw new Error("Invalid credentials")
        }

        const isPasswordCorrect = await user.comparePassword(credentials.password)

        if (!isPasswordCorrect) {
          throw new Error("Invalid credentials")
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: ExtendedJWT; user: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: ExtendedSession; token: ExtendedJWT }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    // You can add more JWT configuration here if needed
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
