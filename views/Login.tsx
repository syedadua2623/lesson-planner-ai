
import React, { useState } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    onLogin({
      id: Math.random().toString(36).substr(2, 9),
      email: email || 'teacher@school.edu',
      name: name || 'Demo Teacher',
      school: 'Global Academic Heights'
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold">EduPlan Pro</h2>
          <p className="mt-2 text-indigo-100">Intelligent Planning for Modern Educators</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {isRegistering && (
            <div>
              <label className="block text-sm font-medium text-slate-700">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Jane Doe"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="teacher@school.edu"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center text-sm text-slate-600">
            {isRegistering ? (
              <p>Already have an account? <button type="button" onClick={() => setIsRegistering(false)} className="text-indigo-600 font-medium hover:underline">Log in</button></p>
            ) : (
              <p>New to EduPlan? <button type="button" onClick={() => setIsRegistering(true)} className="text-indigo-600 font-medium hover:underline">Sign up for free</button></p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
