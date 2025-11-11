'use client';

import { signIn, useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    redirect('/');
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Spotify Report</h1>
        <p className="text-lg text-gray-400 mb-8">
          Log in to see your top tracks and artists from Spotify.
        </p>
        <button
          onClick={() => signIn('spotify', { callbackUrl: '/' })}
          className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition duration-300"
        >
          Log in with Spotify
        </button>
      </div>
    </div>
  );
}