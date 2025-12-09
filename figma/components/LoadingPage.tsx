import { Zap } from 'lucide-react';

export default function LoadingPage() {
  return (
    <div className="h-screen w-full bg-[#0A0A0A] flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(10, 132, 255, 0.2) 0%, transparent 70%)',
          animation: 'pulse 3s ease-in-out infinite'
        }}
      />
      
      {/* Animated Rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="absolute w-64 h-64 rounded-full border-2 border-[#0A84FF]/20"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
        <div 
          className="absolute w-48 h-48 rounded-full border-2 border-[#0A84FF]/30"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s'
          }}
        />
        <div 
          className="absolute w-32 h-32 rounded-full border-2 border-[#0A84FF]/40"
          style={{
            animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s'
          }}
        />
      </div>

      {/* Logo and Brand */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo Icon */}
        <div 
          className="w-24 h-24 rounded-[28px] bg-gradient-to-br from-[#0A84FF] to-[#0066CC] flex items-center justify-center mb-8 relative"
          style={{
            boxShadow: '0 20px 60px rgba(10, 132, 255, 0.6)',
            animation: 'float 3s ease-in-out infinite'
          }}
        >
          <Zap className="w-14 h-14 text-white" fill="white" />
          
          {/* Shine Effect */}
          <div 
            className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/30 to-transparent opacity-0"
            style={{
              animation: 'shine 2s ease-in-out infinite'
            }}
          />
        </div>

        {/* Brand Name */}
        <h1 
          className="text-white text-[48px] tracking-[-0.03em] mb-3"
          style={{ 
            fontWeight: 900,
            textShadow: '0 4px 20px rgba(10, 132, 255, 0.4)'
          }}
        >
          RunWave
        </h1>

        {/* Tagline */}
        <p 
          className="text-[#8E8E93] text-[16px] mb-12"
          style={{ fontWeight: 500 }}
        >
          당신의 러닝을 기록하다
        </p>

        {/* Loading Spinner */}
        <div className="flex items-center gap-2">
          <div 
            className="w-2 h-2 rounded-full bg-[#0A84FF]"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-[#0A84FF]"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite 0.2s'
            }}
          />
          <div 
            className="w-2 h-2 rounded-full bg-[#0A84FF]"
            style={{
              animation: 'bounce 1.4s ease-in-out infinite 0.4s'
            }}
          />
        </div>
      </div>

      {/* Bottom Version Info */}
      <div className="absolute bottom-12 text-center">
        <p className="text-[#6A6F80] text-[13px]" style={{ fontWeight: 500 }}>
          Version 1.0.0
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shine {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.5;
          }
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
