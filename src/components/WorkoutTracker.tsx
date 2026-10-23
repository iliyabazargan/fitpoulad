import React, { useState, useEffect } from 'react';
import { 
  Play, Check, Plus, Trash2, Clock, Dumbbell, Award, Flame, 
  RotateCcw, Info, Sparkles, ChevronDown, CheckCircle2, Save, X 
} from 'lucide-react';
import { WorkoutSession, SessionExercise, WorkoutSet, Exercise } from '../types/fitness';
import { SAMPLE_WORKOUT_PLANS } from '../data/samplePlans';
import { EXERCISES_DATABASE } from '../data/exercises';
import { 
  saveActiveWorkoutSession, 
  saveCompletedSession, 
  createNewWorkoutSessionFromTemplate, 
  getTodayDateString 
} from '../utils/storage';

interface WorkoutTrackerProps {
  session: WorkoutSession | null;
  onUpdateSession: (session: WorkoutSession | null) => void;
  onStartRestTimer: (exerciseName: string, setNumber: number, durationSeconds?: number) => void;
  onViewExerciseGuide: (exerciseId: string) => void;
  onOpenGuide: () => void;
}

export const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  session,
  onUpdateSession,
  onStartRestTimer,
  onViewExerciseGuide,
  onOpenGuide,
}) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showCompletionSummary, setShowCompletionSummary] = useState<WorkoutSession | null>(null);

  // Active workout elapsed timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (session) {
      timer = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [session?.id]);

  // Calculate live volume
  const totalVolumeKg = session ? session.exercises.reduce((acc, ex) => {
    const exerciseVol = ex.sets.reduce((sAcc, set) => {
      if (set.completed) {
        return sAcc + (set.weightKg * set.reps);
      }
      return sAcc;
    }, 0);
    return acc + exerciseVol;
  }, 0) : 0;

  // Completed sets count
  const totalSetsCount = session ? session.exercises.reduce((acc, ex) => acc + ex.sets.length, 0) : 0;
  const completedSetsCount = session ? session.exercises.reduce((acc, ex) => {
    return acc + ex.sets.filter(s => s.completed).length;
  }, 0) : 0;

  const formatElapsed = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartTemplate = (planId: string, dayIndex: number = 0) => {
    const newSession = createNewWorkoutSessionFromTemplate(planId, dayIndex);
    onUpdateSession(newSession);
    setShowTemplateSelector(false);
  };

  const handleStartCustomWorkout = () => {
    const emptySession: WorkoutSession = {
      id: `custom-session-${Date.now()}`,
      date: getTodayDateString(),
      nameFa: 'تمرین آزاد انتخابی',
      durationMinutes: 0,
      completed: false,
      totalVolumeKg: 0,
      exercises: []
    };
    saveActiveWorkoutSession(emptySession);
    onUpdateSession(emptySession);
  };

  const handleToggleSetComplete = (exIdx: number, setIdx: number) => {
    if (!session) return;
    const updated = { ...session };
    const currentSet = updated.exercises[exIdx].sets[setIdx];
    const willBeCompleted = !currentSet.completed;
    currentSet.completed = willBeCompleted;

    // Recalculate total session volume
    updated.totalVolumeKg = updated.exercises.reduce((acc, ex) => {
      return acc + ex.sets.reduce((sAcc, s) => s.completed ? sAcc + (s.weightKg * s.reps) : sAcc, 0);
    }, 0);

    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);

    // If marked completed, automatically launch the rest timer!
    if (willBeCompleted) {
      onStartRestTimer(
        updated.exercises[exIdx].exerciseNameFa,
        currentSet.setNumber,
        currentSet.restSeconds || 90
      );
    }
  };

  const handleUpdateSetValue = (exIdx: number, setIdx: number, field: 'weightKg' | 'reps', val: number) => {
    if (!session) return;
    const updated = { ...session };
    updated.exercises[exIdx].sets[setIdx][field] = Math.max(0, val);
    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);
  };

  const handleAddSet = (exIdx: number) => {
    if (!session) return;
    const updated = { ...session };
    const ex = updated.exercises[exIdx];
    const lastSet = ex.sets[ex.sets.length - 1];
    const newSet: WorkoutSet = {
      id: `set-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      setNumber: ex.sets.length + 1,
      weightKg: lastSet ? lastSet.weightKg : 20,
      reps: lastSet ? lastSet.reps : 10,
      targetReps: lastSet ? lastSet.targetReps : 10,
      targetWeightKg: lastSet ? lastSet.targetWeightKg : 20,
      completed: false,
      restSeconds: 90,
    };
    ex.sets.push(newSet);
    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);
  };

  const handleRemoveSet = (exIdx: number, setIdx: number) => {
    if (!session) return;
    const updated = { ...session };
    updated.exercises[exIdx].sets.splice(setIdx, 1);
    // re-number remaining sets
    updated.exercises[exIdx].sets.forEach((s, idx) => {
      s.setNumber = idx + 1;
    });
    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);
  };

  const handleRemoveExercise = (exIdx: number) => {
    if (!session) return;
    const updated = { ...session };
    updated.exercises.splice(exIdx, 1);
    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);
  };

  const handleAddExerciseToCurrent = (exercise: Exercise) => {
    if (!session) return;
    const updated = { ...session };
    const newEx: SessionExercise = {
      exerciseId: exercise.id,
      exerciseNameFa: exercise.nameFa,
      exerciseNameEn: exercise.nameEn,
      muscleGroup: exercise.muscleGroup,
      equipment: exercise.equipment,
      sets: [
        {
          id: `set-${Date.now()}-1`,
          setNumber: 1,
          weightKg: 20,
          reps: 10,
          targetReps: 10,
          targetWeightKg: 20,
          completed: false,
          restSeconds: 90,
        },
        {
          id: `set-${Date.now()}-2`,
          setNumber: 2,
          weightKg: 20,
          reps: 10,
          targetReps: 10,
          targetWeightKg: 20,
          completed: false,
          restSeconds: 90,
        },
        {
          id: `set-${Date.now()}-3`,
          setNumber: 3,
          weightKg: 20,
          reps: 10,
          targetReps: 10,
          targetWeightKg: 20,
          completed: false,
          restSeconds: 90,
        }
      ]
    };
    updated.exercises.push(newEx);
    saveActiveWorkoutSession(updated);
    onUpdateSession(updated);
    setShowAddExerciseModal(false);
  };

  const handleFinishWorkout = () => {
    if (!session) return;
    const completedSession: WorkoutSession = {
      ...session,
      completed: true,
      durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      totalVolumeKg,
    };
    saveCompletedSession(completedSession);
    setShowCompletionSummary(completedSession);
    onUpdateSession(null);
  };

  const handleCancelWorkout = () => {
    if (confirm('آیا از لغو این جلسه تمرینی اطمینان دارید؟ تغییرات ذخیره نخواهند شد.')) {
      saveActiveWorkoutSession(null);
      onUpdateSession(null);
    }
  };

  // --- VIEW A: NO WORKOUT ACTIVE ---
  if (!session) {
    const defaultTemplate = SAMPLE_WORKOUT_PLANS[0];

    return (
      <div className="space-y-6">
        
        {/* Welcome / Quick Start Hero Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>باشگاه هوشمند فیت‌پولاد آماده تمرین شماست</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              امروز نوبت کدام عضلات است؟
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              یک برنامه تمرینی را با یک کلیک شروع کنید، وزنه‌ها را حین تمرین ثبت کنید و با استراحت‌های علمی بیشترین رشد عضلانی را تجربه کنید.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleStartTemplate(defaultTemplate.id, 0)}
                className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:bg-emerald-400 shadow-xl shadow-emerald-500/25 transition-all active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>شروع تمرین امروز (حرکات فشاری - سینه و سرشانه)</span>
              </button>

              <button
                onClick={() => setShowTemplateSelector(true)}
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors"
              >
                <span>انتخاب سایر روزها و برنامه‌ها</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick guide helper alert */}
          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-400">
              <Info className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>بار اولتونه؟ برای راهنمای قدم به قدم روی دکمه روبرو کلیک کنید:</span>
            </div>
            <button
              onClick={onOpenGuide}
              className="text-xs font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-4 shrink-0"
            >
              راهنمای گام‌به‌گام کار با برنامه
            </button>
          </div>
        </div>

        {/* Template Selector Modal */}
        {showTemplateSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">انتخاب برنامه تمرینی</h3>
                  <p className="text-xs text-slate-400 mt-1">برنامه‌های علمی طراحی شده بر اساس سطح و روزهای تمرین</p>
                </div>
                <button
                  onClick={() => setShowTemplateSelector(false)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {SAMPLE_WORKOUT_PLANS.map((plan) => (
                  <div key={plan.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-emerald-400">{plan.titleFa}</h4>
                      <span className="text-xs text-slate-400 font-mono">{plan.splitType}</span>
                    </div>
                    <p className="text-xs text-slate-300 mb-4">{plan.descriptionFa}</p>

                    <div className="space-y-2">
                      {plan.days.map((day, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center justify-between bg-slate-900/90 border border-slate-800/80 p-3 rounded-xl hover:border-slate-700 transition-colors"
                        >
                          <div>
                            <div className="text-xs font-semibold text-white">{day.dayNameFa}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{day.focusFa} · {day.exercises.length} حرکت</div>
                          </div>
                          <button
                            onClick={() => handleStartTemplate(plan.id, dIdx)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-all"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" />
                            شروع این روز
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Free workout option */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => {
                      setShowTemplateSelector(false);
                      handleStartCustomWorkout();
                    }}
                    className="text-xs text-slate-400 hover:text-emerald-400 underline underline-offset-4"
                  >
                    یا شروع تمرین آزاد بدون برنامه از پیش تعیین شده
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration Modal */}
        {showCompletionSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-8 text-center text-slate-100 shadow-2xl">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/40">
                <Award className="w-8 h-8" />
              </div>

              <span className="text-xs font-bold text-emerald-400">خسته نباشی قهرمان! 💪</span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">جلسه تمرین با موفقیت ثبت شد</h3>
              <p className="text-xs text-slate-300 mb-6">
                رکوردها و حجم تمرینی شما در پرونده پیشرفت ذخیره گردید. ریکاوری و تغذیه بعد از تمرین را فراموش نکنید!
              </p>

              <div className="grid grid-cols-3 gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 text-center">
                <div>
                  <div className="text-[11px] text-slate-500">مدت تمرین</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">{showCompletionSummary.durationMinutes} دقیقه</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">حجم کل وزنه‌ها</div>
                  <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{showCompletionSummary.totalVolumeKg.toLocaleString()} کیلو</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">حرکات انجام‌شده</div>
                  <div className="text-base font-bold text-white font-mono mt-0.5">{showCompletionSummary.exercises.length} حرکت</div>
                </div>
              </div>

              <button
                onClick={() => setShowCompletionSummary(null)}
                className="w-full py-3 rounded-2xl bg-emerald-500 text-slate-950 font-extrabold text-sm hover:bg-emerald-400 shadow-lg shadow-emerald-500/20 transition-all"
              >
                عالیه، ثبت نهایی
              </button>
            </div>
          </div>
        )}

      </div>
    );
  }

  // --- VIEW B: ACTIVE WORKOUT SESSION ---
  return (
    <div className="space-y-6">
      
      {/* Top Session Stats Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl sticky top-20 z-30 backdrop-blur-md bg-slate-900/95">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>جلسه تمرین زنده</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400">{session.date}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{session.nameFa}</h2>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <span className="text-slate-500 text-[10px] block">زمان تمرین</span>
              <span className="text-emerald-400 font-bold text-sm tabular-nums">{formatElapsed(elapsedSeconds)}</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <span className="text-slate-500 text-[10px] block">حجم جابجاشده</span>
              <span className="text-white font-bold text-sm tabular-nums">{totalVolumeKg.toLocaleString()} kg</span>
            </div>

            <div className="bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl text-center">
              <span className="text-slate-500 text-[10px] block">ست‌ها</span>
              <span className="text-white font-bold text-sm tabular-nums">{completedSetsCount}/{totalSetsCount}</span>
            </div>
          </div>
        </div>

        {/* Action strip */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>افزودن حرکت</span>
            </button>
            <button
              onClick={() => onStartRestTimer('استراحت دستی', 1, 90)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>تایمر استراحت (۹۰s)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCancelWorkout}
              className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-xl hover:bg-rose-950/30 transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={handleFinishWorkout}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-extrabold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>پایان و ذخیره تمرین</span>
            </button>
          </div>
        </div>
      </div>

      {/* Exercises List */}
      <div className="space-y-4">
        {session.exercises.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
            <Dumbbell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">هنوز حرکتی به این جلسه اضافه نشده است</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              با کلیک روی دکمه زیر، اولین حرکت خود را از بین ۳۰+ حرکت بدنسازی انتخاب کنید.
            </p>
            <button
              onClick={() => setShowAddExerciseModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
            >
              <Plus className="w-4 h-4" />
              افزودن اولین حرکت
            </button>
          </div>
        ) : (
          session.exercises.map((exercise, exIdx) => (
            <div
              key={`${exercise.exerciseId}-${exIdx}`}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl"
            >
              {/* Exercise Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="text-emerald-400 font-semibold">{exercise.equipment}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-400 font-mono text-[11px]">{exercise.exerciseNameEn}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">{exercise.exerciseNameFa}</h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onViewExerciseGuide(exercise.exerciseId)}
                    className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="راهنمای اجرای صحیح و اشتباهات رایج"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="حذف این حرکت از جلسه"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800/80 font-medium">
                      <th className="pb-2 text-center w-12">ست</th>
                      <th className="pb-2 text-center w-28">وزنه (کیلوگرم)</th>
                      <th className="pb-2 text-center w-24">تکرار</th>
                      <th className="pb-2 text-center w-20">ثبت ست</th>
                      <th className="pb-2 text-center w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {exercise.sets.map((set, setIdx) => (
                      <tr 
                        key={set.id}
                        className={`transition-colors ${set.completed ? 'bg-emerald-950/20' : 'hover:bg-slate-800/40'}`}
                      >
                        {/* Set Number */}
                        <td className="py-2.5 text-center font-mono font-bold text-slate-400">
                          {set.setNumber}
                        </td>

                        {/* Weight input */}
                        <td className="py-2.5 text-center px-1">
                          <div className="flex items-center justify-center gap-1">
                            <input
                              type="number"
                              min="0"
                              step="0.5"
                              value={set.weightKg}
                              onChange={(e) => handleUpdateSetValue(exIdx, setIdx, 'weightKg', parseFloat(e.target.value) || 0)}
                              className="w-20 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-center font-mono font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                            />
                            <span className="text-[11px] text-slate-500">kg</span>
                          </div>
                        </td>

                        {/* Reps input */}
                        <td className="py-2.5 text-center px-1">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            value={set.reps}
                            onChange={(e) => handleUpdateSetValue(exIdx, setIdx, 'reps', parseInt(e.target.value) || 1)}
                            className="w-16 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1.5 text-center font-mono font-bold text-white focus:outline-none focus:border-emerald-500 tabular-nums"
                          />
                        </td>

                        {/* Complete Checkmark Button */}
                        <td className="py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleSetComplete(exIdx, setIdx)}
                            className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto transition-all active:scale-90 ${
                              set.completed
                                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700/60'
                            }`}
                            title={set.completed ? 'ست تکمیل شد (تایمر فعال شد)' : 'تیک زدن و شروع تایمر استراحت'}
                          >
                            <Check className={`w-5 h-5 ${set.completed ? 'stroke-[3]' : 'stroke-[2]'}`} />
                          </button>
                        </td>

                        {/* Delete Set */}
                        <td className="py-2.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveSet(exIdx, setIdx)}
                            className="p-1 text-slate-600 hover:text-rose-400 transition-colors"
                            title="حذف ست"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add set button */}
              <div className="mt-3 pt-2 flex items-center justify-start">
                <button
                  type="button"
                  onClick={() => handleAddSet(exIdx)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>افزودن ست جدید</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Add Exercise Modal */}
      {showAddExerciseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[85vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">افزودن حرکت جدید به تمرین</h3>
              <button
                onClick={() => setShowAddExerciseModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {EXERCISES_DATABASE.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800/80 transition-colors cursor-pointer"
                  onClick={() => handleAddExerciseToCurrent(ex)}
                >
                  <div>
                    <div className="text-sm font-bold text-white">{ex.nameFa}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{ex.equipment} · {ex.nameEn}</div>
                  </div>
                  <button
                    className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
