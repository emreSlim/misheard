import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface KaraokePlayerProps {
  audioSrc: string;
  lyrics: { start: number; end: number; text: string }[];
}

export const KaraokePlayer = ({ audioSrc, lyrics }: KaraokePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState('');
  const currentRef = useRef('');

  useEffect(() => {
    currentRef.current = current;
  }, [current]);

  useEffect(() => {
    let rafId: number;
    const audio = audioRef.current;
    if (!audio) return;

    const render = () => {
      if (!audio.paused && !audio.ended) {
        let time = audio.currentTime;
        if (lyrics.length) {
          time *= 1000; // Convert to milliseconds
          const word = lyrics.find(
            (word) => time >= word.start && time <= word.end
          );
          if (word && word.text !== currentRef.current) {
            setCurrent(word.text);
            currentRef.current = word.text;
          }
        }
        rafId = requestAnimationFrame(render);
      }
    };

    const startLoop = () => {
      rafId = requestAnimationFrame(render);
    };
    const stopLoop = () => {
      cancelAnimationFrame(rafId);
    };

    audio.addEventListener('play', startLoop);
    audio.addEventListener('pause', stopLoop);
    audio.addEventListener('ended', stopLoop);

    // If already playing on mount, start loop
    if (!audio.paused && !audio.ended) {
      startLoop();
    }

    return () => {
      stopLoop();
      audio.removeEventListener('play', startLoop);
      audio.removeEventListener('pause', stopLoop);
      audio.removeEventListener('ended', stopLoop);
    };
  }, [lyrics]);

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-6 p-6 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-3xl shadow-2xl border border-indigo-200">
      <audio controls ref={audioRef}
       src={audioSrc} className="w-full rounded shadow bg-indigo-50" />
      <motion.div
        key={current}
        className="w-full min-h-[90px] md:min-h-[120px] flex items-center justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <span className="text-3xl md:text-5xl font-extrabold tracking-wide drop-shadow-lg text-center text-indigo-800 animate-pulse select-none">
          {current || <span className="text-indigo-300">…</span>}
        </span>
      </motion.div>
    </div>
  );
};
