import React, { createContext, useContext, useState } from 'react';

export interface Lyric {
  start: number;
  end: number;
  text: string;
}

interface MisheardContextType {
  lyrics: Lyric[] | undefined;
  setLyrics: React.Dispatch<React.SetStateAction<Lyric[] | undefined>>;
  audioSrc: string | null;
  setAudioSrc: React.Dispatch<React.SetStateAction<string | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
}

const MisheardContext = createContext<MisheardContextType | undefined>(
  undefined
);

export const useMisheard = () => {
  const ctx = useContext(MisheardContext);
  if (!ctx) throw new Error('useMisheard must be used within MisheardProvider');
  return ctx;
};

export const MisheardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [lyrics, setLyrics] = useState<Lyric[]>();
  const [audioSrc, _setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(2);

  const setAudioSrc: typeof _setAudioSrc = (src) => {
    setLyrics(undefined);
    _setAudioSrc(src);
  };

  return (
    <MisheardContext.Provider
      value={{
        lyrics,
        setLyrics,
        audioSrc,
        setAudioSrc,
        loading,
        setLoading,
        level,
        setLevel,
      }}
    >
      {children}
    </MisheardContext.Provider>
  );
};
