'''
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export default function TopTracks() {
  const { data: session } = useSession();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (session?.accessToken) {
        const response = await fetch(
          `https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=${timeRange}`,
          {
            headers: {
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );
        const data = await response.json();
        setTopTracks(data.items);
      }
    };

    fetchTopTracks();
  }, [session, timeRange]);

  const timeRangeLabels: { [key in TimeRange]: string } = {
    short_term: 'Last 4 Weeks',
    medium_term: 'Last 6 Months',
    long_term: 'All Time',
  };

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Top 50 Tracks</h2>
        <div className="flex space-x-2 bg-[#282828] p-1 rounded-full">
          {(['short_term', 'medium_term', 'long_term'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                timeRange === range
                  ? 'bg-green-500 text-white'
                  : 'bg-transparent text-gray-400 hover:bg-white/10'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {topTracks.map((track) => (
          <a
            key={track.id}
            href={track.external_urls.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition duration-300 group"
          >
            <div className="relative mb-4">
              <Image
                src={track.album.images[0].url}
                alt={track.album.name}
                width={300}
                height={300}
                className="rounded-md shadow-lg"
              />
            </div>
            <div>
              <p className="font-bold truncate">{track.name}</p>
              <p className="text-sm text-gray-400 truncate">
                {track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}