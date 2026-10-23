import React from 'react';
import { Dumbbell, BookOpen, Utensils, TrendingUp, HelpCircle, Volume2, VolumeX, User } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'workout' | 'exercises' | 'nutrition' | 'progress';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenGuide: () => void;
  onOpenProfile: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isWorkoutActive?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenGuide,
  onOpenProfile,
  isMuted,
  onToggleMute,
  isWorkoutActive,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Wordmark (Single text element in bold athletic display font) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
            <Dumbbell className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap">
            فیت‌پولاد
            <span className="text-emerald-400 text-xs font-mono mr-1.5 font-bold uppercase">Pro</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links (Clean single-line prose without pill capsules) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onTabChange('workout')}
            className={`relative flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'workout' 
                ? 'text-emerald-400 bg-slate-900 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>جلسه تمرین</span>
            {isWorkoutActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute -top-0.5 -right-0.5" />
            )}
          </button>

          <button
            onClick={() => onTabChange('exercises')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'exercises' 
                ? 'text-emerald-400 bg-slate-900 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>بانک حرکات</span>
          </button>

          <button
            onClick={() => onTabChange('nutrition')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'nutrition' 
                ? 'text-emerald-400 bg-slate-900 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>تغذیه و آب</span>
          </button>

          <button
            onClick={() => onTabChange('progress')}
            className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'progress' 
                ? 'text-emerald-400 bg-slate-900 shadow-inner' 
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>پرونده پیشرفت</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action Zone */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors ${
              !isMuted ? 'text-emerald-400' : ''
            }`}
            title={isMuted ? 'فعال‌سازی بوق تایمر' : 'قطع صدا'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenProfile}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            title="پروفایل و پشتیبان‌گیری"
          >
            <User className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all active:scale-95 whitespace-nowrap"
          >
            <HelpCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">راهنمای استفاده</span>
            <span className="sm:hidden">راهنما</span>
          </button>
        </div>

      </div>
    </header>
  );
};
