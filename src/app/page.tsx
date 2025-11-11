'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import TopTracks from './components/TopTracks';

export default function Home() {
  const { data: session } = useSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto py-8">
        <TopTracks />
      </main>
    </div>
  );
}
