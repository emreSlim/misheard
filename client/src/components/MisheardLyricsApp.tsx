// No local state needed; all state is in context

import { KaraokePlayer } from './KaraokePlayer';
import { AudioRecorder } from './AudioRecorder';
import { AudioUploader } from './AudioUploader';
import { YoutubeInput } from './YoutubeInput';
import { LevelSlider } from './LevelSlider';
import { MisheardProvider, useMisheard } from './MisheardContext';

export const MisheardLyricsApp = () => {
  return (
    <MisheardProvider>
      <InnerMisheardLyricsApp />
    </MisheardProvider>
  );
};

const InnerMisheardLyricsApp = () => {
  const { audioSrc, loading, lyrics } = useMisheard();
  return (
    <div className="max-w-lg mx-auto p-4 text-center">
      <h1 className="text-3xl font-bold mb-4">🎵 Misheard Lyrics Captioner</h1>
      {/* Audio Recording */}
      <AudioRecorder />
      {/* Level Slider */}
      <LevelSlider />
      {/* File Upload */}
      <AudioUploader />
      {/* OR Separator */}
      <div className="my-4 text-gray-500">— OR —</div>
      {/* YouTube URL */}
      <YoutubeInput />
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
