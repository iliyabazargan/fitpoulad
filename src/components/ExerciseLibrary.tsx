import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertTriangle, Lightbulb, ChevronLeft, Plus, Check, Info, X } from 'lucide-react';
import { EXERCISES_DATABASE, MUSCLE_GROUPS } from '../data/exercises';
import { Exercise, MuscleGroup, EquipmentType } from '../types/fitness';

interface ExerciseLibraryProps {
  onAddExerciseToActiveSession?: (exercise: Exercise) => void;
  isWorkoutActive?: boolean;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  onAddExerciseToActiveSession,
  isWorkoutActive,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | 'all'>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISES_DATABASE.filter(ex => {
      const matchSearch = 
        ex.nameFa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ex.secondaryMuscles && ex.secondaryMuscles.some(m => m.includes(searchQuery)));
      
      const matchMuscle = selectedMuscle === 'all' || ex.muscleGroup === selectedMuscle;
      const matchEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment;

      return matchSearch && matchMuscle && matchEquipment;
    });
  }, [searchQuery, selectedMuscle, selectedEquipment]);

  const handleAddClick = (ex: Exercise) => {
    if (onAddExerciseToActiveSession) {
      onAddExerciseToActiveSession(ex);
      setToastMessage(`حرکت «${ex.nameFa}» به تمرین امروز افزوده شد`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">بانک جامع حرکات بدنسازی</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              آموزش صحیح اجرای بیش از ۳۰ حرکت اصلی، تفکیک عضلانی و تکنیک‌های پیشگیری از آسیب
            </p>
          </div>

          <div className="text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 self-start sm:self-auto font-mono">
            {filteredExercises.length} حرکت ورزشی آماده
          </div>
        </div>

        {/* Search input */}
        <div className="relative mb-4">
          <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی نام فارسی یا انگلیسی حرکت (مثلاً: پرس سینه، اسکات، ددلیفت...)"
            className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl pr-12 pl-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Muscle group filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedMuscle('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
              selectedMuscle === 'all'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/40'
            }`}
          >
            همه عضلات
          </button>
          {MUSCLE_GROUPS.map((mg) => (
            <button
              key={mg.id}
              onClick={() => setSelectedMuscle(mg.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                selectedMuscle === mg.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/40'
              }`}
            >
              {mg.labelFa}
            </button>
          ))}
        </div>
      </div>

      {/* Exercises Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => {
          const muscleObj = MUSCLE_GROUPS.find(m => m.id === exercise.muscleGroup);
          
          return (
            <div
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise)}
              className="group bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-5 shadow-lg hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Meta line: unboxed clean text separated by dots */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-emerald-400 font-medium">{muscleObj?.labelFa}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{exercise.equipment}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] font-mono">{exercise.difficulty}</span>
                </div>

                {/* Name */}
                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {exercise.nameFa}
                </h3>
                <p className="text-xs text-slate-500 font-mono tracking-tight mt-0.5">
                  {exercise.nameEn}
                </p>

                {/* Secondary Muscles text */}
                {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                  <div className="mt-3 text-xs text-slate-400 line-clamp-1">
                    <span className="text-slate-500">عضلات کمکی: </span>
                    {exercise.secondaryMuscles.join('، ')}
                  </div>
                )}
              </div>

              {/* Action row */}
              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors py-1"
                >
                  <Info className="w-3.5 h-3.5 text-emerald-400" />
                  <span>راهنمای اجرا</span>
                </button>

                {isWorkoutActive && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddClick(exercise);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 text-xs font-semibold transition-all"
                    title="افزودن به جلسه تمرین امروز"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>افزودن به تمرین</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredExercises.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400">
          <Search className="w-10 h-10 mx-auto text-slate-600 mb-3" />
          <h4 className="text-base font-bold text-white mb-1">حرکتی با این مشخصات یافت نشد</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            لطفاً عبارت دیگری را جستجو کنید یا فیلترهای عضله و وسایل را به حالت «همه» بازگردانید.
          </p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedExercise(null)}
              className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header info */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                <span>{MUSCLE_GROUPS.find(m => m.id === selectedExercise.muscleGroup)?.labelFa}</span>
                <span aria-hidden="true">·</span>
                <span>تجهیزات: {selectedExercise.equipment}</span>
                <span aria-hidden="true">·</span>
                <span>سطح: {selectedExercise.difficulty}</span>
              </div>
              <h3 className="text-2xl font-black text-white">{selectedExercise.nameFa}</h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedExercise.nameEn}</p>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 mb-6">
              <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                مراحل اجرای صحیح گام به گام:
              </h4>
              <ol className="space-y-2 text-xs sm:text-sm text-slate-300 pr-2">
                {selectedExercise.instructionsFa.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center font-mono text-xs shrink-0 font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Common Mistakes */}
            <div className="bg-rose-950/30 border border-rose-900/50 rounded-2xl p-4 mb-5">
              <h4 className="text-xs font-bold text-rose-300 flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                اشتباهات رایج (خطر آسیب دیدگی):
              </h4>
              <ul className="space-y-1.5 text-xs text-rose-200/90 pr-2">
                {selectedExercise.commonMistakesFa.map((mistake, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                    <span>{mistake}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pro Tips */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-2xl p-4 mb-6">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0" />
                نکته طلایی مربی:
              </h4>
              <p className="text-xs text-emerald-200/90 leading-relaxed pr-2">
                {selectedExercise.tipsFa}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedExercise(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                بستن
              </button>

              {isWorkoutActive && (
                <button
                  onClick={() => {
                    handleAddClick(selectedExercise);
                    setSelectedExercise(null);
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  افزودن به جلسه تمرین امروز
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
