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
      <label className="block mb-2 font-semibold">Upload Audio File</label>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileUpload}
        className="border p-2 rounded w-full"
        disabled={loading}
      />
    </div>
  );
};
