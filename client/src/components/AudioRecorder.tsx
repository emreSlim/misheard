import React from 'react';

interface AudioRecorderProps {
  recording: boolean;
  recordedBlob: Blob | null;
  audioSrc: string | null;
  loading: boolean;
  onStart: () => void;
  onStop: () => void;
  onUpload: () => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  recording,
  recordedBlob,
  audioSrc,
  loading,
  onStart,
  onStop,
  onUpload,
}) => (
  <div className="mb-6">
    <label className="block mb-2 font-semibold">Record Audio</label>
    <div className="flex flex-col items-center gap-2">
      {!recording && (
        <button
          type="button"
          onClick={onStart}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          Start Recording
        </button>
      )}
      {recording && (
        <button
          type="button"
          onClick={onStop}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Stop Recording
        </button>
      )}
      {recordedBlob && !recording && (
        <>
          <audio controls src={audioSrc || undefined} className="w-full" />
          <button
            type="button"
            onClick={onUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mt-2"
            disabled={loading}
          >
            Upload Recording
          </button>
        </>
      )}
    </div>
  </div>
);
