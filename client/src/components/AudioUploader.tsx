import React from 'react';

interface AudioUploaderProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileUpload, loading }) => (
  <div className="mb-4">
    <label className="block mb-2 font-semibold">Upload Audio File</label>
    <input
      type="file"
      accept="audio/*"
      onChange={onFileUpload}
      className="border p-2 rounded w-full"
      disabled={loading}
    />
  </div>
);
