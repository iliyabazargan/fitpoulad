import { BodyMeasurement, DailyNutrition, UserProfile, WorkoutSession } from '../types/fitness';
import { SAMPLE_WORKOUT_PLANS } from '../data/samplePlans';
import { EXERCISES_DATABASE } from '../data/exercises';

const STORAGE_KEYS = {
  PROFILE: 'fitpoulad_profile',
  ACTIVE_SESSION: 'fitpoulad_active_session',
  PAST_SESSIONS: 'fitpoulad_past_sessions',
  NUTRITION_PREFIX: 'fitpoulad_nutrition_',
  MEASUREMENTS: 'fitpoulad_measurements',
  HAS_SEEN_ONBOARDING: 'fitpoulad_seen_onboarding',
};

export const defaultProfile: UserProfile = {
  name: 'ورزشکار پولادین',
  age: 26,
  gender: 'male',
  heightCm: 178,
  currentWeightKg: 76,
  targetWeightKg: 80,
  activityLevel: 'moderate',
  fitnessGoal: 'muscle_gain',
  experienceLevel: 'intermediate',
};

export function getTodayDateString(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return defaultProfile;
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function hasSeenOnboarding(): boolean {
  return localStorage.getItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING) === 'true';
}

export function markOnboardingSeen(): void {
  localStorage.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, 'true');
}

export function loadActiveWorkoutSession(): WorkoutSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }
  return null;
}

export function saveActiveWorkoutSession(session: WorkoutSession | null): void {
  if (!session) {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  } else {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }
}

export function loadPastWorkoutSessions(): WorkoutSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAST_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  // Initial seed with two realistic completed sessions so user sees realistic history right away
  const seededSessions: WorkoutSession[] = [
    {
      id: 'session-seed-1',
      date: '2026-10-21',
      nameFa: 'حرکات فشاری (سینه و سرشانه)',
      durationMinutes: 52,
      completed: true,
      totalVolumeKg: 4280,
      exercises: [
        {
          exerciseId: 'bench-press-barbell',
          exerciseNameFa: 'پرس سینه هالتر',
          exerciseNameEn: 'Barbell Bench Press',
          muscleGroup: 'chest',
          equipment: 'هالتر',
          sets: [
            { id: 's1', setNumber: 1, weightKg: 50, reps: 10, completed: true, targetReps: 10, targetWeightKg: 50 },
            { id: 's2', setNumber: 2, weightKg: 60, reps: 8, completed: true, targetReps: 8, targetWeightKg: 60 },
            { id: 's3', setNumber: 3, weightKg: 65, reps: 8, completed: true, targetReps: 8, targetWeightKg: 65 },
          ]
        },
        {
          exerciseId: 'incline-dumbbell-press',
          exerciseNameFa: 'پرس بالا سینه دمبل',
          exerciseNameEn: 'Incline Dumbbell Press',
          muscleGroup: 'chest',
          equipment: 'دمبل',
          sets: [
            { id: 's4', setNumber: 1, weightKg: 20, reps: 10, completed: true, targetReps: 10, targetWeightKg: 20 },
            { id: 's5', setNumber: 2, weightKg: 22, reps: 8, completed: true, targetReps: 8, targetWeightKg: 22 },
          ]
        }
      ]
    }
  ];
  localStorage.setItem(STORAGE_KEYS.PAST_SESSIONS, JSON.stringify(seededSessions));
  return seededSessions;
}

export function saveCompletedSession(session: WorkoutSession): void {
  const current = loadPastWorkoutSessions();
  const filtered = current.filter(s => s.id !== session.id);
  const updated = [session, ...filtered];
  localStorage.setItem(STORAGE_KEYS.PAST_SESSIONS, JSON.stringify(updated));
  saveActiveWorkoutSession(null);
}

