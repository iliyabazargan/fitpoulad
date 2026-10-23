import React, { useState } from 'react';
import { TrendingUp, Plus, Calendar, Dumbbell, Award, Scale, ChevronDown, ChevronUp, Save, X, Check } from 'lucide-react';
import { BodyMeasurement, UserProfile, WorkoutSession } from '../types/fitness';
import { saveBodyMeasurement, loadPastWorkoutSessions, exportBackupData, importBackupData } from '../utils/storage';

interface ProgressTrackerProps {
  measurements: BodyMeasurement[];
  onUpdateMeasurements: (list: BodyMeasurement[]) => void;
  userProfile: UserProfile;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  measurements,
  onUpdateMeasurements,
  userProfile,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const pastSessions = loadPastWorkoutSessions();

  // New measurement form state
  const [newWeight, setNewWeight] = useState<number>(userProfile.currentWeightKg || 75);
  const [newFatPct, setNewFatPct] = useState<number>(15);
  const [newChest, setNewChest] = useState<number>(102);
  const [newWaist, setNewWaist] = useState<number>(83);
  const [newArms, setNewArms] = useState<number>(37);
  const [newThighs, setNewThighs] = useState<number>(57);
  const [newNotes, setNewNotes] = useState<string>('');

  // Calculate BMI
  const heightM = (userProfile.heightCm || 178) / 100;
  const currentWeight = measurements[0]?.weightKg || userProfile.currentWeightKg || 75;
  const bmi = heightM > 0 ? (currentWeight / (heightM * heightM)).toFixed(1) : '23.5';

  const getBmiStatus = (val: number) => {
    if (val < 18.5) return { text: 'کمبود وزن', color: 'text-amber-400' };
    if (val < 25) return { text: 'تناسب وزن نرمال', color: 'text-emerald-400' };
    if (val < 30) return { text: 'اضافه وزن / عضله‌دار', color: 'text-blue-400' };
    return { text: 'بالای محدوده استاندارد', color: 'text-rose-400' };
  };
  const bmiStatus = getBmiStatus(parseFloat(bmi));

  // Total Lifetime volume
  const totalLifetimeVolume = pastSessions.reduce((acc, s) => acc + (s.totalVolumeKg || 0), 0);

