'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Hero from '@/components/landing/Hero';
// Import other sections when ready
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
// import Pricing from '@/components/landing/Pricing';
import CTA from '@/components/landing/CTA';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      // Redirect based on role
      router.push('/');
    } else if (status === 'unauthenticated') {
      // Stay on landing page or redirect to login
      // router.push('/login');
    }
  }, [status, router]);

  return (
    <>
      <Hero />
      {/* Add other sections here */}
      <Features />
      <HowItWorks />
      {/* <Pricing /> */}
      <CTA />
    </>
  );
}
