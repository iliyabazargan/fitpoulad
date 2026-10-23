import React, { useState } from 'react';
import { User, X, Check, RotateCcw } from 'lucide-react';
import { UserProfile } from '../types/fitness';
import { saveUserProfile, defaultProfile } from '../utils/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (p: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
}) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserProfile(formData);
    onUpdateProfile(formData);
    onClose();
  };

  const handleReset = () => {
    if (confirm('آیا مایل به بازگرداندن مقادیر پیش‌فرض هستید؟')) {
      setFormData(defaultProfile);
      saveUserProfile(defaultProfile);
      onUpdateProfile(defaultProfile);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100">
        
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">مشخصات و پروفایل ورزشی</h3>
              <p className="text-xs text-slate-400">تنظیم پارامترهای بدنی برای محاسبه دقیق‌تر کالری و برنامه‌ها</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-slate-400 block mb-1">نام یا نام مستعار شما</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">سن</label>
              <input
                type="number"
                min="12"
                max="90"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">قد (سانتی‌متر)</label>
              <input
                type="number"
                min="100"
                max="230"
                value={formData.heightCm}
                onChange={(e) => setFormData({ ...formData, heightCm: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">وزن کنونی (kg)</label>
              <input
                type="number"
                min="35"
                max="200"
                step="0.5"
                value={formData.currentWeightKg}
                onChange={(e) => setFormData({ ...formData, currentWeightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">وزن هدف (kg)</label>
              <input
                type="number"
                min="35"
                max="200"
                step="0.5"
                value={formData.targetWeightKg}
                onChange={(e) => setFormData({ ...formData, targetWeightKg: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">سطح تجربه تمرینی</label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as UserProfile['experienceLevel'] })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="beginner">مبتدی (زیر ۶ ماه)</option>
                <option value="intermediate">متوسط (۶ ماه تا ۲ سال)</option>
                <option value="advanced">پیشرفته (بالای ۲ سال سابقه)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">هدف اصلی شما در بدنسازی</label>
            <select
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value as UserProfile['fitnessGoal'] })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="muscle_gain">افزایش حجم عضلانی و هایپرتروفی (Bulking)</option>
              <option value="fat_loss">چربی‌سوزی و تفکیک خطوط عضلات (Cutting)</option>
              <option value="strength">افزایش قدرت و رکوردها (Powerlifting/Strength)</option>
              <option value="recomposition">ریکامپوزیشین (کاهش چربی همزمان با عضله‌سازی)</option>
            </select>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>بازنشانی به پیش‌فرض</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                انصراف
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20"
              >
                <Check className="w-4 h-4" />
                ذخیره مشخصات
              </button>
            </div>
          </div>
        </form>

      </div>
    </div>
  );
};
