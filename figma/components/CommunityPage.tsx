import { Users, TrendingUp, ThumbsUp, MessageCircle, Award, Medal } from 'lucide-react';

export default function CommunityPage() {
  const leaderboard = [
    { rank: 1, name: '민지', distance: '124.5 km', avatar: 'from-[#FFD700] to-[#FFA500]' },
    { rank: 2, name: '현우', distance: '118.2 km', avatar: 'from-[#C0C0C0] to-[#A8A8A8]' },
    { rank: 3, name: 'Sarah', distance: '112.8 km', avatar: 'from-[#CD7F32] to-[#B8860B]' },
    { rank: 4, name: 'John', distance: '98.3 km', avatar: 'from-[#9C27B0] to-[#BA68C8]' },
    { rank: 5, name: '지훈', distance: '87.1 km', avatar: 'from-[#2196F3] to-[#64B5F6]' },
  ];

  const activities = [
    { name: '민지', action: '새로운 기록 달성!', detail: '10km 최고 기록', time: '30분 전', likes: 24 },
    { name: 'Sarah', action: '코스 완주', detail: '한강 러닝 코스', time: '1시간 전', likes: 18 },
    { name: '현우', action: '배지 획득', detail: '100km 달성 배지', time: '2시간 전', likes: 32 },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 
          className="text-[32px] text-white tracking-[-0.02em]"
          style={{ fontWeight: 800 }}
        >
          커뮤니티
        </h1>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Weekly Challenge */}
      <div 
        className="w-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] rounded-[24px] p-5"
        style={{
          boxShadow: '0 12px 32px rgba(255, 107, 107, 0.4)'
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Award className="w-6 h-6 text-white" />
          <span className="text-white text-[18px]" style={{ fontWeight: 700 }}>
            이번 주 챌린지
          </span>
        </div>
        <div className="text-white text-[24px] mb-2" style={{ fontWeight: 800 }}>
          25km 달리기
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
          <div 
            className="h-full bg-white rounded-full"
            style={{ width: '68%' }}
          />
        </div>
        <div className="flex justify-between">
          <span className="text-white/90 text-[13px]">17km 완료</span>
          <span className="text-white/90 text-[13px]">8km 남음</span>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            이번 달 리더보드
          </h2>
          <TrendingUp className="w-5 h-5 text-[#0A84FF]" />
        </div>

        <div 
          className="w-full bg-[#1C1C1E] rounded-[20px] p-5 flex flex-col gap-4"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          {leaderboard.map((user) => (
            <div key={user.rank} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8">
                {user.rank <= 3 ? (
                  <Medal className={`w-6 h-6 ${user.rank === 1 ? 'text-[#FFD700]' : user.rank === 2 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'}`} />
                ) : (
                  <span className="text-[16px] text-[#8E8E93]" style={{ fontWeight: 600 }}>
                    {user.rank}
                  </span>
                )}
              </div>
              <div 
                className={`w-10 h-10 rounded-full bg-gradient-to-br ${user.avatar} flex-shrink-0 flex items-center justify-center text-white`}
                style={{ fontWeight: 700 }}
              >
                {user.name[0]}
              </div>
              <div className="flex-1">
                <div className="text-[15px] text-white" style={{ fontWeight: 600 }}>
                  {user.name}
                </div>
                <div className="text-[13px] text-[#8E8E93]">
                  {user.distance}
                </div>
              </div>
              {user.rank <= 3 && (
                <div className="px-3 py-1 bg-gradient-to-r from-[#FFD700]/20 to-[#FFA500]/20 rounded-full">
                  <span className="text-[11px] text-[#FFA500]" style={{ fontWeight: 700 }}>
                    TOP {user.rank}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div className="flex flex-col">
        <h2 
          className="text-[20px] text-white tracking-[-0.01em] mb-3" 
          style={{ fontWeight: 600 }}
        >
          최근 활동
        </h2>

        <div className="flex flex-col gap-3">
          {activities.map((activity, index) => (
            <div 
              key={index}
              className="w-full bg-[#1C1C1E] rounded-[16px] p-4"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              <div className="flex items-start gap-3">
                <div 
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex-shrink-0 flex items-center justify-center text-white"
                  style={{ fontWeight: 700 }}
                >
                  {activity.name[0]}
                </div>
                <div className="flex-1">
                  <div className="text-[15px] text-white mb-1" style={{ fontWeight: 600 }}>
                    {activity.name}
                    <span className="text-[#8E8E93]" style={{ fontWeight: 400 }}> {activity.action}</span>
                  </div>
                  <div className="text-[14px] text-[#0A84FF] mb-2" style={{ fontWeight: 500 }}>
                    {activity.detail}
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-[#8E8E93]" />
                      <span className="text-[12px] text-[#8E8E93]" style={{ fontWeight: 500 }}>
                        {activity.likes}
                      </span>
                    </button>
                    <button className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-[#8E8E93]" />
                      <span className="text-[12px] text-[#8E8E93]" style={{ fontWeight: 500 }}>
                        댓글
                      </span>
                    </button>
                    <span className="text-[11px] text-[#6A6F80] ml-auto">
                      {activity.time}
                    </span>
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
