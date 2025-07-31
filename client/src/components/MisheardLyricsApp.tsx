import { useState } from 'react';
import { KaraokePlayer } from './KaraokePlayer';

export const MisheardLyricsApp = () => {
  const [lyrics, setLyrics] =
    useState<{ start: number; end: number; text: string }[]>();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    setLoading(true);
    setAudioSrc(URL.createObjectURL(file)); // Play original file locally

    const formData = new FormData();
    formData.append('audio', file);

    const res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setLyrics(data);
    setLoading(false);
  };

  const handleYoutubeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!youtubeUrl) return;

    setLoading(true);
    setAudioSrc(null); // We can later add streaming from backend

    const res = await fetch('http://localhost:3001/youtube', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: youtubeUrl }),
    });
    const data: {
      lyrics: { start: number; end: number; text: string }[];
      audioUrl: string;
    } = await res.json();
    setAudioSrc(`http://localhost:3001/uploads/${data.audioUrl}`);
    setLyrics(data.lyrics);
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">🎵 Misheard Lyrics Captioner</h1>

      {/* File Upload */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Upload Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* OR Separator */}
      <div className="my-4 text-gray-500">— OR —</div>

      {/* YouTube URL */}
      <form onSubmit={handleYoutubeSubmit} className="mb-6">
        <label className="block mb-2 font-semibold">YouTube Link</label>
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Process Song
        </button>
      </form>

      {/* Loading Indicator */}
      {loading && <p className="text-lg font-semibold">Processing... 🎤</p>}

      {/* Karaoke Player */}
      {audioSrc && !loading && lyrics && (
        <div className="mt-6">
          <KaraokePlayer audioSrc={audioSrc} lyrics={lyrics} />
        </div>
      )}
    </div>
  );
};
