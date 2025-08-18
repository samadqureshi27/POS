// src/components/auth/Keypad.tsx
import React from 'react';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

const Keypad: React.FC<KeypadProps> = ({ onKeyPress, onBackspace }) => {
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
      {keys.flat().map((key) => (
        <button
          key={key}
          onClick={() => key === '*' ? onBackspace() : onKeyPress(key)}
          className="h-12 w-12 bg-gray-200 hover:bg-gray-300 rounded-lg text-lg font-semibold transition-colors"
        >
          {key === '*' ? '⌫' : key}
        </button>
      ))}
    </div>
  );
};

export default Keypad;