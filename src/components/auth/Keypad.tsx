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
    ['0'] // Only 0 in the last row, centered
  ];

  return (
    <div className="w-full max-w-[240px] mx-auto">
      {/* First three rows */}
      <div className="grid grid-cols-3 gap-5 mb-5">
        {keys.slice(0, 3).flat().map((key) => (
          <button
            key={key}
            onClick={() => onKeyPress(key)}
            className="w-16 h-16 flex items-center justify-center text-2xl font-normal text-gray-800 
                     hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 rounded-lg"
          >
            {key}
          </button>
        ))}
      </div>
      
      {/* Last row with only 0 in center */}
      <div className="grid grid-cols-3 gap-5">
        <div></div> {/* Empty space */}
        <button
          onClick={() => onKeyPress('0')}
          className="w-16 h-16 flex items-center justify-center text-2xl font-normal text-gray-800 
                   hover:bg-gray-100 active:bg-gray-200 transition-colors duration-150 rounded-lg"
        >
          0
        </button>
        <div></div> {/* Empty space */}
      </div>
    </div>
  );
};

export default Keypad;