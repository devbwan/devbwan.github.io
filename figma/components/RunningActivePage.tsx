import { Pause, Square, ChevronDown, Volume2, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RunningActivePageProps {
  onPause: () => void;
  onStop: () => void;
}

export default function RunningActivePage({ onPause, onStop }: RunningActivePageProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [distance, setDistance] = useState(0);

  // Mock timer for demo
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      // Mock distance increase (roughly 10km/h pace)
      setDistance(prev => prev + 0.00278); // km per second at 10km/h
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculatePace = () => {
    if (distance === 0) return '0:00';
    const paceSeconds = (elapsedTime / distance) / 60;
    const mins = Math.floor(paceSeconds);
    const secs = Math.floor((paceSeconds - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Top Bar */}
      <div 
        className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10"
      >
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:opacity-70 transition-opacity">
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
          <div className="w-2 h-2 rounded-full bg-[#FF3B30] animate-pulse" />
          <span className="text-white text-[13px]" style={{ fontWeight: 600 }}>
            러닝 중
          </span>
        </div>
        <button className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 active:opacity-70 transition-opacity">
          <Lock className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Google Maps Area - Placeholder */}
      <div 
        className="w-full h-[45vh] bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] flex items-center justify-center relative"
        style={{
          boxShadow: 'inset 0 -20px 40px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#0A84FF]/20 flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 rounded-full bg-[#0A84FF]" />
          </div>
          <p className="text-[#8E8E93] text-[14px]" style={{ fontWeight: 500 }}>
            Google Maps 영역
          </p>
        </div>

        {/* Route Info Overlay */}
        <div 
          className="absolute top-20 left-4 right-4 bg-black/60 backdrop-blur-xl rounded-[16px] p-4 border border-white/10"
          style={{
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)'
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[#8E8E93] text-[11px] mb-1" style={{ fontWeight: 500 }}>
                현재 위치
              </div>
              <div className="text-white text-[14px]" style={{ fontWeight: 600 }}>
                서울시 강남구
              </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center active:opacity-70 transition-opacity">
              <Volume2 className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="flex-1 px-6 py-8 bg-gradient-to-b from-[#0A0A0A] to-[#0A0A0A]">
        {/* Main Stats */}
        <div className="mb-8">
          {/* Primary Stat - Time */}
          <div className="text-center mb-8">
            <div className="text-[#8E8E93] text-[13px] mb-2" style={{ fontWeight: 500 }}>
              경과 시간
            </div>
            <div 
              className="text-white text-[64px] tracking-[-0.02em] leading-none"
              style={{ fontWeight: 800 }}
            >
              {formatTime(elapsedTime)}
            </div>
          </div>

          {/* Secondary Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Distance */}
            <div 
              className="bg-[#1C1C1E] rounded-[20px] p-5 text-center"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="text-[#8E8E93] text-[12px] mb-2" style={{ fontWeight: 500 }}>
                거리
              </div>
              <div className="text-white text-[32px] tracking-[-0.01em] mb-1" style={{ fontWeight: 800 }}>
                {distance.toFixed(2)}
              </div>
              <div className="text-[#6A6F80] text-[13px]">km</div>
            </div>

            {/* Pace */}
            <div 
              className="bg-[#1C1C1E] rounded-[20px] p-5 text-center"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="text-[#8E8E93] text-[12px] mb-2" style={{ fontWeight: 500 }}>
                평균 페이스
              </div>
              <div className="text-white text-[32px] tracking-[-0.01em] mb-1" style={{ fontWeight: 800 }}>
                {calculatePace()}
              </div>
              <div className="text-[#6A6F80] text-[13px]">/km</div>
            </div>
          </div>
        </div>

        {/* Additional Stats */}
        <div 
          className="w-full bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-[16px] p-4"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-[#8E8E93] text-[11px] mb-1">칼로리</div>
              <div className="text-white text-[16px]" style={{ fontWeight: 700 }}>
                {Math.floor(distance * 62)}
              </div>
            </div>
            <div>
              <div className="text-[#8E8E93] text-[11px] mb-1">평균 BPM</div>
              <div className="text-white text-[16px]" style={{ fontWeight: 700 }}>
                142
              </div>
            </div>
            <div>
              <div className="text-[#8E8E93] text-[11px] mb-1">고도</div>
              <div className="text-white text-[16px]" style={{ fontWeight: 700 }}>
                24m
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div 
        className="px-6 pb-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent"
        style={{
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))'
        }}
      >
        <div className="flex gap-4">
          {/* Pause Button */}
          <button
            onClick={onPause}
            className="flex-1 bg-gradient-to-r from-[#FFD700] to-[#FFA500] rounded-[20px] py-5 flex items-center justify-center gap-3 active:opacity-90 transition-opacity"
            style={{
              boxShadow: '0 8px 24px rgba(255, 215, 0, 0.4)'
            }}
          >
            <Pause className="w-6 h-6 text-[#0A0A0A]" fill="#0A0A0A" />
            <span className="text-[#0A0A0A] text-[18px] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
              일시정지
            </span>
          </button>

          {/* Stop Button */}
          <button
            onClick={onStop}
            className="w-16 h-16 bg-[#1C1C1E] rounded-[20px] flex items-center justify-center border border-[#2C2C2E] active:opacity-70 transition-opacity"
            style={{
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <Square className="w-6 h-6 text-[#FF3B30]" />
          </button>
        </div>
      </div>
    </div>
  );
}
