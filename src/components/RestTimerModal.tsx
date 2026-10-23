import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, X, Plus, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface RestTimerProps {
  isOpen: boolean;
  onClose: () => void;
  initialSeconds?: number;
  exerciseName?: string;
  setNumber?: number;
}

export const RestTimerModal: React.FC<RestTimerProps> = ({
  isOpen,
  onClose,
  initialSeconds = 90,
  exerciseName,
  setNumber,
}) => {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  useEffect(() => {
    if (isOpen) {
      setTotalSeconds(initialSeconds);
      setTimeLeft(initialSeconds);
      setIsRunning(true);
      setIsMinimized(false);
    }
  }, [isOpen, initialSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            soundManager.playCompletionChime();
            setIsRunning(false);
            return 0;
          }
          if (prev <= 4 && prev > 1) {
            soundManager.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 100;

  const handleToggleSound = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const handleAddSeconds = (secs: number) => {
    setTimeLeft(prev => prev + secs);
    setTotalSeconds(prev => prev + secs);
  };

  const handleReset = (secs: number = totalSeconds) => {
    setTotalSeconds(secs);
    setTimeLeft(secs);
    setIsRunning(true);
  };

  // Minimized floating bubble
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-20 left-4 z-50 flex items-center gap-3 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-full shadow-2xl cursor-pointer hover:border-emerald-400 transition-all active:scale-95 group"
      >
        <div className="relative flex items-center justify-center w-8 h-8">
          <svg className="w-8 h-8 -rotate-90">
            <circle cx="16" cy="16" r="13" className="stroke-slate-700 fill-none" strokeWidth="2.5" />
            <circle
              cx="16"
              cy="16"
              r="13"
              className="stroke-emerald-400 fill-none transition-all duration-300"
              strokeWidth="2.5"
              strokeDasharray={81.68}
              strokeDashoffset={81.68 - (81.68 * progressPercent) / 100}
            />
          </svg>
          <span className="absolute text-[10px] font-mono font-bold">{timeLeft}s</span>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold text-emerald-400">تایمر استراحت فعال</div>
          <div className="text-[11px] text-slate-400 font-mono tabular-nums">{formattedTime}</div>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }}
          className="p-1 text-slate-400 hover:text-white"
          title="بزرگنمایی"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Full Screen / Modal Dialog
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-center text-slate-100">
        
        {/* Top controls */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition-colors ${isMuted ? 'text-slate-500 hover:text-slate-300' : 'text-emerald-400 hover:bg-emerald-950/40'}`}
            title={isMuted ? 'فعال‌سازی صدا' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          <span className="text-xs font-medium text-slate-400">
            {exerciseName ? `${exerciseName} ${setNumber ? `(ست ${setNumber})` : ''}` : 'زمان استراحت بین ست‌ها'}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              title="کوچک‌نمایی در پس‌زمینه"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
              title="بستن"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Circular Dial Timer */}
        <div className="relative w-56 h-56 mx-auto my-4 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            {/* Background ring */}
            <circle
              cx="112"
              cy="112"
              r="96"
              className="stroke-slate-800 fill-none"
              strokeWidth="10"
            />
            {/* Active animated ring */}
            <circle
              cx="112"
              cy="112"
              r="96"
              className={`fill-none transition-all duration-500 ${timeLeft === 0 ? 'stroke-emerald-400 animate-pulse' : 'stroke-emerald-500'}`}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={603}
              strokeDashoffset={603 - (603 * progressPercent) / 100}
            />
          </svg>

          {/* Time digits in center */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-extrabold tracking-tight font-mono tabular-nums text-white">
              {formattedTime}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {timeLeft === 0 ? 'استراحت پایان یافت! وقت ست بعدیه' : isRunning ? 'نفس عمیق بکشید...' : 'متوقف شده'}
            </span>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[45, 60, 90, 120].map((secs) => (
            <button
              key={secs}
              onClick={() => handleReset(secs)}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl transition-colors ${totalSeconds === secs ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/50'}`}
            >
              {secs} ثانیه
            </button>
          ))}
          <button
            onClick={() => handleAddSeconds(15)}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700/50 transition-colors"
            title="افزودن ۱۵ ثانیه"
          >
            <Plus className="w-3.5 h-3.5" />
            ۱۵+
          </button>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleReset(totalSeconds)}
            className="p-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition-all active:scale-95"
            title="شروع مجدد"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            title={isRunning ? 'توقف موقت' : 'ادامه'}
          >
            {isRunning ? <Pause className="w-7 h-7 fill-current" /> : <Play className="w-7 h-7 fill-current translate-x-[-1px]" />}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs font-semibold transition-all active:scale-95"
          >
            پایان استراحت
          </button>
        </div>

      </div>
    </div>
  );
};