  const handleAddMeasurementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: BodyMeasurement = {
      id: `m-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      weightKg: Number(newWeight),
      bodyFatPct: Number(newFatPct) || undefined,
      chestCm: Number(newChest) || undefined,
      waistCm: Number(newWaist) || undefined,
      armsCm: Number(newArms) || undefined,
      thighsCm: Number(newThighs) || undefined,
      notes: newNotes.trim() || undefined,
    };

    saveBodyMeasurement(newRecord);
    onUpdateMeasurements([newRecord, ...measurements.filter(m => m.id !== newRecord.id)]);
    setShowAddModal(false);
    setNewNotes('');
  };

  const handleExport = () => {
    const json = exportBackupData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitpoulad_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (importBackupData(content)) {
        alert('اطلاعات با موفقیت بازیابی شد!');
        window.location.reload();
      } else {
        alert('خطا در خواندن فایل پشتیبان!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>پرونده فیزیکی و رکوردها</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">روند تغییرات و رشد بدنی</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            مشاهده تغییرات دور عضلات، نمودار تغییرات وزن و تاریخچه جلسات تمرینی گذشته
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-extrabold hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت سایز و وزن جدید</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Weight KPI */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">وزن کنونی</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tabular-nums">{currentWeight}</span>
            <span className="text-xs text-slate-500 font-mono">کیلوگرم</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-mono">
            هدف نهایی: {userProfile.targetWeightKg} کیلوگرم
          </div>
        </div>

        {/* BMI KPI */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">شاخص توده بدنی (BMI)</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tabular-nums">{bmi}</span>
          </div>
          <div className={`text-[11px] mt-2 font-semibold ${bmiStatus.color}`}>
            {bmiStatus.text}
          </div>
        </div>

        {/* Lifetime Volume */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">مجموع وزنه‌های جابجاشده</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-emerald-400 font-mono tabular-nums">
              {(totalLifetimeVolume / 1000).toFixed(1)}
            </span>
            <span className="text-xs text-slate-500 font-mono">تُن آهن</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            رکورد کل تمرینات ثبت شده
          </div>
        </div>

        {/* Total Sessions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
          <div className="text-xs text-slate-400 mb-1">جلسات تمرینی تکمیل‌شده</div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white font-mono tabular-nums">{pastSessions.length}</span>
            <span className="text-xs text-slate-500">جلسه</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            پیوستگی تمرینی در فیت‌پولاد
          </div>
        </div>

      </div>

      {/* Body Measurements History Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">جدول رکوردهای اندازه اندام‌ها</h3>
          <span className="text-xs text-slate-400 font-mono">{measurements.length} رکورد ثبت شده</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 font-medium">
                <th className="pb-3 text-right">تاریخ</th>
                <th className="pb-3 text-center">وزن (kg)</th>
                <th className="pb-3 text-center">چربی %</th>
                <th className="pb-3 text-center">دور سینه (cm)</th>
                <th className="pb-3 text-center">دور بازو (cm)</th>
                <th className="pb-3 text-center">دور کمر (cm)</th>
                <th className="pb-3 text-center">دور ران (cm)</th>
                <th className="pb-3 text-right">یادداشت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {measurements.map((m) => (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 font-mono text-emerald-400 font-bold">{m.date}</td>
                  <td className="py-3 text-center font-mono font-bold text-white">{m.weightKg}</td>
                  <td className="py-3 text-center font-mono text-slate-300">{m.bodyFatPct ? `${m.bodyFatPct}%` : '-'}</td>
                  <td className="py-3 text-center font-mono text-slate-300">{m.chestCm || '-'}</td>
                  <td className="py-3 text-center font-mono text-slate-300">{m.armsCm || '-'}</td>
                  <td className="py-3 text-center font-mono text-slate-300">{m.waistCm || '-'}</td>
                  <td className="py-3 text-center font-mono text-slate-300">{m.thighsCm || '-'}</td>
                  <td className="py-3 text-slate-400 text-[11px] truncate max-w-xs">{m.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Past Workout Sessions Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white">تاریخچه جلسات تمرینی گذشته</h3>
          <span className="text-xs text-slate-400 font-mono">{pastSessions.length} جلسه</span>
        </div>

        <div className="space-y-3">
          {pastSessions.map((s) => {
            const isExpanded = expandedSessionId === s.id;
            return (
              <div
                key={s.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 transition-all"
              >
                <div
                  onClick={() => setExpandedSessionId(isExpanded ? null : s.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="font-mono">{s.date}</span>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span>مدت: {s.durationMinutes} دقیقه</span>
                    </div>
                    <h4 className="text-sm font-bold text-white">{s.nameFa}</h4>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">حجم کل:</span>
                      <span className="text-sm font-bold text-emerald-400 font-mono">
                        {s.totalVolumeKg ? s.totalVolumeKg.toLocaleString() : 0} kg
                      </span>
                    </div>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded exercise details */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                    {s.exercises.map((ex, exI) => (
                      <div key={exI} className="bg-slate-900/60 p-2.5 rounded-xl flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{ex.exerciseNameFa}</span>
                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-400">
                          {ex.sets.map((st, stI) => (
                            <span key={stI} className={`px-2 py-0.5 rounded ${st.completed ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                              {st.weightKg}kg×{st.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Backup and Data Management */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-white">پشتیبان‌گیری و حفاظت از داده‌ها</h4>
          <p className="text-xs text-slate-400 mt-0.5">
            داده‌های شما روی همین مرورگر ذخیره شده‌اند. می‌توانید یک نسخه پشتیبان دانلود کنید.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            دانلود فایل پشتیبان (JSON)
          </button>

          <label className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-colors">
            بازیابی اطلاعات
            <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
          </label>
        </div>
      </div>

      {/* Add Measurement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">ثبت اندازه‌ها و وزن جدید</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMeasurementSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">وزن فعلی (کیلوگرم) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={newWeight}
                    onChange={(e) => setNewWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">درصد تخمینی چربی (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newFatPct}
                    onChange={(e) => setNewFatPct(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">دور سینه (سانتی‌متر)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newChest}
                    onChange={(e) => setNewChest(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">دور بازو (سانتی‌متر)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newArms}
                    onChange={(e) => setNewArms(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">دور کمر (سانتی‌متر)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newWaist}
                    onChange={(e) => setNewWaist(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">دور ران (سانتی‌متر)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newThighs}
                    onChange={(e) => setNewThighs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">یادداشت (اختیاری)</label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="مثلاً: شروع مکمل کراتین و افزایش رکورد اسکات"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                >
                  ثبت در پرونده
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
