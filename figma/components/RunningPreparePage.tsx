import { Target, Clock, Infinity, Headphones, MessageSquare, ChevronRight, Play } from 'lucide-react';

interface RunningPreparePageProps {
  onStartRunning: () => void;
  onBack: () => void;
}

export default function RunningPreparePage({ onStartRunning, onBack }: RunningPreparePageProps) {
  const goals = [
    { id: 'distance', label: '거리 목표', value: '5.0 km', icon: Target, color: 'from-[#0A84FF] to-[#0066CC]' },
    { id: 'time', label: '시간 목표', value: '30분', icon: Clock, color: 'from-[#FF6B6B] to-[#FF8E53]' },
    { id: 'free', label: '자유 러닝', value: '목표 없이', icon: Infinity, color: 'from-[#4CAF50] to-[#66BB6A]' },
  ];

  const settings = [
    { label: '음악', value: 'Spotify 재생목록', icon: Headphones },
    { label: '음성 코칭', value: '1km마다', icon: MessageSquare },
  ];

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Header */}
      <div className="p-6 pb-4">
        <button 
          onClick={onBack}
          className="text-[#0A84FF] text-[16px] mb-4 active:opacity-70 transition-opacity"
          style={{ fontWeight: 600 }}
        >
          &lt; 취소
        </button>
        <h1 
          className="text-[32px] text-white tracking-[-0.02em]"
          style={{ fontWeight: 800 }}
        >
          러닝 준비
        </h1>
        <p className="text-[#8E8E93] text-[15px] mt-2">
          목표를 설정하고 러닝을 시작하세요
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-auto px-6 pb-32">
        {/* Goal Selection */}
        <div className="mb-8">
          <h2 
            className="text-[18px] text-white mb-4 tracking-[-0.01em]"
            style={{ fontWeight: 600 }}
          >
            오늘의 목표
          </h2>
          <div className="flex flex-col gap-3">
            {goals.map((goal) => {
              const Icon = goal.icon;
              return (
                <button
                  key={goal.id}
                  className="w-full bg-[#1C1C1E] rounded-[20px] p-5 flex items-center gap-4 active:opacity-80 transition-opacity"
                  style={{
                    border: '1px solid #2C2C2E',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${goal.color} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white text-[16px] mb-1" style={{ fontWeight: 600 }}>
                      {goal.label}
                    </div>
                    <div className="text-[#8E8E93] text-[14px]">
                      {goal.value}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6A6F80]" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="mb-8">
          <h2 
            className="text-[18px] text-white mb-4 tracking-[-0.01em]"
            style={{ fontWeight: 600 }}
          >
            러닝 설정
          </h2>
          <div 
            className="w-full bg-[#1C1C1E] rounded-[20px] overflow-hidden"
            style={{
              border: '1px solid #2C2C2E',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            {settings.map((setting, index) => {
              const Icon = setting.icon;
              return (
                <button
                  key={index}
                  className="w-full p-5 flex items-center gap-4 active:bg-[#2C2C2E] transition-colors"
                  style={{
                    borderBottom: index < settings.length - 1 ? '1px solid #2C2C2E' : 'none'
                  }}
                >
                  <div className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#8E8E93]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-white text-[15px] mb-1" style={{ fontWeight: 500 }}>
                      {setting.label}
                    </div>
                    <div className="text-[#8E8E93] text-[13px]">
                      {setting.value}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#6A6F80]" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Preview */}
        <div 
          className="w-full bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] rounded-[20px] p-5"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="text-[#8E8E93] text-[13px] mb-3" style={{ fontWeight: 500 }}>
            지난 러닝 평균
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-white text-[20px]" style={{ fontWeight: 700 }}>
                5.2km
              </div>
              <div className="text-[#6A6F80] text-[11px]">거리</div>
            </div>
            <div>
              <div className="text-white text-[20px]" style={{ fontWeight: 700 }}>
                31:24
              </div>
              <div className="text-[#6A6F80] text-[11px]">시간</div>
            </div>
            <div>
              <div className="text-white text-[20px]" style={{ fontWeight: 700 }}>
                6&apos;02&quot;
              </div>
              <div className="text-[#6A6F80] text-[11px]">페이스</div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Button */}
      <div 
        className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent"
        style={{
          paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))'
        }}
      >
        <button
          onClick={onStartRunning}
          className="w-full bg-gradient-to-r from-[#0A84FF] to-[#0066CC] rounded-[20px] py-5 flex items-center justify-center gap-3 active:opacity-90 transition-opacity"
          style={{
            boxShadow: '0 12px 32px rgba(10, 132, 255, 0.6)'
          }}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <Play className="w-7 h-7 text-white" fill="white" />
          </div>
          <span className="text-white text-[22px] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
            러닝 시작하기
          </span>
        </button>
      </div>
    </div>
  );
}