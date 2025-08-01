import React from 'react';
import { useMisheard } from './MisheardContext';

export const LevelSlider: React.FC = () => {
  const { level, setLevel } = useMisheard();
  return (
    <div className="bg-indigo-50 rounded-xl p-1 shadow border border-indigo-100 flex flex-col items-center w-full max-w-xs">
      <label htmlFor="level-slider" className="mb-0.5 text-sm font-semibold text-indigo-700 flex items-center gap-0.5 w-full justify-between">
        <span className="flex items-center gap-0.5">
          <span className="inline-block text-lg">🎚️</span>
          <span className="tracking-wide text-xs">Mishearing Level</span>
        </span>
        <span className="text-indigo-900 font-mono text-sm bg-indigo-100 rounded px-1 py-0 shadow border border-indigo-200">
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
        className="w-full accent-indigo-600 h-1.5 rounded-lg appearance-none bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition slider-thumb"
        style={{ boxShadow: '0 1px 4px 0 rgba(99,102,241,0.08)' }}
      />
      <div className="flex justify-between text-[10px] text-gray-500 mt-0 font-mono w-full px-0.5">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};
