
export interface ClassSchedule {
  id: string;
  className: string;
  period: string;
  room: string;
  specificNotes: string;
}

export interface LessonPlan {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  duration: string;
  date: string;
  objectives: string;
  standards: string;
  materials: string[];
  classSchedules: ClassSchedule[];
  procedure: {
    anticipatorySet: string;
    directInstruction: string;
    guidedPractice: string;
    independentPractice: string;
    closure: string;
  };
  assessment: string;
  differentiation: string;
  status: 'draft' | 'published';
  createdAt: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  school?: string;
}

export type ViewState = 'login' | 'dashboard' | 'planner' | 'settings';
