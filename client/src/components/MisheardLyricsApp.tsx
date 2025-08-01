import { useState, useRef } from 'react';

import { KaraokePlayer } from './KaraokePlayer';
import { AudioRecorder } from './AudioRecorder';
import { AudioUploader } from './AudioUploader';
import { YoutubeInput } from './YoutubeInput';

export const MisheardLyricsApp = () => {
  const [lyrics, setLyrics] = useState<{ start: number; end: number; text: string }[]>();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [level, setLevel] = useState<number>(2);
  // Audio recording state
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio Recording Handlers
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (!file) return;

    setLoading(true);
    setAudioSrc(URL.createObjectURL(file)); // Play original file locally

    const formData = new FormData();
    formData.append('audio', file);
    formData.append('level', level.toString());
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
      body: JSON.stringify({
        url: youtubeUrl,
        level,
      }),
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


      {/* Audio Recording */}
      <AudioRecorder
        recording={recording}
        recordedBlob={recordedBlob}
        audioSrc={audioSrc}
        loading={loading}
        onStart={handleStartRecording}
        onStop={handleStopRecording}
        onUpload={handleUploadRecording}
      />

      {/* Level Slider */}
      <div className="mb-6">
        <label htmlFor="level-slider" className="block mb-2 font-semibold">
          Level: <span className="font-mono">{level}</span>
        </label>
        <input
          id="level-slider"
          type="range"
          min={1}
          max={10}
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          className="w-full accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1</span>
          <span>10</span>
        </div>
      </div>


      {/* File Upload */}
      <AudioUploader onFileUpload={handleFileUpload} loading={loading} />

      {/* OR Separator */}
      <div className="my-4 text-gray-500">— OR —</div>


      {/* YouTube URL */}
      <YoutubeInput
        youtubeUrl={youtubeUrl}
        setYoutubeUrl={setYoutubeUrl}
        onSubmit={handleYoutubeSubmit}
        loading={loading}
      />



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
