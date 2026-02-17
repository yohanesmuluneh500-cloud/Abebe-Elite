
export enum Goal {
  BULK = 'BULK',
  CUT = 'CUT',
  MAINTENANCE = 'MAINTENANCE'
}

export interface UserMetrics {
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female';
  activityLevel: number;
  goal: Goal;
}

export interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  tempo: string;
  rpe: number;
  formCues: string[];
}

export interface WorkoutDay {
  dayName: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  title: string;
  splitType: string;
  days: WorkoutDay[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ProgressMedia {
  id: string;
  date: string;
  dataUrl: string;
  type: 'image' | 'video';
}

export interface WatchData {
  heartRate: number | null;
  caloriesBurned: number;
  deviceName: string | null;
  isConnected: boolean;
}
