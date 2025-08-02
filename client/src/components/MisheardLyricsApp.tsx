
import { KaraokePlayer } from './KaraokePlayer';
import { AudioRecorder } from './AudioRecorder';
import { AudioUploader } from './AudioUploader';
import { YoutubeInput } from './YoutubeInput';
import { LevelSlider } from './LevelSlider';
import { MisheardProvider, useMisheard } from './MisheardContext';
import { Loader } from './Loader';
import { OrDivider } from './OrDivider';

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
    <div className="min-h-screen flex items-center justify-center py-4 px-1 sm:py-8 sm:px-2 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-5xl bg-white/90 shadow-2xl rounded-3xl p-2 sm:p-6 md:p-8 border border-indigo-100">
        {/* Card header: Title left, LevelSlider right */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-2">
          <h1 className="text-4xl font-extrabold text-indigo-700 flex items-center gap-2 drop-shadow-sm">
            <span role="img" aria-label="music">
              🎵
            </span>{' '}
            Misheard Lyrics Captioner
          </h1>
          <div className="flex justify-center md:justify-end w-full md:w-auto mt-2 md:mt-0">
            <LevelSlider />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-4 items-stretch">
          {/* Left: Karaoke Player or Loader (on mobile, above inputs) */}
          <div className="w-full md:w-1/2 flex items-center justify-center min-h-[200px]">
            {loading ? (
              <Loader />
            ) : lyrics && audioSrc ? (
              <KaraokePlayer audioSrc={audioSrc} lyrics={lyrics} />
            ) : (
              <div className="w-full max-w-xl flex flex-col items-center justify-center p-4 md:p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl shadow-2xl border border-indigo-200 min-h-[140px] md:min-h-[180px]">
                <span className="text-2xl md:text-3xl font-extrabold tracking-wide drop-shadow-lg text-center text-indigo-400 select-none">
                  Let the music play!
                  <br className="md:block" /> Upload, record, or paste a
                  YouTube link to start your karaoke journey 🎤
                </span>
              </div>
            )}
          </div>
          {/* Right: Inputs (on mobile, below player) */}
          <div className="w-full md:w-1/2 flex flex-col justify-center mt-2 md:mt-0">
            <div className="bg-indigo-50 rounded-2xl p-4 md:p-6 shadow-md border border-indigo-100 flex flex-col gap-2">
              <AudioRecorder />
              <OrDivider />
              <AudioUploader />
              <OrDivider />
              <YoutubeInput />
            </div>
            {loading && (
              <p className="text-lg font-semibold text-indigo-700 mt-4 animate-pulse">
                Processing... 🎤
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
