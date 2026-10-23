import React, { useState, useEffect } from 'react';
import { Header, ActiveTab } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { WorkoutTracker } from './components/WorkoutTracker';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { NutritionTracker } from './components/NutritionTracker';
import { ProgressTracker } from './components/ProgressTracker';
import { RestTimerModal } from './components/RestTimerModal';
import { OnboardingModal } from './components/OnboardingModal';
import { ProfileModal } from './components/ProfileModal';
import { 
  loadActiveWorkoutSession, 
  loadDailyNutrition, 
  loadBodyMeasurements, 
  loadUserProfile, 
  hasSeenOnboarding, 
  markOnboardingSeen,
  saveDailyNutrition
} from './utils/storage';
import { soundManager } from './utils/audio';
import { Exercise, WorkoutSession } from './types/fitness';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('workout');
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [dailyNutrition, setDailyNutrition] = useState(loadDailyNutrition());
  const [measurements, setMeasurements] = useState(loadBodyMeasurements());
  const [userProfile, setUserProfile] = useState(loadUserProfile());
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());

  // Rest Timer State
  const [timerState, setTimerState] = useState<{
    isOpen: boolean;
    exerciseName?: string;
    setNumber?: number;
    durationSeconds?: number;
  }>({
    isOpen: false,
    durationSeconds: 90,
  });

  // Guide and Profile modals
  const [showGuide, setShowGuide] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const savedSession = loadActiveWorkoutSession();
    if (savedSession) {
      setActiveSession(savedSession);
    }

    // If user has never seen onboarding, automatically display the guide
    if (!hasSeenOnboarding()) {
      setShowGuide(true);
      markOnboardingSeen();
    }
  }, []);

  const handleToggleMute = () => {
    const next = soundManager.toggleMute();
    setIsMuted(next);
  };

  const handleStartRestTimer = (exerciseName: string, setNumber: number, durationSeconds: number = 90) => {
    setTimerState({
      isOpen: true,
      exerciseName,
      setNumber,
      durationSeconds,
    });
  };

  const handleCloseRestTimer = () => {
    setTimerState(prev => ({ ...prev, isOpen: false }));
  };

  const handleViewExerciseGuide = (exerciseId: string) => {
    setActiveTab('exercises');
  };

  const handleAddExerciseFromLibrary = (exercise: Exercise) => {
    if (!activeSession) return;
    const updated: WorkoutSession = {
      ...activeSession,
      exercises: [
        ...activeSession.exercises,
        {
          exerciseId: exercise.id,
          exerciseNameFa: exercise.nameFa,
          exerciseNameEn: exercise.nameEn,
          muscleGroup: exercise.muscleGroup,
          equipment: exercise.equipment,
          sets: [
            { id: `s-${Date.now()}-1`, setNumber: 1, weightKg: 20, reps: 10, targetReps: 10, targetWeightKg: 20, completed: false, restSeconds: 90 },
            { id: `s-${Date.now()}-2`, setNumber: 2, weightKg: 20, reps: 10, targetReps: 10, targetWeightKg: 20, completed: false, restSeconds: 90 },
            { id: `s-${Date.now()}-3`, setNumber: 3, weightKg: 20, reps: 10, targetReps: 10, targetWeightKg: 20, completed: false, restSeconds: 90 },
          ]
        }
      ]
    };
    setActiveSession(updated);
    setActiveTab('workout');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950 font-['Vazirmatn',sans-serif]">
      
      {/* Top Bar (3-zone contract) */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenGuide={() => setShowGuide(true)}
        onOpenProfile={() => setShowProfile(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isWorkoutActive={!!activeSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {activeTab === 'workout' && (
          <WorkoutTracker
            session={activeSession}
            onUpdateSession={setActiveSession}
            onStartRestTimer={handleStartRestTimer}
            onViewExerciseGuide={handleViewExerciseGuide}
            onOpenGuide={() => setShowGuide(true)}
          />
        )}

        {activeTab === 'exercises' && (
          <ExerciseLibrary
            onAddExerciseToActiveSession={handleAddExerciseFromLibrary}
            isWorkoutActive={!!activeSession}
          />
        )}

        {activeTab === 'nutrition' && (
          <NutritionTracker
            nutrition={dailyNutrition}
            onUpdateNutrition={setDailyNutrition}
            userProfile={userProfile}
          />
        )}

        {activeTab === 'progress' && (
          <ProgressTracker
            measurements={measurements}
            onUpdateMeasurements={setMeasurements}
            userProfile={userProfile}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isWorkoutActive={!!activeSession}
      />

      {/* Rest Timer Modal / Floating Widget */}
      <RestTimerModal
        isOpen={timerState.isOpen}
        onClose={handleCloseRestTimer}
        initialSeconds={timerState.durationSeconds}
        exerciseName={timerState.exerciseName}
        setNumber={timerState.setNumber}
      />

      {/* Interactive Onboarding / User Guide */}
      <OnboardingModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        onStartWorkoutNow={() => {
          setActiveTab('workout');
          setShowGuide(false);
        }}
      />

      {/* User Profile and Preferences Modal */}
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        profile={userProfile}
        onUpdateProfile={setUserProfile}
      />

    </div>
  );
}
