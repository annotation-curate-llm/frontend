import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/auth/token`,
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: user.email,
                            name: user.name,
                            avatar_url: user.image,
                            provider: account?.provider,
                            provider_id: account?.providerAccountId,
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();

                    user.id = data.user.id;
                    user.role = data.user.role as 'admin' | 'annotator' | 'reviewer';
                    // @ts-ignore
                    user.backendToken = data.access_token;

                    return true;
                }

                console.error('Backend token generation failed:', response.status);
                return false;
            } catch (error) {
                console.error('Error during sign in:', error);
                return false;
            }
        },

        async jwt({ token, user }) {
            // On initial sign in, user object is available
            if (user) {
                token.id = user.id;
                token.role = user.role;
                // @ts-ignore
                token.backendToken = user.backendToken;
            }
            return token;
        },

        async session({ session, token }) {
            // Add custom fields to session
            if (session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'admin' | 'annotator' | 'reviewer';
                // @ts-ignore
                session.backendToken = token.backendToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };