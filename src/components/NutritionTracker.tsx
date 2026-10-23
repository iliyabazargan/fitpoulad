import React, { useState } from 'react';
import { Utensils, Droplets, Plus, Trash2, Calculator, Sparkles, X, Check, Flame } from 'lucide-react';
import { DailyNutrition, MealEntry, UserProfile } from '../types/fitness';
import { saveDailyNutrition } from '../utils/storage';

interface NutritionTrackerProps {
  nutrition: DailyNutrition;
  onUpdateNutrition: (data: DailyNutrition) => void;
  userProfile: UserProfile;
}

const COMMON_FITNESS_FOODS = [
  { nameFa: 'سینه مرغ گریل (۲۰۰ گرم)', calories: 330, proteinG: 62, carbsG: 0, fatG: 7 },
  { nameFa: '۴ سفیده تخم‌مرغ + ۱ زرده', calories: 140, proteinG: 18, carbsG: 1, fatG: 5 },
  { nameFa: 'اوتمیل جو دوسر (۸۰ گرم)', calories: 300, proteinG: 11, carbsG: 54, fatG: 5 },
  { nameFa: 'کته زعفرانی (۲۰۰ گرم)', calories: 260, proteinG: 5, carbsG: 58, fatG: 1 },
  { nameFa: 'شیک وی پروتئین (۱ اسکوپ)', calories: 120, proteinG: 24, carbsG: 2, fatG: 1.5 },
  { nameFa: 'کنسرو تن ماهی در آب‌نمک', calories: 180, proteinG: 38, carbsG: 0, fatG: 2 },
  { nameFa: 'کره بادام‌زمینی طبیعی (۲ قاشق)', calories: 190, proteinG: 8, carbsG: 7, fatG: 16 },
  { nameFa: 'سیب‌زمینی آب‌پز (۲۵۰ گرم)', calories: 215, proteinG: 5, carbsG: 49, fatG: 0.2 },
];

