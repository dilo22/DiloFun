import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function GameStats({ attemptsLeft, digits, onReset }) {
  return (
    <div className="mb-6 flex gap-4">
      

      <button
        onClick={onReset}
        className="flex w-14 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-600/20 transition-colors hover:bg-purple-500"
      >
        <RotateCcw className="h-6 w-6" />
      </button>
    </div>
  );
}