import { User, Settings, Award, TrendingUp, Target, Calendar, Bell, Lock, HelpCircle, LogOut } from 'lucide-react';

interface ProfilePageProps {
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function ProfilePage({ isLoggedIn, onLogin, onLogout }: ProfilePageProps) {
  const stats = [
    { label: '총 거리', value: '487.3 km', icon: TrendingUp, color: 'from-[#0A84FF] to-[#0066CC]' },
    { label: '총 시간', value: '48h 23m', icon: Calendar, color: 'from-[#FF6B6B] to-[#FF8E53]' },
    { label: '달성률', value: '84%', icon: Target, color: 'from-[#4CAF50] to-[#66BB6A]' },
  ];

  const achievements = [
    { name: '첫 러닝', date: '2024.01.15', icon: '🏃' },
    { name: '100km 달성', date: '2024.03.22', icon: '💯' },
    { name: '한 달 챌린지', date: '2024.05.01', icon: '🔥' },
    { name: '10km 최고 기록', date: '2024.06.18', icon: '⚡' },
  ];

  const settings = [
    { label: '알림 설정', icon: Bell },
    { label: '개인정보 보호', icon: Lock },
    { label: '앱 설정', icon: Settings },
    { label: '도움말', icon: HelpCircle },
  ];

  // Guest Mode UI
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A] min-h-full">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <h1 
            className="text-[32px] text-white tracking-[-0.02em]"
            style={{ fontWeight: 800 }}
          >
            내 정보
          </h1>
        </div>

        {/* Guest Card */}
        <div 
          className="w-full bg-[#1C1C1E] rounded-[24px] p-8 flex flex-col items-center justify-center"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
            minHeight: '300px'
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8E8E93] to-[#6A6F80] flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-white text-[24px] mb-2" style={{ fontWeight: 700 }}>
            게스트 모드
          </h2>
          <p className="text-[#8E8E93] text-[15px] text-center mb-6">
            로그인하고 더 많은 기능을 사용해보세요
          </p>
          
          {/* Google Login Button */}
          <button 
            onClick={onLogin}
            className="w-full bg-white rounded-[16px] p-4 flex items-center justify-center gap-3 mb-3 hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
              <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
              <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
              <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
            </svg>
            <span className="text-[#0A0A0A] text-[16px]" style={{ fontWeight: 600 }}>
              Google로 로그인
            </span>
          </button>

          <div className="text-[#6A6F80] text-[13px] text-center">
            로그인 없이 계속 둘러보기
          </div>
        </div>

        {/* Guest Features Info */}
        <div 
          className="w-full bg-[#1C1C1E] rounded-[20px] p-5"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <h3 className="text-white text-[18px] mb-4" style={{ fontWeight: 600 }}>
            로그인하면 이용 가능해요
          </h3>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center flex-shrink-0">
                <Award className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#EBEBF5] text-[15px]">기록 저장 및 통계</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#EBEBF5] text-[15px]">커뮤니티 참여</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#4CAF50] to-[#66BB6A] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-[#EBEBF5] text-[15px]">리더보드 순위</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged In UI
  return (
    <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 
          className="text-[32px] text-white tracking-[-0.02em]"
          style={{ fontWeight: 800 }}
        >
          내 정보
        </h1>
        <button className="w-10 h-10 rounded-full bg-[#1C1C1E] flex items-center justify-center border border-[#2C2C2E]">
          <Settings className="w-5 h-5 text-[#8E8E93]" />
        </button>
      </div>

      {/* Profile Card */}
      <div 
        className="w-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] rounded-[24px] p-6"
        style={{
          boxShadow: '0 12px 32px rgba(10, 132, 255, 0.4)'
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-[24px]"
            style={{ 
              fontWeight: 800,
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
            }}
          >
            김
          </div>
          <div>
            <div className="text-white text-[24px] mb-1" style={{ fontWeight: 700 }}>
              김러너
            </div>
            <div className="text-white/80 text-[14px]">
              러닝 152일째 🔥
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-white" />
          <span className="text-white text-[13px]">
            레벨 12 · 상위 15%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex flex-col">
        <h2 
          className="text-[20px] text-white tracking-[-0.01em] mb-3" 
          style={{ fontWeight: 600 }}
        >
          내 기록
        </h2>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-[#1C1C1E] rounded-[16px] p-4 flex flex-col items-center"
                style={{
                  border: '1px solid #2C2C2E',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
                }}
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[18px] text-white mb-1" style={{ fontWeight: 800 }}>
                  {stat.value}
                </span>
                <span className="text-[11px] text-[#8E8E93] text-center" style={{ fontWeight: 500 }}>
                  {stat.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-5 h-5 text-white" />
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            달성 배지
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <div 
              key={index}
              className="bg-[#1C1C1E] rounded-[16px] p-4 flex flex-col items-center"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="text-[32px] mb-2">{achievement.icon}</div>
              <div className="text-[14px] text-white text-center mb-1" style={{ fontWeight: 600 }}>
                {achievement.name}
              </div>
              <div className="text-[11px] text-[#8E8E93]">
                {achievement.date}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="flex flex-col">
        <h2 
          className="text-[20px] text-white tracking-[-0.01em] mb-3" 
          style={{ fontWeight: 600 }}
        >
          설정
        </h2>

        <div 
          className="w-full bg-[#1C1C1E] rounded-[20px] p-2 flex flex-col"
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
                className="flex items-center gap-3 p-3 rounded-[12px] hover:bg-[#2C2C2E] transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-[#2C2C2E] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#8E8E93]" />
                </div>
                <span className="text-[15px] text-white flex-1 text-left" style={{ fontWeight: 500 }}>
                  {setting.label}
                </span>
                <span className="text-[#6A6F80]">&gt;</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Logout Button */}
      <button 
        onClick={onLogout}
        className="w-full py-4 bg-[#1C1C1E] rounded-[16px] text-[#FF3B30] text-[15px] flex items-center justify-center gap-2 border border-[#2C2C2E] hover:bg-[#2C2C2E] transition-colors"
        style={{ fontWeight: 600 }}
      >
        <LogOut className="w-5 h-5" />
        로그아웃
      </button>
    </div>
  );
}