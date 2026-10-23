import React from 'react';
import { Dumbbell, BookOpen, Utensils, TrendingUp } from 'lucide-react';
import { ActiveTab } from './Header';

interface BottomNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isWorkoutActive?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  isWorkoutActive,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 md:hidden pb-safe">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        
        <button
          onClick={() => onTabChange('workout')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors relative ${
            activeTab === 'workout' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Dumbbell className="w-5 h-5" />
            {isWorkoutActive && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute -top-1 -right-1 animate-pulse" />
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">تمرین</span>
        </button>

        <button
          onClick={() => onTabChange('exercises')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activeTab === 'exercises' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">حرکات</span>
        </button>

        <button
          onClick={() => onTabChange('nutrition')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activeTab === 'nutrition' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Utensils className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">تغذیه</span>
        </button>

        <button
          onClick={() => onTabChange('progress')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-colors ${
            activeTab === 'progress' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-5 h-5" />
          <span className="text-[10px] mt-1 tracking-tight">پیشرفت</span>
        </button>

      </div>
    </nav>
  );
};
