import 'next-auth';

declare module 'next-auth' {
    interface User {
        id: string;
        role: 'admin' | 'annotator' | 'reviewer';
        backendToken?: string;
    }

    interface Session {
        user: User & {
            id: string;
            role: 'admin' | 'annotator' | 'reviewer';
        };
        backendToken?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'admin' | 'annotator' | 'reviewer';
        backendToken?: string;
    }
}