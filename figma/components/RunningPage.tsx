import { Activity, Calendar, TrendingUp, Trophy, Flame, Target } from 'lucide-react';

export default function RunningPage() {
  const recentRuns = [
    { date: '2024.12.08', distance: '5.41 km', time: '32:15', pace: '5\'57"' },
    { date: '2024.12.06', distance: '7.20 km', time: '42:30', pace: '5\'54"' },
    { date: '2024.12.05', distance: '4.10 km', time: '25:18', pace: '6\'10"' },
    { date: '2024.12.03', distance: '8.50 km', time: '48:45', pace: '5\'44"' },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 
          className="text-[32px] text-white tracking-[-0.02em]"
          style={{ fontWeight: 800 }}
        >
          러닝 기록
        </h1>
        <button className="px-4 py-2 bg-[#0A84FF] text-white rounded-full text-[14px]" style={{ fontWeight: 600 }}>
          필터
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div 
          className="bg-[#1C1C1E] rounded-[16px] p-4 flex flex-col items-center"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center mb-2">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="text-[20px] text-white" style={{ fontWeight: 800 }}>42</span>
          <span className="text-[11px] text-[#8E8E93]" style={{ fontWeight: 500 }}>이번 달</span>
        </div>

        <div 
          className="bg-[#1C1C1E] rounded-[16px] p-4 flex flex-col items-center"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center mb-2">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-[20px] text-white" style={{ fontWeight: 800 }}>152</span>
          <span className="text-[11px] text-[#8E8E93]" style={{ fontWeight: 500 }}>전체</span>
        </div>

        <div 
          className="bg-[#1C1C1E] rounded-[16px] p-4 flex flex-col items-center"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex items-center justify-center mb-2">
            <Target className="w-5 h-5 text-white" />
          </div>
          <span className="text-[20px] text-white" style={{ fontWeight: 800 }}>68%</span>
          <span className="text-[11px] text-[#8E8E93]" style={{ fontWeight: 500 }}>목표</span>
        </div>
      </div>

      {/* This Week */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            이번 주
          </h2>
          <TrendingUp className="w-5 h-5 text-[#4CAF50]" />
        </div>

        <div 
          className="w-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] rounded-[20px] p-5"
          style={{
            boxShadow: '0 8px 24px rgba(10, 132, 255, 0.4)'
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <span className="text-white/80 text-[14px]">총 거리</span>
              <div className="text-white text-[32px] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
                17.1 km
              </div>
            </div>
            <div className="text-right">
              <span className="text-white/80 text-[14px]">총 시간</span>
              <div className="text-white text-[24px]" style={{ fontWeight: 700 }}>
                1:40:08
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-white" />
            <span className="text-white text-[14px]">평균 페이스: 5&apos;52&quot;/km</span>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-5 h-5 text-white" />
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            최근 활동
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {recentRuns.map((run, index) => (
            <div 
              key={index}
              className="w-full bg-[#1C1C1E] rounded-[16px] p-4"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] text-[#8E8E93]" style={{ fontWeight: 500 }}>
                  {run.date}
                </span>
                <div className="px-3 py-1 bg-[#0A84FF]/20 rounded-full">
                  <span className="text-[12px] text-[#0A84FF]" style={{ fontWeight: 600 }}>
                    러닝
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] text-[#8E8E93]">거리</span>
                  <div className="text-[18px] text-white" style={{ fontWeight: 700 }}>
                    {run.distance}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8E8E93]">시간</span>
                  <div className="text-[18px] text-white" style={{ fontWeight: 700 }}>
                    {run.time}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-[#8E8E93]">페이스</span>
                  <div className="text-[18px] text-white" style={{ fontWeight: 700 }}>
                    {run.pace}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
