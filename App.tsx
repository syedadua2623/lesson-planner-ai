
import React, { useState, useEffect } from 'react';
import { ViewState, User, LessonPlan } from './types';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import Planner from './views/Planner';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] = useState<LessonPlan[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LessonPlan | null>(null);

  useEffect(() => {
    // Simulated auth check
    const savedUser = localStorage.getItem('eduplan_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('dashboard');
    }
    
    const savedLessons = localStorage.getItem('eduplan_lessons');
    if (savedLessons) {
      setLessons(JSON.parse(savedLessons));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('eduplan_user', JSON.stringify(userData));
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('eduplan_user');
    setView('login');
  };

  const saveLesson = (lesson: LessonPlan) => {
    const updated = lessons.filter(l => l.id !== lesson.id);
    const newList = [lesson, ...updated];
    setLessons(newList);
    localStorage.setItem('eduplan_lessons', JSON.stringify(newList));
    setView('dashboard');
  };

  const deleteLesson = (id: string) => {
    const newList = lessons.filter(l => l.id !== id);
    setLessons(newList);
    localStorage.setItem('eduplan_lessons', JSON.stringify(newList));
  };

  const createNew = () => {
    setCurrentLesson(null);
    setView('planner');
  };

  const editLesson = (lesson: LessonPlan) => {
    setCurrentLesson(lesson);
    setView('planner');
  };

  if (view === 'login') {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        user={user} 
      />
      
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {view === 'dashboard' && (
            <Dashboard 
              lessons={lessons} 
              onEdit={editLesson} 
              onDelete={deleteLesson} 
              onCreateNew={createNew} 
            />
          )}
          {view === 'planner' && (
            <Planner 
              onSave={saveLesson} 
              initialData={currentLesson} 
              onCancel={() => setView('dashboard')} 
            />
          )}
          {view === 'settings' && (
            <div className="p-8 bg-white rounded-xl shadow-sm border border-slate-200">
              <h2 className="text-2xl font-bold mb-6 text-slate-800">Profile Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                  <input type="text" readOnly value={user?.name} className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">Email Address</label>
                  <input type="email" readOnly value={user?.email} className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">School Affiliation</label>
                  <input type="text" value={user?.school || 'Not set'} readOnly className="w-full p-2 bg-slate-100 border border-slate-200 rounded-md outline-none" />
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Update Profile</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
