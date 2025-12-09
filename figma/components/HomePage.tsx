import { Clock, Zap, TrendingUp, MapPin, Award, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A]">
      {/* Header Row */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" fill="white" />
          </div>
          <h1 
            className="text-[32px] text-white tracking-[-0.02em]"
            style={{ fontWeight: 800 }}
          >
            RunWave
          </h1>
        </div>
        <div 
          className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53]"
          style={{
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
      </div>

      {/* Hero Card with Map/Image */}
      <div 
        className="w-full h-[180px] rounded-[24px] overflow-hidden relative"
        style={{
          boxShadow: '0 12px 32px rgba(10, 132, 255, 0.3)'
        }}
      >
        <img 
          src="https://images.unsplash.com/photo-1717406362477-8555b1190a87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwdHJhY2slMjBzdW5zZXR8ZW58MXx8fHwxNzY1MTc4MzgxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Running track"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        />
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-white" />
            <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>
              오늘의 러닝
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-white text-[28px] tracking-[-0.01em]" style={{ fontWeight: 800 }}>
              5.41 km
            </span>
            <span className="text-white/80 text-[14px]">
              완료
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex flex-col">
        <h2 
          className="text-[20px] text-white mb-3 tracking-[-0.01em]" 
          style={{ fontWeight: 600 }}
        >
          오늘의 기록
        </h2>
        
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Time Card */}
          <div 
            className="bg-[#1C1C1E] rounded-[20px] p-4"
            style={{
              border: '1px solid #2C2C2E',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-[#8E8E93]" style={{ fontWeight: 500 }}>
                시간
              </span>
            </div>
            <span className="text-[26px] text-white tracking-[-0.01em]" style={{ fontWeight: 800 }}>
              32:15
            </span>
          </div>

          {/* Pace Card */}
          <div 
            className="bg-[#1C1C1E] rounded-[20px] p-4"
            style={{
              border: '1px solid #2C2C2E',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-[13px] text-[#8E8E93]" style={{ fontWeight: 500 }}>
                평균 페이스
              </span>
            </div>
            <span className="text-[26px] text-white tracking-[-0.01em]" style={{ fontWeight: 800 }}>
              5&apos;57&quot;
            </span>
          </div>
        </div>

        {/* Weekly Goal Progress */}
        <div 
          className="w-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] rounded-[20px] p-5 mt-3"
          style={{
            boxShadow: '0 8px 24px rgba(10, 132, 255, 0.4)'
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-white" />
              <span className="text-white text-[15px]" style={{ fontWeight: 600 }}>
                주간 목표
              </span>
            </div>
            <span className="text-white text-[15px]" style={{ fontWeight: 700 }}>
              68%
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full"
              style={{ width: '68%' }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-white/80 text-[12px]">17km / 25km</span>
            <span className="text-white/80 text-[12px]">8km 남음</span>
          </div>
        </div>
      </div>

      {/* Community Activity Section */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            커뮤니티 활동
          </h2>
          <TrendingUp className="w-5 h-5 text-[#0A84FF]" />
        </div>
        
        {/* Community Card */}
        <div 
          className="w-full bg-[#1C1C1E] rounded-[20px] p-5 flex flex-col gap-4"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Friend Row 1 */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex-shrink-0 flex items-center justify-center text-white"
              style={{ fontWeight: 700 }}
            >
              민
            </div>
            <div className="flex-1">
              <div className="text-[15px] text-white" style={{ fontWeight: 600 }}>
                민지
              </div>
              <div className="text-[13px] text-[#8E8E93]">
                3.1km 러닝 완료
              </div>
            </div>
            <div className="text-[12px] text-[#0A84FF]" style={{ fontWeight: 600 }}>
              1시간 전
            </div>
          </div>

          {/* Friend Row 2 */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex-shrink-0 flex items-center justify-center text-white"
              style={{ fontWeight: 700 }}
            >
              현
            </div>
            <div className="flex-1">
              <div className="text-[15px] text-white" style={{ fontWeight: 600 }}>
                현우
              </div>
              <div className="text-[13px] text-[#8E8E93]">
                4.9km 러닝 완료
              </div>
            </div>
            <div className="text-[12px] text-[#0A84FF]" style={{ fontWeight: 600 }}>
              2시간 전
            </div>
          </div>

          {/* Friend Row 3 */}
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#9C27B0] to-[#BA68C8] flex-shrink-0 flex items-center justify-center text-white"
              style={{ fontWeight: 700 }}
            >
              J
            </div>
            <div className="flex-1">
              <div className="text-[15px] text-white" style={{ fontWeight: 600 }}>
                John
              </div>
              <div className="text-[13px] text-[#8E8E93]">
                2.0km 러닝 완료
              </div>
            </div>
            <div className="text-[12px] text-[#0A84FF]" style={{ fontWeight: 600 }}>
              3시간 전
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