export function createNewWorkoutSessionFromTemplate(planId: string, dayIndex: number = 0): WorkoutSession {
  const plan = SAMPLE_WORKOUT_PLANS.find(p => p.id === planId) || SAMPLE_WORKOUT_PLANS[0];
  const day = plan.days[dayIndex] || plan.days[0];

  const exercises = day.exercises.map(planEx => {
    const exData = EXERCISES_DATABASE.find(e => e.id === planEx.exerciseId);
    const sets = Array.from({ length: planEx.defaultSets }).map((_, idx) => ({
      id: `set-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      setNumber: idx + 1,
      weightKg: planEx.defaultWeightKg,
      reps: planEx.defaultReps,
      targetReps: planEx.defaultReps,
      targetWeightKg: planEx.defaultWeightKg,
      completed: false,
      restSeconds: 90,
    }));

    return {
      exerciseId: planEx.exerciseId,
      exerciseNameFa: exData?.nameFa || 'حرکت ورزشی',
      exerciseNameEn: exData?.nameEn || '',
      muscleGroup: exData?.muscleGroup || 'chest',
      equipment: exData?.equipment || 'هالتر',
      sets,
    };
  });

  const newSession: WorkoutSession = {
    id: `session-${Date.now()}`,
    date: getTodayDateString(),
    nameFa: `${plan.titleFa} - ${day.dayNameFa}`,
    durationMinutes: 0,
    completed: false,
    totalVolumeKg: 0,
    exercises,
  };

  saveActiveWorkoutSession(newSession);
  return newSession;
}

export function loadDailyNutrition(date: string = getTodayDateString()): DailyNutrition {
  const key = `${STORAGE_KEYS.NUTRITION_PREFIX}${date}`;
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const defaultNut: DailyNutrition = {
    date,
    targetCalories: 2600,
    targetProteinG: 160,
    targetCarbsG: 310,
    targetFatG: 65,
    waterGlasses: 5,
    targetWaterGlasses: 10,
    meals: [
      {
        id: 'meal-1',
        mealType: 'breakfast',
        mealTypeFa: 'صبحانه',
        nameFa: 'اوتمیل جو دوسر + ۴ سفیده تخم‌مرغ + کره بادام‌زمینی',
        calories: 520,
        proteinG: 34,
        carbsG: 60,
        fatG: 14,
        time: '۰۸:۳۰',
      },
      {
        id: 'meal-2',
        mealType: 'lunch',
        mealTypeFa: 'ناهار',
        nameFa: 'سینه مرغ گریل شده (۲۰۰ گرم) + کته زعفرانی + بروکلی',
        calories: 680,
        proteinG: 52,
        carbsG: 75,
        fatG: 12,
        time: '۱۳:۴۵',
      }
    ]
  };
  localStorage.setItem(key, JSON.stringify(defaultNut));
  return defaultNut;
}

export function saveDailyNutrition(data: DailyNutrition): void {
  const key = `${STORAGE_KEYS.NUTRITION_PREFIX}${data.date}`;
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadBodyMeasurements(): BodyMeasurement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEASUREMENTS);
    if (raw) return JSON.parse(raw);
  } catch {
    // fallback
  }

  const seeded: BodyMeasurement[] = [
    {
      id: 'm-1',
      date: '2026-09-15',
      weightKg: 74.2,
      bodyFatPct: 16.5,
      chestCm: 101,
      waistCm: 84,
      armsCm: 36,
      thighsCm: 56,
      notes: 'شروع دوره جدید حجم تمیز'
    },
    {
      id: 'm-2',
      date: '2026-10-01',
      weightKg: 75.1,
      bodyFatPct: 16.0,
      chestCm: 102.5,
      waistCm: 83.5,
      armsCm: 36.8,
      thighsCm: 57,
      notes: 'افزایش خوب دور بازو و سینه'
    },
    {
      id: 'm-3',
      date: '2026-10-20',
      weightKg: 76.0,
      bodyFatPct: 15.5,
      chestCm: 104,
      waistCm: 83,
      armsCm: 37.5,
      thighsCm: 58,
      notes: 'رشد عضلانی عالی با حفظ خطوط شکم'
    }
  ];
  localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(seeded));
  return seeded;
}

export function saveBodyMeasurement(record: BodyMeasurement): void {
  const all = loadBodyMeasurements();
  const updated = [record, ...all.filter(m => m.id !== record.id)];
  localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(updated));
}

export function exportBackupData(): string {
  const backup = {
    profile: loadUserProfile(),
    activeSession: loadActiveWorkoutSession(),
    pastSessions: loadPastWorkoutSessions(),
    measurements: loadBodyMeasurements(),
    timestamp: new Date().toISOString(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonString: string): boolean {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.profile) saveUserProfile(parsed.profile);
    if (parsed.pastSessions) localStorage.setItem(STORAGE_KEYS.PAST_SESSIONS, JSON.stringify(parsed.pastSessions));
    if (parsed.measurements) localStorage.setItem(STORAGE_KEYS.MEASUREMENTS, JSON.stringify(parsed.measurements));
    return true;
  } catch {
    return false;
  }
}
