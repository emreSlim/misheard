// Loader component
const Loader = () => (
  <div className="w-full max-w-xl flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl shadow-2xl border border-indigo-200 min-h-[180px]">
    <div className="flex flex-col items-center gap-2">
      <svg className="animate-spin h-10 w-10 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
      </svg>
      <span className="text-lg font-semibold text-indigo-700 mt-2">Processing... 🎤</span>
    </div>
  </div>
);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-5xl bg-white/90 shadow-2xl rounded-3xl p-8 border border-indigo-100">
        <div className="flex flex-col gap-4">
          {/* Card header: Title left, LevelSlider right */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
            <div className="flex flex-col">
              <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-2 drop-shadow-sm">
                <span role="img" aria-label="music">🎵</span> Misheard Lyrics Captioner
              </h1>
              <p className="mt-1 text-base text-indigo-500 font-medium max-w-xl">
                Instantly generate karaoke-style captions for your music by recording, uploading, or pasting a YouTube link. Perfect for discovering and sharing those hilarious misheard lyrics!
              </p>
            </div>
            <div className="md:ml-auto md:mt-0 mt-2"><LevelSlider /></div>
          </div>
          <div className="flex flex-col md:flex-row gap-8 items-stretch">
            {/* Left: Inputs */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              {/* Inputs in a common container with OR separators */}
              <div className="bg-indigo-50 rounded-2xl p-6 shadow-md border border-indigo-100 flex flex-col gap-6">
                <AudioRecorder />
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-400 font-bold tracking-widest">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <AudioUploader />
                <div className="flex items-center my-2">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-4 text-gray-400 font-bold tracking-widest">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <YoutubeInput />
              </div>
              {/* Loading Indicator */}
              {loading && <p className="text-lg font-semibold text-indigo-700 mt-6 animate-pulse">Processing... 🎤</p>}
            </div>
            {/* Right: Karaoke Player or Loader (inside the same card) */}
            <div className="w-full md:w-1/2 flex items-center justify-center">
              {loading ? (
                <Loader />
              ) : (
                audioSrc && lyrics && <KaraokePlayer audioSrc={audioSrc} lyrics={lyrics} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
