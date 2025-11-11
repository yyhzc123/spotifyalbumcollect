'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import TopTracks from './components/TopTracks';
import AlbumCollage from './components/AlbumCollage';

export default function Home() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto py-8">
        <AlbumCollage />
        {/* <TopTracks /> */}
      </main>
    </div>
  );
}
