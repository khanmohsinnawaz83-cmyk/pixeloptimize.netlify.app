
import React from 'react';

interface AdPlaceholderProps {
  slot?: string;
  className?: string;
}

const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot = "general", className = "" }) => {
  return (
    <div className={`w-full bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center p-4 min-h-[100px] overflow-hidden ${className}`}>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Advertisement</p>
        <p className="text-[10px] text-gray-300">AdSense Slot: {slot}</p>
      </div>
    </div>
  );
};

export default AdPlaceholder;
