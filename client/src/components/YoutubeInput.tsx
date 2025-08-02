
import React, { useState } from 'react';
import { useMisheard } from './MisheardContext';
import { processYoutube } from '../services/youtubeService';
import { ActionButton } from './ActionButton';

export const YoutubeInput: React.FC = () => {
  const { setAudioSrc, setLyrics, setLoading, level, loading } = useMisheard();
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const handleYoutubeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!youtubeUrl) return;
    setLoading(true);
    const data: {
      lyrics: { start: number; end: number; text: string }[];
      audioUrl: string;
    } = await processYoutube({ url: youtubeUrl, level });
    setAudioSrc(
      `${import.meta.env.VITE_API_BASE_URL}/uploads/${data.audioUrl}`
    );
    setLyrics(data.lyrics);
    setLoading(false);
  };

  return (
    <form onSubmit={handleYoutubeSubmit} className="mb-6">
      <label className="block mb-3 text-lg font-semibold text-indigo-700 flex items-center gap-2">
        <span className="inline-block text-2xl">▶️</span> YouTube Link
      </label>
      <input
        type="url"
        placeholder="https://youtube.com/watch?v=..."
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        className="border-2 border-indigo-200 p-2 rounded-lg w-full mb-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm transition"
        disabled={loading}
      />
      <ActionButton disabled={true}>
        <span className="inline-block text-lg">🎬</span> Process Song
      </ActionButton>
    </form>
  );
};
