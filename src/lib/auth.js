import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { seedUsers } from './seedUsers';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const user = seedUsers.find(u => 
          u.email === credentials.email && 
          u.password === credentials.password
        );
        
        if (user) {
          return {
            id: user.email,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET
};

export default NextAuth(authOptions);