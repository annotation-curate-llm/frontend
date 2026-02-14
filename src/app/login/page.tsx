'use client';

import { signIn } from 'next-auth/react';
import { Github, Loader2, AlertCircle, Layers } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Login() {
    const [isLoading, setIsLoading] = useState<'google' | 'github' | null>(null);
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleGoogleSignIn = async () => {
        try {
            setIsLoading('google');
            await signIn('google', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error('Google sign in error:', error);
            setIsLoading(null);
        }
    };

    const handleGithubSignIn = async () => {
        try {
            setIsLoading('github');
            await signIn('github', { callbackUrl: '/dashboard' });
        } catch (error) {
            console.error('GitHub sign in error:', error);
            setIsLoading(null);
        }
    };

    const getErrorMessage = (errorCode: string) => {
        const errorMessages: Record<string, string> = {
            OAuthSignin: 'Error connecting to authentication provider',
            OAuthCallback: 'Error during authentication',
            OAuthCreateAccount: 'Could not create account',
            EmailCreateAccount: 'Could not create account',
            Callback: 'Authentication callback error',
            OAuthAccountNotLinked: 'Account already exists with different provider',
            EmailSignin: 'Check your email address',
            CredentialsSignin: 'Sign in failed. Check your credentials.',
            SessionRequired: 'Please sign in to access this page',
        };
        return errorMessages[errorCode] || 'An error occurred during sign in';
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-dark relative overflow-hidden p-4">
            {/* Subtle orange radial glow behind card */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                    className="w-[600px] h-[600px] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 87, 34, 0.15) 0%, transparent 70%)',
                        filter: 'blur(60px)',
                    }}
                />
            </div>

            {/* Login Card */}
            <Card className="w-full max-w-md relative z-10 animate-fade-in border-border-subtle shadow-card">
                <CardHeader className="space-y-4">
                    {/* Logo */}
                    <div className="flex justify-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-orange flex items-center justify-center shadow-glow-orange">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Heading */}
                    <div className="text-center space-y-2">
                        <CardTitle className="text-2xl font-semibold tracking-tight">
                            Welcome Back
                        </CardTitle>
                        <CardDescription className="text-text-secondary">
                            Sign in to continue to your workspace
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Error Message */}
                    {error && (
                        <Alert variant="destructive" className="animate-slide-down bg-error/10 border-error/20">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-error-light">
                                {getErrorMessage(error)}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        {/* Google Button */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleGoogleSignIn}
                            disabled={isLoading !== null}
                            className="w-full gap-3 bg-bg-tertiary border-border-default hover:border-primary hover:shadow-glow-orange transition-all duration-300"
                        >
                            {isLoading === 'google' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path
                                        d="M19.8055 10.2292C19.8055 9.55102 19.7501 8.86735 19.6322 8.19867H10.2002V12.0493H15.6014C15.3773 13.2911 14.6571 14.3898 13.6025 15.0879V17.5866H16.8251C18.7173 15.8449 19.8055 13.2728 19.8055 10.2292Z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M10.2002 20.0006C12.9506 20.0006 15.2715 19.1151 16.8294 17.5865L13.6067 15.0879C12.7052 15.6979 11.5469 16.0433 10.2044 16.0433C7.54406 16.0433 5.28926 14.2823 4.49681 11.9165H1.17432V14.4923C2.76983 17.8088 6.31021 20.0006 10.2002 20.0006Z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M4.49253 11.9167C4.07005 10.6749 4.07005 9.33009 4.49253 8.08838V5.51257H1.17435C-0.392486 8.51441 -0.392486 12.4907 1.17435 15.4925L4.49253 11.9167Z"
                                        fill="#FBBC04"
                                    />
                                    <path
                                        d="M10.2002 3.95724C11.6231 3.936 13.0004 4.47198 14.0361 5.45722L16.8933 2.60046C15.1811 0.990831 12.9317 0.0983604 10.2002 0.122516C6.31021 0.122516 2.76983 2.31432 1.17432 5.6313L4.49251 8.20711C5.28063 5.83702 7.53975 3.95724 10.2002 3.95724Z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            )}
                            {isLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
                        </Button>

                        {/* GitHub Button */}
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={handleGithubSignIn}
                            disabled={isLoading !== null}
                            className="w-full gap-3 bg-[#24292e] border-[#30363d] hover:bg-[#2c3237] hover:border-primary hover:shadow-glow-orange transition-all duration-300"
                        >
                            {isLoading === 'github' ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Github className="w-5 h-5" />
                            )}
                            {isLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
                        </Button>
                    </div>
                </CardContent>

                <CardFooter className="flex-col border-t border-border-subtle pt-6">
                    <p className="text-center text-xs text-text-tertiary">
                        By continuing, you agree to our{' '}
                        <a href="/terms" className="text-text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline">
                            Terms of Service
                        </a>{' '}
                        and{' '}
                        <a href="/privacy" className="text-text-secondary hover:text-primary transition-colors underline-offset-4 hover:underline">
                            Privacy Policy
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}