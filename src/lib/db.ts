import { openDB, DBSchema, IDBPDatabase } from 'idb';

// Types
export interface RunPoint {
  lat: number;
  lng: number;
  t: number;
  accuracy: number;
}

export interface Run {
  id: string;
  startedAt: number;
  finishedAt: number;
  durationSec: number;
  distanceKm: number;
  avgPace: string;
  points: RunPoint[];
  notes?: string;
  type?: 'tempo' | 'trail' | 'easy' | 'interval';
  location?: string;
}

export interface ManualWorkout {
  id: string;
  date: number;
  type: 'run' | 'walk' | 'hike' | 'gym' | 'other';
  distanceKm?: number;
  durationMin: number;
  notes?: string;
}

export interface Goals {
  weeklyKmTarget: number;
  weeklyRunsTarget: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface CrisisSession {
  id: string;
  type: 'breathing_478' | 'box_breathing' | 'grounding';
  completedAt: number;
}

export interface UserProfile {
  name: string;
  avatar?: string;
}

interface StrideDB extends DBSchema {
  runs: {
    key: string;
    value: Run;
    indexes: { 'by-date': number };
  };
  workouts: {
    key: string;
    value: ManualWorkout;
    indexes: { 'by-date': number };
  };
  goals: {
    key: string;
    value: Goals;
  };
  achievements: {
    key: string;
    value: Achievement;
  };
  crisisSessions: {
    key: string;
    value: CrisisSession;
    indexes: { 'by-date': number };
  };
  profile: {
    key: string;
    value: UserProfile;
  };
}

let dbInstance: IDBPDatabase<StrideDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<StrideDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<StrideDB>('stride-db', 1, {
    upgrade(db) {
      // Runs store
      const runStore = db.createObjectStore('runs', { keyPath: 'id' });
      runStore.createIndex('by-date', 'startedAt');

      // Workouts store
      const workoutStore = db.createObjectStore('workouts', { keyPath: 'id' });
      workoutStore.createIndex('by-date', 'date');

      // Goals store
      db.createObjectStore('goals', { keyPath: 'id' });

      // Achievements store
      db.createObjectStore('achievements', { keyPath: 'id' });

      // Crisis sessions store
      const crisisStore = db.createObjectStore('crisisSessions', { keyPath: 'id' });
      crisisStore.createIndex('by-date', 'completedAt');

      // Profile store
      db.createObjectStore('profile', { keyPath: 'name' });
    },
  });

  return dbInstance;
}

// Run operations
export async function saveRun(run: Run): Promise<void> {
  const db = await getDB();
  await db.put('runs', run);
}

export async function getRuns(): Promise<Run[]> {
  const db = await getDB();
  return db.getAllFromIndex('runs', 'by-date');
}

export async function getRun(id: string): Promise<Run | undefined> {
  const db = await getDB();
  return db.get('runs', id);
}

export async function deleteRun(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('runs', id);
}

// Workout operations
export async function saveWorkout(workout: ManualWorkout): Promise<void> {
  const db = await getDB();
  await db.put('workouts', workout);
}

export async function getWorkouts(): Promise<ManualWorkout[]> {
  const db = await getDB();
  return db.getAllFromIndex('workouts', 'by-date');
}

export async function deleteWorkout(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('workouts', id);
}

// Goals operations
export async function saveGoals(goals: Goals): Promise<void> {
  const db = await getDB();
  await db.put('goals', { ...goals, id: 'user-goals' } as Goals & { id: string });
}

export async function getGoals(): Promise<Goals | undefined> {
  const db = await getDB();
  const result = await db.get('goals', 'user-goals');
  return result;
}

// Achievement operations
export async function saveAchievement(achievement: Achievement): Promise<void> {
  const db = await getDB();
  await db.put('achievements', achievement);
}

export async function getAchievements(): Promise<Achievement[]> {
  const db = await getDB();
  return db.getAll('achievements');
}

// Crisis session operations
export async function saveCrisisSession(session: CrisisSession): Promise<void> {
  const db = await getDB();
  await db.put('crisisSessions', session);
}

export async function getCrisisSessions(): Promise<CrisisSession[]> {
  const db = await getDB();
  return db.getAllFromIndex('crisisSessions', 'by-date');
}

// Profile operations
export async function saveProfile(profile: UserProfile): Promise<void> {
  const db = await getDB();
  await db.put('profile', profile);
}

export async function getProfile(): Promise<UserProfile | undefined> {
  const db = await getDB();
  const all = await db.getAll('profile');
  return all[0];
}

// Helper to generate unique IDs
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
