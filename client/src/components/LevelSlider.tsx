import React from 'react';
import { useMisheard } from './MisheardContext';

export const LevelSlider: React.FC = () => {
  const { level, setLevel } = useMisheard();
  return (
    <div className="bg-indigo-50 rounded-2xl p-4 shadow-md border border-indigo-100 flex flex-col items-center w-full max-w-xs">
      <label htmlFor="level-slider" className="mb-2 text-lg font-semibold text-indigo-700 flex items-center gap-2 w-full justify-between">
        <span className="flex items-center gap-2">
          <span className="inline-block text-2xl">🎚️</span>
          <span className="tracking-wide">Mishearing Level</span>
        </span>
        <span className="text-indigo-900 font-mono text-xl bg-indigo-100 rounded px-3 py-1 shadow border border-indigo-200">
          {level}
        </span>
      </label>
      <input
        id="level-slider"
        type="range"
        min={1}
        max={10}
        value={level}
        onChange={e => setLevel(Number(e.target.value))}
        className="w-full accent-indigo-600 h-3 rounded-lg appearance-none bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition slider-thumb"
        style={{ boxShadow: '0 2px 8px 0 rgba(99,102,241,0.10)' }}
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1 font-mono w-full px-1">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};
