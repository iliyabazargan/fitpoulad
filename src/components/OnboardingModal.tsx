import React, { useState } from 'react';
import { Dumbbell, Clock, BookOpen, Utensils, TrendingUp, CheckCircle, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartWorkoutNow?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  onStartWorkoutNow,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'خوش آمدید به فیت‌پولاد! 🏋️‍♂️',
      subtitle: 'دستیار هوشمند و دفترچه مربیگری شما در سالن بدنسازی',
      description: 'شما نیازی به هیچ دانش فنی یا نوشتن روی کاغذ در باشگاه ندارید. فیت‌پولاد طوری طراحی شده که هنگام تمرین تنها با چند لمس ساده، وزنه‌ها را ثبت کنید، با تایمر هوشمند استراحت کنید و پیشرفت بدنی‌تان را دنبال کنید.',
      icon: Dumbbell,
      color: 'emerald',
      actionHint: 'بسیار ساده، بدون نیاز به کاغذ و قلم!',
    },
    {
      title: 'گام اول: اجرای برنامه تمرینی',
      subtitle: 'انتخاب جلسه تمرین و ثبت وزنه‌ها در هر ست',
      description: 'وارد تب «جلسه تمرین» شوید. برنامه امروز شما (مثلاً حرکات سینه و سرشانه یا فول‌بادی) آماده است. برای هر حرکت، وزنه‌ای که زدید و تعداد تکرار را می‌بینید. به محض اتمام هر ست، روی دکمه تیک ست ضربه بزنید.',
      icon: CheckCircle,
      color: 'blue',
      actionHint: 'با زدن تیک هر ست، تایمر استراحت خودکار روشن می‌شود!',
    },
    {
      title: 'گام دوم: تایمر هوشمند بین ست‌ها',
      subtitle: 'ریکاوری علمی و به موقع عضلات بدون اتلاف وقت',
      description: 'پس از زدن تیک هر ست، یک تایمر شمارش معکوس دایره‌ای فعال می‌شود. در ۵ ثانیه آخر با بوق ملایم به شما هشدار می‌دهد تا گوشی را کنار بگذارید و ست بعدی را با تمرکز کامل شروع کنید.',
      icon: Clock,
      color: 'amber',
      actionHint: 'می‌توانید زمان استراحت را ۶۰، ۹۰ یا ۱۲۰ ثانیه تنظیم کنید.',
    },
    {
      title: 'گام سوم: بانک حرکات و فرم صحیح',
      subtitle: 'پیشگیری تضمینی از آسیب‌های مفصلی و ستون فقرات',
      description: 'در بخش «بانک حرکات»، تمام حرکات بدنسازی بر اساس عضله هدف (سینه، زیربغل، پا، سرشانه و...) دسته‌بندی شده‌اند. با زدن روی هر حرکت، نحوه اجرای گام‌به‌گام، اشتباهات متداول و فوت‌وفن مربیان را مطالعه کنید.',
      icon: BookOpen,
      color: 'purple',
      actionHint: 'بیش از ۳۰ حرکت استاندارد همراه با نکات ایمنی.',
    },
    {
      title: 'گام چهارم: ردیاب آب و کالری روزانه',
      subtitle: 'تغذیه هوشمند، کالری‌شماری و مصرف کافی آب',
      description: 'در بخش «کالری و تغذیه»، با یک کلیک لیوان‌های آب مصرفی امروزتان را ثبت کنید. همچنین می‌توانید کالری و درشت‌مغذی‌های وعده‌ها (پروتئین، کربوهیدرات و چربی) را مدیریت کنید تا بدنتان به فاز آنابولیک و عضله‌سازی برسد.',
      icon: Utensils,
      color: 'teal',
      actionHint: 'محاسبه‌گر خودکار نیاز کالری و پروتئین متناسب با وزن شما.',
    },
    {
      title: 'گام پنجم: پرونده و نمودار پیشرفت بدنی',
      subtitle: 'مشاهده رشد عضلات و کاهش چربی بدن به مرور زمان',
      description: 'در بخش «پیشرفت»، هر هفته یا هر ماه وزن و سایز دور بازو، سینه، کمر و ران خود را وارد کنید. نمودارهای آماری به شما نشان می‌دهند چقدر به هدف فیتنس خود نزدیک شده‌اید و حجم وزنه‌های جابجاشده چقدر افزایش یافته است.',
      icon: TrendingUp,
      color: 'emerald',
      actionHint: 'حفظ دائمی اطلاعات در گوشی شما حتی به صورت آفلاین!',
    },
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onClose();
      if (onStartWorkoutNow) onStartWorkoutNow();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100 flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition-colors"
          title="بستن راهنما"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Step indicator pills */}
        <div className="flex items-center justify-center gap-1.5 mb-6">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentStep ? 'w-8 bg-emerald-500' : 'w-2 bg-slate-700 hover:bg-slate-600'}`}
              title={`مرحله ${idx + 1}`}
            />
          ))}
        </div>

        {/* Card Content */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-5 shadow-lg shadow-emerald-500/10">
            <StepIcon className="w-8 h-8" />
          </div>

          <span className="text-xs font-semibold text-emerald-400 tracking-wide mb-1">
            مرحله {currentStep + 1} از {steps.length}
          </span>

          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {step.title}
          </h3>

          <p className="text-sm font-medium text-emerald-300/90 mb-4">
            {step.subtitle}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed max-w-md mb-6">
            {step.description}
          </p>

          <div className="w-full bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5 mb-6 text-xs text-slate-300 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{step.actionHint}</span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-medium transition-colors ${currentStep === 0 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            <ChevronRight className="w-4 h-4" />
            قبلی
          </button>

          <div className="text-xs text-slate-500 font-mono">
            {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            {currentStep === steps.length - 1 ? (
              <>
                شروع تمرین در باشگاه
                <CheckCircle className="w-4 h-4" />
              </>
            ) : (
              <>
                بعدی
                <ChevronLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
