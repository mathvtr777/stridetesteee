import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Run, ManualWorkout, Goals, Achievement, CrisisSession, UserProfile } from '@/lib/db';

interface AppState {
  // User
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;

  // Runs
  runs: Run[];
  setRuns: (runs: Run[]) => void;
  addRun: (run: Run) => void;
  updateRun: (id: string, run: Partial<Run>) => void;
  removeRun: (id: string) => void;

  // Workouts
  workouts: ManualWorkout[];
  setWorkouts: (workouts: ManualWorkout[]) => void;
  addWorkout: (workout: ManualWorkout) => void;
  updateWorkout: (id: string, workout: Partial<ManualWorkout>) => void;
  removeWorkout: (id: string) => void;

  // Goals
  goals: Goals;
  setGoals: (goals: Goals) => void;

  // Achievements
  achievements: Achievement[];
  setAchievements: (achievements: Achievement[]) => void;
  unlockAchievement: (id: string) => void;

  // Crisis sessions
  crisisSessions: CrisisSession[];
  addCrisisSession: (session: CrisisSession) => void;

  // Active run state
  isRunning: boolean;
  isPaused: boolean;
  currentRunStartTime: number | null;
  currentRunPoints: { lat: number; lng: number; t: number; accuracy: number }[];
  currentDistance: number;
  currentDuration: number;
  startRun: () => void;
  pauseRun: () => void;
  resumeRun: () => void;
  stopRun: () => void;
  addRunPoint: (point: { lat: number; lng: number; t: number; accuracy: number }) => void;
  updateCurrentMetrics: (distance: number, duration: number) => void;
  resetCurrentRun: () => void;
}

const defaultAchievements: Achievement[] = [
  { id: 'first-run', name: 'First Steps', description: 'Complete your first run', icon: 'directions_run' },
  { id: 'five-workouts', name: 'Getting Started', description: 'Complete 5 workouts', icon: 'fitness_center' },
  { id: 'ten-km', name: '10K Club', description: 'Run 10km total', icon: 'emoji_events' },
  { id: 'streak-3', name: 'On Fire', description: 'Work out 3 days in a row', icon: 'local_fire_department' },
  { id: 'early-bird', name: 'Early Bird', description: 'Complete a run before 7am', icon: 'wb_sunny' },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete a run after 9pm', icon: 'nights_stay' },
];

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // User
      profile: { name: 'Alex Rivera' },
      setProfile: (profile) => set({ profile }),

      // Runs
      runs: [],
      setRuns: (runs) => set({ runs }),
      addRun: (run) => set((state) => ({ runs: [...state.runs, run] })),
      updateRun: (id, updates) =>
        set((state) => ({
          runs: state.runs.map((r) => (r.id === id ? { ...r, ...updates } : r)),
        })),
      removeRun: (id) => set((state) => ({ runs: state.runs.filter((r) => r.id !== id) })),

      // Workouts
      workouts: [],
      setWorkouts: (workouts) => set({ workouts }),
      addWorkout: (workout) => set((state) => ({ workouts: [...state.workouts, workout] })),
      updateWorkout: (id, updates) =>
        set((state) => ({
          workouts: state.workouts.map((w) => (w.id === id ? { ...w, ...updates } : w)),
        })),
      removeWorkout: (id) => set((state) => ({ workouts: state.workouts.filter((w) => w.id !== id) })),

      // Goals
      goals: { weeklyKmTarget: 40, weeklyRunsTarget: 4 },
      setGoals: (goals) => set({ goals }),

      // Achievements
      achievements: defaultAchievements,
      setAchievements: (achievements) => set({ achievements }),
      unlockAchievement: (id) =>
        set((state) => ({
          achievements: state.achievements.map((a) =>
            a.id === id ? { ...a, unlockedAt: Date.now() } : a
          ),
        })),

      // Crisis sessions
      crisisSessions: [],
      addCrisisSession: (session) =>
        set((state) => ({ crisisSessions: [...state.crisisSessions, session] })),

      // Active run
      isRunning: false,
      isPaused: false,
      currentRunStartTime: null,
      currentRunPoints: [],
      currentDistance: 0,
      currentDuration: 0,
      startRun: () =>
        set({
          isRunning: true,
          isPaused: false,
          currentRunStartTime: Date.now(),
          currentRunPoints: [],
          currentDistance: 0,
          currentDuration: 0,
        }),
      pauseRun: () => set({ isPaused: true }),
      resumeRun: () => set({ isPaused: false }),
      stopRun: () => set({ isRunning: false, isPaused: false }),
      addRunPoint: (point) =>
        set((state) => ({ currentRunPoints: [...state.currentRunPoints, point] })),
      updateCurrentMetrics: (distance, duration) =>
        set({ currentDistance: distance, currentDuration: duration }),
      resetCurrentRun: () =>
        set({
          isRunning: false,
          isPaused: false,
          currentRunStartTime: null,
          currentRunPoints: [],
          currentDistance: 0,
          currentDuration: 0,
        }),
    }),
    {
      name: 'stride-storage',
      partialize: (state) => ({
        profile: state.profile,
        runs: state.runs,
        workouts: state.workouts,
        goals: state.goals,
        achievements: state.achievements,
        crisisSessions: state.crisisSessions,
      }),
    }
  )
);
