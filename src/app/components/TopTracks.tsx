'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function TopTracks() {
  const { data: session } = useSession();
  const [topTracks, setTopTracks] = useState([]);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (session?.accessToken) {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
          headers: {
            Authorization: `Bearer ${session.accessToken}`,
          },
        });
        const data = await response.json();
        setTopTracks(data.items);
      }
    };

    fetchTopTracks();
  }, [session]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Your Top 50 Tracks</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {topTracks.map((track: any) => (
          <div key={track.id} className="relative group">
            <Image
              src={track.album.images[0].url}
              alt={track.album.name}
              width={300}
              height={300}
              className="rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
              <div className="text-center text-white p-2">
                <p className="font-bold">{track.name}</p>
                <p className="text-sm">{track.artists.map((artist: any) => artist.name).join(', ')}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}