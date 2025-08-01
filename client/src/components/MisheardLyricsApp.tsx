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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-4 px-1 sm:py-8 sm:px-2">
      <div className="w-full max-w-5xl bg-white/90 shadow-2xl rounded-3xl p-2 sm:p-6 md:p-8 border border-indigo-100">
        <div className="flex flex-col gap-2">
          {/* Card header: Title left, LevelSlider right */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
            <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-2 drop-shadow-sm">
              <span role="img" aria-label="music">🎵</span> Misheard Lyrics Captioner
            </h1>
            <div className="flex justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
              <LevelSlider />
            </div>
          </div>
          <div className="flex flex-col-reverse md:flex-row gap-6 md:gap-4 items-stretch">
            {/* Left: Inputs (on mobile, below player) */}
            <div className="w-full md:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
              {/* Inputs in a common container with OR separators */}
              <div className="bg-indigo-50 rounded-2xl p-6 shadow-md border border-indigo-100 flex flex-col gap-2">
                <AudioRecorder />
                <div className="flex items-center my-1">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-400 font-bold tracking-widest text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <AudioUploader />
                <div className="flex items-center my-1">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="mx-2 text-gray-400 font-bold tracking-widest text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <YoutubeInput />
              </div>
              {/* Loading Indicator */}
              {loading && <p className="text-lg font-semibold text-indigo-700 mt-6 animate-pulse">Processing... 🎤</p>}
            </div>
            {/* Right: Karaoke Player or Loader (on mobile, above inputs) */}
            <div className="w-full md:w-1/2 flex items-center justify-center min-h-[200px]">
              {loading ? (
                <Loader />
              ) : !lyrics ? (
                <div className="w-full max-w-xl flex flex-col items-center justify-center gap-6 p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl shadow-2xl border border-indigo-200 min-h-[180px]">
                  <span className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-lg text-center text-indigo-400 select-none">
                    Let the music play!<br className="hidden md:block" /> Upload, record, or paste a YouTube link to start your karaoke journey 🎤
                  </span>
                </div>
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
