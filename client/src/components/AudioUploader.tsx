

import React, { useState } from 'react';
import { useMisheard } from './MisheardContext';
import { uploadAudio } from '../services/audioUploadService';
import { ActionButton } from './ActionButton';


export const AudioUploader: React.FC = () => {
  const { setLyrics, setAudioSrc, setLoading, level, loading } = useMisheard();
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalAudioUrl(url);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    const data = await uploadAudio({ audio: selectedFile, level });
    setAudioSrc(localAudioUrl);
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
        onChange={handleFileChange}
        className="border-2 border-indigo-200 p-2 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition"
        disabled={loading}
      />
      {localAudioUrl && (
        <div className="flex flex-col gap-2 mt-4">
          <audio
            controls
            src={localAudioUrl}
            className="w-full rounded shadow bg-indigo-50"
          />
          <ActionButton type="button" onClick={handleUpload} disabled={loading}>
            <span className="inline-block text-lg">⬆️</span> Upload
          </ActionButton>
        </div>
      )}
    </div>
  );
};
