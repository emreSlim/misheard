import React from 'react';

interface YoutubeInputProps {
  youtubeUrl: string;
  setYoutubeUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

export const YoutubeInput: React.FC<YoutubeInputProps> = ({ youtubeUrl, setYoutubeUrl, onSubmit, loading }) => (
  <form onSubmit={onSubmit} className="mb-6">
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
