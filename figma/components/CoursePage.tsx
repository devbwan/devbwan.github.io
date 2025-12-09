import { MapPin, TrendingUp, Star, Navigation, Map } from 'lucide-react';

export default function CoursePage() {
  const courses = [
    { 
      name: '한강 야경 러닝', 
      distance: '8.5 km', 
      difficulty: '중급',
      rating: 4.8,
      reviews: 234,
      image: 'from-[#667eea] to-[#764ba2]'
    },
    { 
      name: '남산 둘레길', 
      distance: '5.2 km', 
      difficulty: '초급',
      rating: 4.9,
      reviews: 189,
      image: 'from-[#f093fb] to-[#f5576c]'
    },
    { 
      name: '올림픽 공원', 
      distance: '6.8 km', 
      difficulty: '중급',
      rating: 4.7,
      reviews: 156,
      image: 'from-[#4facfe] to-[#00f2fe]'
    },
    { 
      name: '청계천 산책로', 
      distance: '3.5 km', 
      difficulty: '초급',
      rating: 4.6,
      reviews: 198,
      image: 'from-[#43e97b] to-[#38f9d7]'
    },
  ];

  const nearbyRoutes = [
    { name: '서울숲', distance: '4.2 km', time: '25분' },
    { name: '양재천', distance: '7.1 km', time: '42분' },
    { name: '탄천', distance: '10.3 km', time: '1시간 2분' },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <h1 
          className="text-[32px] text-white tracking-[-0.02em]"
          style={{ fontWeight: 800 }}
        >
          러닝 코스
        </h1>
        <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
          <Navigation className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Map Preview */}
      <div 
        className="w-full h-[160px] rounded-[24px] overflow-hidden relative"
        style={{
          boxShadow: '0 12px 32px rgba(10, 132, 255, 0.3)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Map className="w-12 h-12 text-white/80 mx-auto mb-2" />
            <span className="text-white text-[14px]" style={{ fontWeight: 600 }}>
              지도 보기
            </span>
          </div>
        </div>
        <div className="absolute top-4 left-4 px-3 py-2 bg-[#1C1C1E]/80 backdrop-blur rounded-full flex items-center gap-2 border border-[#2C2C2E]">
          <MapPin className="w-4 h-4 text-[#0A84FF]" />
          <span className="text-[13px] text-white" style={{ fontWeight: 600 }}>
            서울, 한국
          </span>
        </div>
      </div>

      {/* Popular Courses */}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            인기 코스
          </h2>
          <TrendingUp className="w-5 h-5 text-[#0A84FF]" />
        </div>

        <div className="flex flex-col gap-3">
          {courses.map((course, index) => (
            <div 
              key={index}
              className="w-full bg-[#1C1C1E] rounded-[20px] overflow-hidden"
              style={{
                border: '1px solid #2C2C2E',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
              }}
            >
              {/* Course Image */}
              <div 
                className={`w-full h-[100px] bg-gradient-to-r ${course.image} flex items-end p-4`}
              >
                <div className="px-3 py-1 bg-[#1C1C1E]/90 backdrop-blur rounded-full border border-[#2C2C2E]">
                  <span className="text-[12px] text-white" style={{ fontWeight: 600 }}>
                    {course.difficulty}
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="text-[16px] text-white mb-1" style={{ fontWeight: 700 }}>
                      {course.name}
                    </div>
                    <div className="text-[14px] text-[#8E8E93]">
                      {course.distance}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-[#FFD700]" fill="#FFD700" />
                    <span className="text-[14px] text-white" style={{ fontWeight: 600 }}>
                      {course.rating}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#6A6F80]">
                    {course.reviews}개 리뷰
                  </span>
                  <button className="px-4 py-2 bg-[#0A84FF] text-white rounded-full text-[12px]" style={{ fontWeight: 600 }}>
                    시작하기
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nearby Routes */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-5 h-5 text-white" />
          <h2 
            className="text-[20px] text-white tracking-[-0.01em]" 
            style={{ fontWeight: 600 }}
          >
            내 주변 코스
          </h2>
        </div>

        <div 
          className="w-full bg-[#1C1C1E] rounded-[20px] p-5 flex flex-col gap-4"
          style={{
            border: '1px solid #2C2C2E',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          {nearbyRoutes.map((route, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-[15px] text-white" style={{ fontWeight: 600 }}>
                    {route.name}
                  </div>
                  <div className="text-[13px] text-[#8E8E93]">
                    {route.distance} · {route.time}
                  </div>
                </div>
              </div>
              <button className="text-[#0A84FF] text-[13px]" style={{ fontWeight: 600 }}>
                보기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
