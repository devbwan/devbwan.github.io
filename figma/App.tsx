import { useState, useEffect } from 'react';
import { Activity, Home, Users, Route, User, Zap } from 'lucide-react';
import HomePage from './components/HomePage';
import RunningPage from './components/RunningPage';
import CommunityPage from './components/CommunityPage';
import CoursePage from './components/CoursePage';
import ProfilePage from './components/ProfilePage';
import RunningPreparePage from './components/RunningPreparePage';
import RunningActivePage from './components/RunningActivePage';
import LoadingPage from './components/LoadingPage';
import MobileHead from './components/MobileHead';

type PageType = 'home' | 'running' | 'community' | 'course' | 'profile';
type RunningState = 'idle' | 'prepare' | 'active';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [runningState, setRunningState] = useState<RunningState>('idle');

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Show loading page
  if (isLoading) {
    return (
      <>
        <MobileHead />
        <LoadingPage />
      </>
    );
  }

  const handleStartRunning = () => {
    setRunningState('prepare');
  };

  const handleBeginRunning = () => {
    setRunningState('active');
  };

  const handlePauseRunning = () => {
    // Could add pause state here
    console.log('Pause running');
  };

  const handleStopRunning = () => {
    setRunningState('idle');
    setCurrentPage('home');
  };

  const handleBackFromPrepare = () => {
    setRunningState('idle');
  };

  // If in running prepare or active state, show those screens
  if (runningState === 'prepare') {
    return (
      <>
        <MobileHead />
        <RunningPreparePage 
          onStartRunning={handleBeginRunning}
          onBack={handleBackFromPrepare}
        />
      </>
    );
  }

  if (runningState === 'active') {
    return (
      <>
        <MobileHead />
        <RunningActivePage 
          onPause={handlePauseRunning}
          onStop={handleStopRunning}
        />
      </>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onStartRunning={handleStartRunning} />;
      case 'running':
        return <RunningPage />;
      case 'community':
        return <CommunityPage />;
      case 'course':
        return <CoursePage />;
      case 'profile':
        return <ProfilePage isLoggedIn={isLoggedIn} onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />;
      default:
        return <HomePage onStartRunning={handleStartRunning} />;
    }
  };

  return (
    <>
      <MobileHead />
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto pb-20">
          {renderPage()}
        </div>

        {/* Bottom Navigation Bar */}
        <div 
          className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-[#2C2C2E] safe-bottom"
          style={{
            boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="flex items-center justify-between px-6 py-3">
            {/* Home */}
            <button 
              onClick={() => setCurrentPage('home')}
              className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
            >
              <Home className={`w-6 h-6 ${currentPage === 'home' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span 
                className={`text-[11px] ${currentPage === 'home' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} 
                style={{ fontWeight: currentPage === 'home' ? 600 : 500 }}
              >
                홈
              </span>
            </button>

            {/* Running */}
            <button 
              onClick={() => setCurrentPage('running')}
              className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
            >
              <Activity className={`w-6 h-6 ${currentPage === 'running' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span 
                className={`text-[11px] ${currentPage === 'running' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`}
                style={{ fontWeight: currentPage === 'running' ? 600 : 500 }}
              >
                러닝
              </span>
            </button>

            {/* Community */}
            <button 
              onClick={() => setCurrentPage('community')}
              className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
            >
              <Users className={`w-6 h-6 ${currentPage === 'community' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span 
                className={`text-[11px] ${currentPage === 'community' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`}
                style={{ fontWeight: currentPage === 'community' ? 600 : 500 }}
              >
                커뮤니티
              </span>
            </button>

            {/* Course */}
            <button 
              onClick={() => setCurrentPage('course')}
              className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
            >
              <Route className={`w-6 h-6 ${currentPage === 'course' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span 
                className={`text-[11px] ${currentPage === 'course' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`}
                style={{ fontWeight: currentPage === 'course' ? 600 : 500 }}
              >
                코스
              </span>
            </button>

            {/* Profile */}
            <button 
              onClick={() => setCurrentPage('profile')}
              className="flex flex-col items-center gap-1 flex-1 active:opacity-70 transition-opacity"
            >
              <User className={`w-6 h-6 ${currentPage === 'profile' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`} />
              <span 
                className={`text-[11px] ${currentPage === 'profile' ? 'text-[#0A84FF]' : 'text-[#8E8E93]'}`}
                style={{ fontWeight: currentPage === 'profile' ? 600 : 500 }}
              >
                정보
              </span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}