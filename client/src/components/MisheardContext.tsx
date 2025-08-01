import React, { createContext, useContext, useState, useRef } from 'react';

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
  youtubeUrl: string;
  setYoutubeUrl: React.Dispatch<React.SetStateAction<string>>;
  level: number;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  recording: boolean;
  setRecording: React.Dispatch<React.SetStateAction<boolean>>;
  recordedBlob: Blob | null;
  setRecordedBlob: React.Dispatch<React.SetStateAction<Blob | null>>;
  mediaRecorderRef: React.MutableRefObject<MediaRecorder | null>;
  audioChunksRef: React.MutableRefObject<Blob[]>;
}

const MisheardContext = createContext<MisheardContextType | undefined>(undefined);

export const useMisheard = () => {
  const ctx = useContext(MisheardContext);
  if (!ctx) throw new Error('useMisheard must be used within MisheardProvider');
  return ctx;
};

export const MisheardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lyrics, setLyrics] = useState<Lyric[]>();
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [youtubeUrl, setYoutubeUrl] = useState<string>('');
  const [level, setLevel] = useState<number>(2);
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  return (
    <MisheardContext.Provider
      value={{
        lyrics,
        setLyrics,
        audioSrc,
        setAudioSrc,
        loading,
        setLoading,
        youtubeUrl,
        setYoutubeUrl,
        level,
        setLevel,
        recording,
        setRecording,
        recordedBlob,
        setRecordedBlob,
        mediaRecorderRef,
        audioChunksRef,
      }}
    >
      {children}
    </MisheardContext.Provider>
  );
};
