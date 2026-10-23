export type MuscleGroup = 
  | 'chest' 
  | 'back' 
  | 'shoulders' 
  | 'biceps' 
  | 'triceps' 
  | 'legs' 
  | 'core' 
  | 'cardio';

export type ExerciseDifficulty = 'مبتدی' | 'متوسط' | 'پیشرفته';

export type EquipmentType = 
  | 'هالتر' 
  | 'دمبل' 
  | 'دستگاه' 
  | 'سیم‌کش' 
  | 'وزن بدن' 
  | 'کش تمرینی';

export interface Exercise {
  id: string;
  nameFa: string;
  nameEn: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: EquipmentType;
  difficulty: ExerciseDifficulty;
  instructionsFa: string[];
  commonMistakesFa: string[];
  tipsFa: string;
  accentColor?: string;
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
  targetReps: number;
  targetWeightKg: number;
  restSeconds?: number;
}

export interface SessionExercise {
  exerciseId: string;
  exerciseNameFa: string;
  exerciseNameEn: string;
  muscleGroup: MuscleGroup;
  equipment: EquipmentType;
  sets: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  date: string; // YYYY-MM-DD
  nameFa: string;
  durationMinutes: number;
  exercises: SessionExercise[];
  completed: boolean;
  totalVolumeKg: number;
}

export interface WorkoutPlanTemplate {
  id: string;
  titleFa: string;
  splitType: string;
  descriptionFa: string;
  difficulty: ExerciseDifficulty;
  days: {
    dayNameFa: string;
    focusFa: string;
    exercises: {
      exerciseId: string;
      defaultSets: number;
      defaultReps: number;
      defaultWeightKg: number;
    }[];
  }[];
}

export interface MealEntry {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'supplement';
  mealTypeFa: string;
  nameFa: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  time: string;
}

export interface DailyNutrition {
  date: string;
  targetCalories: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  waterGlasses: number; // 250ml per glass
  targetWaterGlasses: number;
  meals: MealEntry[];
}

export interface BodyMeasurement {
  id: string;
  date: string;
  weightKg: number;
  bodyFatPct?: number;
  chestCm?: number;
  waistCm?: number;
  armsCm?: number;
  thighsCm?: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female';
  heightCm: number;
  currentWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  fitnessGoal: 'fat_loss' | 'muscle_gain' | 'recomposition' | 'strength';
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
}
