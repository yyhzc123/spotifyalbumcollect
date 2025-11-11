'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="flex flex-col sm:flex-row items-center justify-between p-4 bg-black text-white">
      <div className="text-2xl font-bold mb-4 sm:mb-0">Spotify Report</div>
      {session && (
        <div className="flex items-center">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || 'User avatar'}
              width={40}
              height={40}
              className="rounded-full mr-4"
            />
          )}
          <button
            onClick={() => signOut()}
            className="bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition duration-300"
          >
            Log out
          </button>
        </div>
      )}
    </header>
  );
}