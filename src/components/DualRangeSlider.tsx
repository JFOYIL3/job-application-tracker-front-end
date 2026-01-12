import React, { useState, useRef, useEffect, useCallback } from 'react';

interface DualRangeSliderProps {
  min: number;
  max: number;
  lowValue: number;
  highValue: number;
  onChange: (low: number, high: number) => void;
  disabled?: boolean;
  step?: number;
  formatValue?: (value: number) => string;
}

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
  min,
  max,
  lowValue,
  highValue,
  onChange,
  disabled = false,
  step = 1000,
  formatValue = (value) => value.toLocaleString(),
}) => {
  const [isDragging, setIsDragging] = useState<'low' | 'high' | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<'low' | 'high' | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const currentLowRef = useRef(lowValue);
  const currentHighRef = useRef(highValue);

  useEffect(() => {
    currentLowRef.current = lowValue;
    currentHighRef.current = highValue;
  }, [lowValue, highValue]);

  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100;
  };

  const handleMouseDown = (type: 'low' | 'high') => {
    if (disabled) return;
    setIsDragging(type);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const value = Math.round((percentage / 100) * (max - min) + min);
    const steppedValue = Math.round(value / step) * step;

    if (isDragging === 'low') {
      const newLow = Math.max(min, Math.min(steppedValue, currentHighRef.current - step));
      onChange(newLow, currentHighRef.current);
    } else {
      const newHigh = Math.min(max, Math.max(steppedValue, currentLowRef.current + step));
      onChange(currentLowRef.current, newHigh);
    }
  }, [isDragging, min, max, step, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
    setHoveredHandle(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const lowPercentage = getPercentage(lowValue);
  const highPercentage = getPercentage(highValue);

  return (
    <div className="w-full">
      <div
        ref={sliderRef}
        className="relative h-6 w-full cursor-pointer"
        onMouseDown={(e) => {
          if (disabled) return;
          const rect = sliderRef.current?.getBoundingClientRect();
          if (!rect) return;
          const x = e.clientX - rect.left;
          const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
          const value = Math.round((percentage / 100) * (max - min) + min);
          const steppedValue = Math.round(value / step) * step;

          const lowDistance = Math.abs(steppedValue - lowValue);
          const highDistance = Math.abs(steppedValue - highValue);

          if (lowDistance < highDistance) {
            const newLow = Math.max(min, Math.min(steppedValue, highValue - step));
            onChange(newLow, highValue);
            setIsDragging('low');
          } else {
            const newHigh = Math.min(max, Math.max(steppedValue, lowValue + step));
            onChange(lowValue, newHigh);
            setIsDragging('high');
          }
        }}
      >
        {/* Track background */}
        <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded-full transform -translate-y-1/2" />
        
        {/* Active range */}
        <div
          className="absolute top-1/2 h-2 bg-blue-500 rounded-full transform -translate-y-1/2"
          style={{
            left: `${lowPercentage}%`,
            width: `${highPercentage - lowPercentage}%`,
          }}
        />

        {/* Low handle */}
        <div
          className={`absolute top-1/2 w-5 h-5 bg-blue-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing shadow-md transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          style={{ left: `${lowPercentage}%` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown('low');
          }}
          onMouseEnter={() => setHoveredHandle('low')}
          onMouseLeave={() => !isDragging && setHoveredHandle(null)}
        >
          {(isDragging === 'low' || hoveredHandle === 'low') && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              ${formatValue(lowValue)}
            </div>
          )}
        </div>

        {/* High handle */}
        <div
          className={`absolute top-1/2 w-5 h-5 bg-blue-600 rounded-full transform -translate-y-1/2 -translate-x-1/2 cursor-grab active:cursor-grabbing shadow-md transition-colors ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
          style={{ left: `${highPercentage}%` }}
          onMouseDown={(e) => {
            e.stopPropagation();
            handleMouseDown('high');
          }}
          onMouseEnter={() => setHoveredHandle('high')}
          onMouseLeave={() => !isDragging && setHoveredHandle(null)}
        >
          {(isDragging === 'high' || hoveredHandle === 'high') && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              ${formatValue(highValue)}
            </div>
          )}
        </div>
      </div>

      {/* Min/Max labels */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>${formatValue(min)}</span>
        <span>${formatValue(max)}</span>
      </div>
    </div>
  );
};

export default DualRangeSlider;
