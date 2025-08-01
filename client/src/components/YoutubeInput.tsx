import React, { useState } from 'react';
import { useMisheard } from './MisheardContext';
import { processYoutube } from '../services/youtubeService';

export const YoutubeInput: React.FC = () => {
  const { setAudioSrc, setLyrics, setLoading, level, loading } = useMisheard();
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleYoutubeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setLoading(true);
    setAudioSrc(null); // We can later add streaming from backend

    const data: {
      lyrics: { start: number; end: number; text: string }[];
      audioUrl: string;
    } = await processYoutube({ url: youtubeUrl, level });
    setAudioSrc(`http://localhost:3001/uploads/${data.audioUrl}`);
    setLyrics(data.lyrics);
    setLoading(false);
  };

  return (
    <form onSubmit={handleYoutubeSubmit} className="mb-6">
      <label className="block mb-2 font-semibold">YouTube Link</label>
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="border p-2 rounded w-full mb-2"
        disabled={loading}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        Process Song
      </button>
    </form>
  );
};
