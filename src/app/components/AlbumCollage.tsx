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
    id: string;
    name: string;
    images: { url: string }[];
  };
}

interface Album {
  id: string;
  name: string;
  images: { url: string }[];
  score: number;
}

type TimeRange = 'short_term' | 'medium_term' | 'long_term';

export default function AlbumCollage() {
  const { data: session } = useSession();
  const [sortedAlbums, setSortedAlbums] = useState<Album[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('medium_term');

  useEffect(() => {
    const fetchTopTracksAndProcessAlbums = async () => {
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
        const topTracks: Track[] = data.items;

        if (topTracks) {
          const albumScores = new Map<string, Album>();

          topTracks.forEach((track, index) => {
            const score = 50 - index;
            const albumId = track.album.id;

            if (albumScores.has(albumId)) {
              const existingAlbum = albumScores.get(albumId)!;
              existingAlbum.score += score;
            } else {
              albumScores.set(albumId, {
                id: albumId,
                name: track.album.name,
                images: track.album.images,
                score: score,
              });
            }
          });

          const sorted = Array.from(albumScores.values()).sort(
            (a, b) => b.score - a.score
          );
          setSortedAlbums(sorted);
        }
      }
    };

    fetchTopTracksAndProcessAlbums();
  }, [session, timeRange]);

  const getAlbumSize = (index: number) => {
    if (index < 3) return 'col-span-2 row-span-2'; // Top 3
    if (index < 10) return 'col-span-1 row-span-1'; // Next 7
    return 'col-span-1 row-span-1'; // The rest
  };

  const timeRangeLabels: { [key in TimeRange]: string } = {
    short_term: 'Last 4 Weeks',
    medium_term: 'Last 6 Months',
    long_term: 'All Time',
  };

  return (
    <div className="mt-8">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Your Top Albums Collage</h2>
         <div className="flex space-x-2 bg-transparent p-1 rounded-full neobrutal-border">
          {(['short_term', 'medium_term', 'long_term'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-300 ${
                timeRange === range
                  ? 'bg-[var(--primary)] text-[var(--background)]'
                  : 'bg-transparent text-[var(--foreground)] hover:bg-[var(--primary)] hover:text-[var(--background)]'
              }`}
            >
              {timeRangeLabels[range]}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4 auto-rows-fr">
        {sortedAlbums.map((album, index) => (
          <div key={album.id} className={`${getAlbumSize(index)} relative group neobrutal-border`}>
            <Image
              src={album.images[0].url}
              alt={album.name}
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
            <div className="absolute inset-0 bg-[var(--foreground)] bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <p className="text-[var(--background)] text-center font-bold p-2">{album.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
'''