import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    avartar?: string;
    token: string;
  }

  interface Session {
    accessToken: string;
    user: {
      name?: string;
      id?: string;
      email?: string;
      avartar?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    name: string;
    email: string;
    avartar: string;
    accessToken: string;
  }
}
