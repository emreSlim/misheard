import React, { useRef, useState } from 'react';
import { useMisheard } from './MisheardContext';

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
    const formData = new FormData();
    formData.append('audio', recordedBlob, 'recording.webm');
    formData.append('level', level.toString());
    const res = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setLyrics(data);
    setLoading(false);
  };

  return (
    <div className="mb-6">
      <label className="block mb-2 font-semibold">Record Audio</label>
      <div className="flex flex-col items-center gap-2">
        {!recording && (
          <button
            type="button"
            onClick={handleStartRecording}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            disabled={loading}
          >
            Start Recording
          </button>
        )}
        {recording && (
          <button
            type="button"
            onClick={handleStopRecording}
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
              onClick={handleUploadRecording}
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
};
