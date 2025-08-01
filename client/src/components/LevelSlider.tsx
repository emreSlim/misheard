import React from 'react';
import { useMisheard } from './MisheardContext';

export const LevelSlider: React.FC = () => {
  const { level, setLevel } = useMisheard();
  return (
    <div className="mb-6">
      <label htmlFor="level-slider" className="block mb-2 font-semibold">
        Level: <span className="font-mono">{level}</span>
      </label>
      <input
        id="level-slider"
        type="range"
        min={1}
        max={10}
        value={level}
        onChange={e => setLevel(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
};
