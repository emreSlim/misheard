import React, { useRef, useState } from 'react';
import { useMisheard } from './MisheardContext';
import { uploadAudio } from '../services/audioUploadService';

export const AudioRecorder: React.FC = () => {
  const {
    audioSrc,
    setAudioSrc,
    loading,
    setLoading,
    level,
    setLyrics,
  } = useMisheard();

  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleStartRecording = async () => {
    setRecordedBlob(null);
    setAudioSrc(null);
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
        setAudioSrc(URL.createObjectURL(blob));
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
    setAudioSrc(URL.createObjectURL(recordedBlob));
    const data = await uploadAudio({ audio: recordedBlob, level });
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
        {recordedBlob && !recording && (
          <div className="w-full flex flex-col items-center gap-2 mt-2">
            <audio controls src={audioSrc || undefined} className="w-full rounded shadow" />
            <button
              type="button"
              onClick={handleUploadRecording}
              className="bg-blue-600 text-white px-6 py-2 rounded-full shadow hover:bg-blue-700 transition font-semibold mt-1 flex items-center gap-2"
              disabled={loading}
            >
              <span className="inline-block text-lg">⬆️</span> Upload Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
