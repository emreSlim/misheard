import { useState, useRef } from 'react';
import { KaraokePlayer } from './KaraokePlayer';

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
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Upload Audio File</label>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* OR Separator */}
      <div className="my-4 text-gray-500">— OR —</div>

      {/* YouTube URL */}
      <form onSubmit={handleYoutubeSubmit} className="mb-6">
        <label className="block mb-2 font-semibold">YouTube Link</label>
        <input
          type="url"
          placeholder="https://youtube.com/watch?v=..."
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Process Song
        </button>
      </form>



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
