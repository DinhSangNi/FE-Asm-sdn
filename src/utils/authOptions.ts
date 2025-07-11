import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
          {
            method: 'post',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const token = data.metadata.accessToken;
          const user = data.metadata.user;

          return {
            id: user._id,
            name: user.name,
            email: user.email,
            avartar: user.avartar,
            token: token,
          };
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avartar = user.avartar ?? '';
        token.accessToken = user.token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.avartar = token.avartar;
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};
