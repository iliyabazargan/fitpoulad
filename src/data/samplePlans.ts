import { WorkoutPlanTemplate } from '../types/fitness';

export const SAMPLE_WORKOUT_PLANS: WorkoutPlanTemplate[] = [
  {
    id: 'push-pull-legs',
    titleFa: 'برنامه تخصصی پوش-پول-لگز (PPL)',
    splitType: '۳ یا ۶ روز در هفته',
    descriptionFa: 'محبوب‌ترین و موثرترین متد تفکیک عضلات در بدنسازی مدرن برای ساخت حداکثر حجم عضلانی و هایپرتروفی.',
    difficulty: 'متوسط',
    days: [
      {
        dayNameFa: 'روز ۱: حرکات فشاری (سینه، سرشانه، پشت بازو)',
        focusFa: 'Push Day - بالاتنه جلو',
        exercises: [
          { exerciseId: 'bench-press-barbell', defaultSets: 4, defaultReps: 8, defaultWeightKg: 60 },
          { exerciseId: 'incline-dumbbell-press', defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
          { exerciseId: 'dumbbell-shoulder-press', defaultSets: 3, defaultReps: 10, defaultWeightKg: 16 },
          { exerciseId: 'lateral-raises', defaultSets: 4, defaultReps: 15, defaultWeightKg: 8 },
          { exerciseId: 'tricep-rope-pushdown', defaultSets: 3, defaultReps: 12, defaultWeightKg: 25 },
        ]
      },
      {
        dayNameFa: 'روز ۲: حرکات کششی (زیربغل، فیله، جلو بازو)',
        focusFa: 'Pull Day - عضلات پشت',
        exercises: [
          { exerciseId: 'deadlift-barbell', defaultSets: 3, defaultReps: 6, defaultWeightKg: 80 },
          { exerciseId: 'lat-pulldown', defaultSets: 4, defaultReps: 10, defaultWeightKg: 45 },
          { exerciseId: 'seated-cable-row', defaultSets: 3, defaultReps: 12, defaultWeightKg: 40 },
          { exerciseId: 'face-pulls', defaultSets: 3, defaultReps: 15, defaultWeightKg: 20 },
          { exerciseId: 'barbell-bicep-curl', defaultSets: 3, defaultReps: 10, defaultWeightKg: 25 },
          { exerciseId: 'hammer-curl', defaultSets: 3, defaultReps: 12, defaultWeightKg: 12 },
        ]
      },
      {
        dayNameFa: 'روز ۳: عضلات پا و شکم',
        focusFa: 'Legs & Core Day - پایین‌تنه',
        exercises: [
          { exerciseId: 'barbell-squat', defaultSets: 4, defaultReps: 8, defaultWeightKg: 70 },
          { exerciseId: 'leg-press', defaultSets: 3, defaultReps: 12, defaultWeightKg: 120 },
          { exerciseId: 'lying-leg-curl', defaultSets: 3, defaultReps: 12, defaultWeightKg: 35 },
          { exerciseId: 'standing-calf-raise', defaultSets: 4, defaultReps: 15, defaultWeightKg: 50 },
          { exerciseId: 'hanging-leg-raise', defaultSets: 3, defaultReps: 15, defaultWeightKg: 0 },
          { exerciseId: 'plank', defaultSets: 3, defaultReps: 45, defaultWeightKg: 0 },
        ]
      }
    ]
  },
  {
    id: 'full-body-beginner',
    titleFa: 'برنامه ۳ روزه کل بدن (Full Body)',
    splitType: '۳ روز در هفته (یک روز در میان)',
    descriptionFa: 'بهترین برنامه برای افرادی که به تازگی ورزش را شروع کرده‌اند یا زمان محدودی در طول هفته دارند.',
    difficulty: 'مبتدی',
    days: [
      {
        dayNameFa: 'جلسه اول (فول بادی A)',
        focusFa: 'عضلات اصلی بالاتنه و پایین‌تنه',
        exercises: [
          { exerciseId: 'barbell-squat', defaultSets: 3, defaultReps: 10, defaultWeightKg: 40 },
          { exerciseId: 'bench-press-barbell', defaultSets: 3, defaultReps: 10, defaultWeightKg: 40 },
          { exerciseId: 'lat-pulldown', defaultSets: 3, defaultReps: 10, defaultWeightKg: 35 },
          { exerciseId: 'dumbbell-shoulder-press', defaultSets: 3, defaultReps: 10, defaultWeightKg: 10 },
          { exerciseId: 'standard-crunch', defaultSets: 3, defaultReps: 20, defaultWeightKg: 0 },
        ]
      },
      {
        dayNameFa: 'جلسه دوم (فول بادی B)',
        focusFa: 'تمرکز بر حرکات مکمل و فرم صحیح',
        exercises: [
          { exerciseId: 'leg-press', defaultSets: 3, defaultReps: 12, defaultWeightKg: 80 },
          { exerciseId: 'push-ups', defaultSets: 3, defaultReps: 12, defaultWeightKg: 0 },
          { exerciseId: 'seated-cable-row', defaultSets: 3, defaultReps: 12, defaultWeightKg: 30 },
          { exerciseId: 'barbell-bicep-curl', defaultSets: 3, defaultReps: 12, defaultWeightKg: 15 },
          { exerciseId: 'tricep-rope-pushdown', defaultSets: 3, defaultReps: 12, defaultWeightKg: 15 },
        ]
      }
    ]
  },
  {
    id: 'upper-lower-hypertrophy',
    titleFa: 'برنامه تفکیکی ۴ روزه بالاتنه / پایین‌تنه',
    splitType: '۴ روز در هفته (۲ روز تمرین، ۱ روز استراحت)',
    descriptionFa: 'ترکیبی عالی از تمرینات قدرتی و حجم دهنده با فرکانس ایده‌آل دو بار در هفته برای هر گروه عضلانی.',
    difficulty: 'پیشرفته',
    days: [
      {
        dayNameFa: 'روز ۱: بالاتنه سنگین و قدرتی',
        focusFa: 'Upper Body Heavy',
        exercises: [
          { exerciseId: 'bench-press-barbell', defaultSets: 4, defaultReps: 6, defaultWeightKg: 70 },
          { exerciseId: 'bent-over-barbell-row', defaultSets: 4, defaultReps: 8, defaultWeightKg: 50 },
          { exerciseId: 'dumbbell-shoulder-press', defaultSets: 3, defaultReps: 8, defaultWeightKg: 18 },
          { exerciseId: 'skull-crushers', defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
          { exerciseId: 'preacher-curl', defaultSets: 3, defaultReps: 10, defaultWeightKg: 20 },
        ]
      },
      {
        dayNameFa: 'روز ۲: پایین‌تنه سنگین',
        focusFa: 'Lower Body Heavy',
        exercises: [
          { exerciseId: 'barbell-squat', defaultSets: 4, defaultReps: 6, defaultWeightKg: 80 },
          { exerciseId: 'lying-leg-curl', defaultSets: 4, defaultReps: 10, defaultWeightKg: 40 },
          { exerciseId: 'leg-extension', defaultSets: 3, defaultReps: 12, defaultWeightKg: 45 },
          { exerciseId: 'standing-calf-raise', defaultSets: 4, defaultReps: 12, defaultWeightKg: 60 },
          { exerciseId: 'plank', defaultSets: 3, defaultReps: 60, defaultWeightKg: 0 },
        ]
      }
    ]
  }
];
