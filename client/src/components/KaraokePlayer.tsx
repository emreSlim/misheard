import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export interface KaraokePlayerProps {
  audioSrc: string;
  lyrics: { start: number; end: number; text: string }[];
}

export const KaraokePlayer = ({ audioSrc, lyrics }: KaraokePlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [current, setCurrent] = useState('');

  useEffect(() => {
    const audio = audioRef.current;
    const interval = setInterval(() => {
      console.log('Checking current time...');
      let time = audio?.currentTime;

      if (time === undefined || !lyrics.length) return;
      time *= 1000; // Convert to milliseconds
      const word = lyrics.find(
        (word) => time >= word.start && time <= word.end
      );
      if (word && word.text !== current) {
        setCurrent(word.text);
        console.log(`Current word: ${word.text}`);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [lyrics, current]);

  return (
    <div className="flex flex-col items-center gap-4">
      <audio controls ref={audioRef} src={audioSrc}></audio>
      <motion.div
        key={current}
        className="text-4xl font-bold text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {current}
      </motion.div>
    </div>
  );
};