export const NutritionTracker: React.FC<NutritionTrackerProps> = ({
  nutrition,
  onUpdateNutrition,
  userProfile,
}) => {
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [showCalculatorModal, setShowCalculatorModal] = useState(false);

  // New meal form state
  const [mealType, setMealType] = useState<MealEntry['mealType']>('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCals, setMealCals] = useState<number>(300);
  const [mealProtein, setMealProtein] = useState<number>(30);
  const [mealCarbs, setMealCarbs] = useState<number>(35);
  const [mealFat, setMealFat] = useState<number>(5);

  // Calculator form state
  const [calcWeight, setCalcWeight] = useState(userProfile.currentWeightKg || 75);
  const [calcHeight, setCalcHeight] = useState(userProfile.heightCm || 178);
  const [calcAge, setCalcAge] = useState(userProfile.age || 26);
  const [calcGoal, setCalcGoal] = useState<'muscle_gain' | 'fat_loss' | 'maintenance'>('muscle_gain');

  // Daily totals
  const totalCalories = nutrition.meals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = nutrition.meals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbs = nutrition.meals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFat = nutrition.meals.reduce((acc, m) => acc + m.fatG, 0);

  const calProgress = Math.min(100, Math.round((totalCalories / nutrition.targetCalories) * 100));
  const proteinProgress = Math.min(100, Math.round((totalProtein / nutrition.targetProteinG) * 100));

  // Water handler
  const handleWaterChange = (delta: number) => {
    const updated = {
      ...nutrition,
      waterGlasses: Math.max(0, Math.min(20, nutrition.waterGlasses + delta)),
    };
    onUpdateNutrition(updated);
    saveDailyNutrition(updated);
  };

  const handleSelectPreset = (food: typeof COMMON_FITNESS_FOODS[0]) => {
    setMealName(food.nameFa);
    setMealCals(food.calories);
    setMealProtein(food.proteinG);
    setMealCarbs(food.carbsG);
    setMealFat(food.fatG);
  };

  const handleAddMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    const typeLabels: Record<MealEntry['mealType'], string> = {
      breakfast: 'صبحانه',
      lunch: 'ناهار',
      dinner: 'شام',
      snack: 'میان‌وعده',
      supplement: 'مکمل ورزشی'
    };

    const newMeal: MealEntry = {
      id: `meal-${Date.now()}`,
      mealType,
      mealTypeFa: typeLabels[mealType],
      nameFa: mealName.trim(),
      calories: Number(mealCals) || 0,
      proteinG: Number(mealProtein) || 0,
      carbsG: Number(mealCarbs) || 0,
      fatG: Number(mealFat) || 0,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    const updated = {
      ...nutrition,
      meals: [...nutrition.meals, newMeal],
    };

    onUpdateNutrition(updated);
    saveDailyNutrition(updated);

    // reset
    setMealName('');
    setShowAddMealModal(false);
  };

  const handleDeleteMeal = (mealId: string) => {
    const updated = {
      ...nutrition,
      meals: nutrition.meals.filter(m => m.id !== mealId),
    };
    onUpdateNutrition(updated);
    saveDailyNutrition(updated);
  };

  const handleApplyCalculator = () => {
    // Mifflin-St Jeor formula
    const bmr = (10 * calcWeight) + (6.25 * calcHeight) - (5 * calcAge) + 5;
    const tdee = bmr * 1.45; // moderate workout factor

    let targetCal = Math.round(tdee);
    if (calcGoal === 'muscle_gain') targetCal += 350;
    if (calcGoal === 'fat_loss') targetCal -= 450;

    // Macro breakdown: 2g protein per kg, 25% fats, remaining carbs
    const targetProtein = Math.round(calcWeight * 2.0);
    const targetFat = Math.round((targetCal * 0.25) / 9);
    const targetCarbs = Math.round((targetCal - (targetProtein * 4) - (targetFat * 9)) / 4);

    const updated = {
      ...nutrition,
      targetCalories: targetCal,
      targetProteinG: targetProtein,
      targetCarbsG: Math.max(100, targetCarbs),
      targetFatG: targetFat,
    };

    onUpdateNutrition(updated);
    saveDailyNutrition(updated);
    setShowCalculatorModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Calculator trigger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
            <Flame className="w-4 h-4" />
            <span>مدیریت سوخت‌وساز و درشت‌مغذی‌ها</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">تغذیه و کالری‌شماری هوشمند</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            پایش دقیق پروتئین برای رشد عضلانی، کالری روزانه و هیدراتاسیون آب بدن
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCalculatorModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors"
          >
            <Calculator className="w-4 h-4 text-emerald-400" />
            <span>محاسبه‌گر نیاز کالری (BMR)</span>
          </button>

          <button
            onClick={() => setShowAddMealModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-emerald-500 text-slate-950 text-xs font-extrabold hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>ثبت وعده غذایی</span>
          </button>
        </div>
      </div>

      {/* Calories and Macros KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Total Calories Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-white">کالری دریافتی امروز</span>
              <span className="font-mono text-emerald-400 font-bold">{calProgress}%</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-black text-white font-mono tabular-nums">{totalCalories}</span>
              <span className="text-xs text-slate-500 font-mono">/ {nutrition.targetCalories} kcal</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${calProgress}%` }}
            />
          </div>
        </div>

        {/* Protein Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-white">پروتئین (عضله‌ساز)</span>
              <span className="font-mono text-blue-400 font-bold">{proteinProgress}%</span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-black text-blue-400 font-mono tabular-nums">{totalProtein}</span>
              <span className="text-xs text-slate-500 font-mono">/ {nutrition.targetProteinG} g</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${proteinProgress}%` }}
            />
          </div>
        </div>

        {/* Carbs Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-white">کربوهیدرات (انرژی تمرین)</span>
              <span className="font-mono text-amber-400 font-bold">
                {Math.round((totalCarbs / nutrition.targetCarbsG) * 100)}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-black text-amber-400 font-mono tabular-nums">{totalCarbs}</span>
              <span className="text-xs text-slate-500 font-mono">/ {nutrition.targetCarbsG} g</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalCarbs / nutrition.targetCarbsG) * 100)}%` }}
            />
          </div>
        </div>

        {/* Fat Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-white">چربی مفید (تستوسترون)</span>
              <span className="font-mono text-rose-400 font-bold">
                {Math.round((totalFat / nutrition.targetFatG) * 100)}%
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mb-3">
              <span className="text-3xl font-black text-rose-400 font-mono tabular-nums">{totalFat}</span>
              <span className="text-xs text-slate-500 font-mono">/ {nutrition.targetFatG} g</span>
            </div>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-rose-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (totalFat / nutrition.targetFatG) * 100)}%` }}
            />
          </div>
        </div>

      </div>

      {/* Water Tracker Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Droplets className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">ردیاب آب مصرفی روزانه</h3>
              <p className="text-xs text-slate-400">
                هر لیوان معادل ۲۵۰ سی‌سی (مجموع: {(nutrition.waterGlasses * 0.25).toFixed(1)} لیتر از {(nutrition.targetWaterGlasses * 0.25).toFixed(1)} لیتر هدف)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleWaterChange(-1)}
              className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-mono text-base font-bold flex items-center justify-center transition-colors active:scale-95"
              title="یک لیوان کمتر"
            >
              -
            </button>
            <span className="text-base font-mono font-bold text-cyan-400 px-2 tabular-nums">
              {nutrition.waterGlasses} / {nutrition.targetWaterGlasses}
            </span>
            <button
              onClick={() => handleWaterChange(1)}
              className="px-4 h-10 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-cyan-400 transition-colors active:scale-95 shadow-md shadow-cyan-500/20"
              title="ثبت ۱ لیوان آب"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+۱ لیوان آب</span>
            </button>
          </div>
        </div>

        {/* Visual glass icons */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {Array.from({ length: nutrition.targetWaterGlasses }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const next = idx + 1;
                const updated = { ...nutrition, waterGlasses: next };
                onUpdateNutrition(updated);
                saveDailyNutrition(updated);
              }}
              className={`w-9 h-11 rounded-lg border flex flex-col items-center justify-end p-1 transition-all ${
                idx < nutrition.waterGlasses
                  ? 'bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-sm shadow-cyan-500/20'
                  : 'bg-slate-950/60 border-slate-800 text-slate-600 hover:border-slate-700'
              }`}
            >
              <div 
                className={`w-full rounded transition-all ${idx < nutrition.waterGlasses ? 'bg-cyan-400 h-5' : 'bg-slate-800 h-1'}`} 
              />
              <span className="text-[9px] font-mono mt-0.5">{idx + 1}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Meals Log List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-white">وعده‌ها و میان‌وعده‌های امروز</h3>
            <p className="text-xs text-slate-400 mt-0.5">{nutrition.meals.length} وعده ثبت شده</p>
          </div>
          <button
            onClick={() => setShowAddMealModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>افزودن غذا</span>
          </button>
        </div>

        {nutrition.meals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            هنوز وعده‌ای برای امروز ثبت نشده است. روی دکمه «ثبت وعده غذایی» کلیک کنید.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {nutrition.meals.map((meal) => (
              <div key={meal.id} className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="text-emerald-400 font-semibold">{meal.mealTypeFa}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="font-mono text-[11px] text-slate-500">{meal.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{meal.nameFa}</h4>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-1 font-mono">
                    <span className="text-blue-400 font-semibold">{meal.proteinG}g پروتئین</span>
                    <span className="text-amber-400">{meal.carbsG}g کربوهیدرات</span>
                    <span className="text-rose-400">{meal.fatG}g چربی</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-black text-white font-mono">{meal.calories}</span>
                    <span className="text-[10px] text-slate-500 block">kcal</span>
                  </div>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
                    title="حذف وعده"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">ثبت وعده غذایی جدید</h3>
              <button
                onClick={() => setShowAddMealModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets */}
            <div className="mb-4">
              <span className="text-xs text-slate-400 block mb-2">غذاهای محبوب بدنسازی (انتخاب سریع):</span>
              <div className="flex flex-wrap gap-1.5">
                {COMMON_FITNESS_FOODS.slice(0, 6).map((food, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(food)}
                    className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg border border-slate-700/50 transition-colors"
                  >
                    {food.nameFa}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAddMealSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">نوع وعده</label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as MealEntry['mealType'])}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="breakfast">صبحانه</option>
                  <option value="lunch">ناهار</option>
                  <option value="dinner">شام</option>
                  <option value="snack">میان‌وعده</option>
                  <option value="supplement">مکمل ورزشی</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">نام غذا و مقدار</label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="مثلاً: فیله مرغ ۲۰۰ گرم با کته و سالاد"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">کالری (kcal)</label>
                  <input
                    type="number"
                    min="0"
                    value={mealCals}
                    onChange={(e) => setMealCals(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-blue-400 block mb-1">پروتئین (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={mealProtein}
                    onChange={(e) => setMealProtein(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-amber-400 block mb-1">کربوهیدرات (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-rose-400 block mb-1">چربی (g)</label>
                  <input
                    type="number"
                    min="0"
                    value={mealFat}
                    onChange={(e) => setMealFat(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMealModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
                >
                  افزودن به برنامه امروز
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smart BMR & Target Calculator Modal */}
      {showCalculatorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">محاسبه‌گر کالری و درشت‌مغذی‌ها</h3>
              </div>
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              بر اساس فرمول استاندارد میفلین-سنت ژور برای تعیین نیاز متابولیک پایه (BMR) و ماکروهای مورد نیاز هدف بدنسازی شما.
            </p>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">وزن (کیلوگرم)</label>
                  <input
                    type="number"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">قد (سانتی‌متر)</label>
                  <input
                    type="number"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">سن (سال)</label>
                  <input
                    type="number"
                    value={calcAge}
                    onChange={(e) => setCalcAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">هدف بدنسازی شما</label>
                <select
                  value={calcGoal}
                  onChange={(e) => setCalcGoal(e.target.value as 'muscle_gain' | 'fat_loss' | 'maintenance')}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white"
                >
                  <option value="muscle_gain">حجم خشک و عضله‌سازی (+۳۵۰ کالری مازاد)</option>
                  <option value="fat_loss">چربی‌سوزی و تفکیک عضلات (-۴۵۰ کالری کسری)</option>
                  <option value="maintenance">تثبیت وزن و بازسازی عضلانی (حفظ تعادل)</option>
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">توصیه علمی برنامه:</span>
                روزانه ۲ گرم پروتئین به ازای هر کیلو وزن بدن جهت تحریک حداکثری ساخت پروتئین عضلانی (MPS).
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-2">
              <button
                onClick={() => setShowCalculatorModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                onClick={handleApplyCalculator}
                className="px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
              >
                اعمال به عنوان هدف روزانه
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
