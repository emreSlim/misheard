
import React, { useRef, useState } from 'react';
import { useMisheard } from './MisheardContext';
import { uploadAudio } from '../services/audioUploadService';
import { ActionButton } from './ActionButton';


export const AudioRecorder: React.FC = () => {
  const {
    setAudioSrc,
    loading,
    setLoading,
    level,
    setLyrics,
  } = useMisheard();

  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [localAudioUrl, setLocalAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setRecordedBlob(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setLocalAudioUrl(url);
      };
      mediaRecorder.start();
      setRecording(true);
    } catch (err: unknown) {
      console.error(err);
      alert('Microphone access denied or not available.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const handleUploadRecording = async () => {
    if (!recordedBlob) return;
    setLoading(true);
    const data = await uploadAudio({ audio: recordedBlob, level });
    setAudioSrc(localAudioUrl || '');
    setLyrics(data);
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <label className="block mb-3 text-lg font-semibold text-indigo-700 flex items-center gap-2">
        <span className="inline-block text-2xl">🎤</span> Record Audio
      </label>
      <div className="flex flex-col items-center gap-3">
        {!recording && (
          <button
            type="button"
            onClick={handleStartRecording}
            className="bg-green-500 text-white px-6 py-2 rounded-full shadow hover:bg-green-600 transition font-semibold flex items-center gap-2"
            disabled={loading}
          >
            <span className="inline-block text-lg">●</span> Start Recording
          </button>
        )}
        {recording && (
          <button
            type="button"
            onClick={handleStopRecording}
            className="bg-red-500 text-white px-6 py-2 rounded-full shadow hover:bg-red-600 transition font-semibold flex items-center gap-2 animate-pulse"
          >
            <span className="inline-block text-lg">■</span> Stop Recording
          </button>
        )}
        {localAudioUrl && recordedBlob && !recording && (
          <div className="w-full flex flex-col items-center gap-2 mt-2">
            <audio controls src={localAudioUrl} className="w-full rounded shadow" />
            <ActionButton type="button" onClick={handleUploadRecording} disabled={loading} className="mt-1">
              <span className="inline-block text-lg">⬆️</span> Upload Recording
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};
