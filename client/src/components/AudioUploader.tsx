import React from 'react';
import { useMisheard } from './MisheardContext';
import { uploadAudio } from '../services/audioUploadService';

export const AudioUploader: React.FC = () => {
  const { setLyrics, setAudioSrc, setLoading, level, loading } = useMisheard();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    setLoading(true);
    setAudioSrc(URL.createObjectURL(file)); // Play original file locally
    const data = await uploadAudio({ audio: file, level });
    setLyrics(data);
    setLoading(false);
  };

  return (
    <div className="mb-4">
      <label className="block mb-3 text-lg font-semibold text-indigo-700 flex items-center gap-2">
        <span className="inline-block text-2xl">📁</span> Upload Audio File
      </label>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="border-2 border-indigo-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
        disabled={loading}
      />
    </div>
  );
};
