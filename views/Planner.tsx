
import React, { useState } from 'react';
import { LessonPlan, ClassSchedule } from '../types';
import { generateLessonContent } from '../services/geminiService';

interface PlannerProps {
  onSave: (lesson: LessonPlan) => void;
  onCancel: () => void;
  initialData: LessonPlan | null;
}

const Planner: React.FC<PlannerProps> = ({ onSave, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<LessonPlan>>(
    initialData || {
      title: '',
      subject: '',
      gradeLevel: '',
      duration: '',
      objectives: '',
      standards: '',
      materials: [],
      classSchedules: [],
      procedure: {
        anticipatorySet: '',
        directInstruction: '',
        guidedPractice: '',
        independentPractice: '',
        closure: ''
      },
      assessment: '',
      differentiation: '',
      status: 'draft',
      createdAt: Date.now()
    }
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const [newMaterial, setNewMaterial] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof LessonPlan] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Class Schedule Table Handlers
  const addClassSchedule = () => {
    const newSchedule: ClassSchedule = {
      id: Math.random().toString(36).substr(2, 9),
      className: '',
      period: '',
      room: '',
      specificNotes: ''
    };
    setFormData(prev => ({
      ...prev,
      classSchedules: [...(prev.classSchedules || []), newSchedule]
    }));
  };

  const updateClassSchedule = (id: string, field: keyof ClassSchedule, value: string) => {
    setFormData(prev => ({
      ...prev,
      classSchedules: (prev.classSchedules || []).map(s => 
        s.id === id ? { ...s, [field]: value } : s
      )
    }));
  };

  const removeClassSchedule = (id: string) => {
    setFormData(prev => ({
      ...prev,
      classSchedules: (prev.classSchedules || []).filter(s => s.id !== id)
    }));
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      setFormData(prev => ({
        ...prev,
        materials: [...(prev.materials || []), newMaterial.trim()]
      }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (index: number) => {
    setFormData(prev => ({
      ...prev,
      materials: (prev.materials || []).filter((_, i) => i !== index)
    }));
  };

  const handleMagicGenerate = async () => {
    if (!formData.title || !formData.gradeLevel || !formData.subject) {
      alert("Please enter a title, subject, and grade level first!");
      return;
    }

    setIsGenerating(true);
    try {
      const generated = await generateLessonContent(formData.title, formData.gradeLevel, formData.subject);
      setFormData(prev => ({
        ...prev,
        ...generated,
        procedure: {
          ...prev.procedure,
          ...generated.procedure
        }
      }));
    } catch (error) {
      alert("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: formData.id || Math.random().toString(36).substr(2, 9),
      classSchedules: formData.classSchedules || [],
      createdAt: formData.createdAt || Date.now()
    } as LessonPlan);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <div className="flex justify-between items-center sticky top-0 bg-slate-50/80 backdrop-blur-md z-10 py-4 mb-4">
        <h2 className="text-2xl font-extrabold text-slate-800">
          {initialData ? 'Edit Lesson' : 'Create Lesson'}
        </h2>
        <div className="flex gap-3">
          <button type="button" onClick={onCancel} className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-lg transition">
            Cancel
          </button>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-indigo-700 transition">
            Save Plan
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Essential Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 mb-1">Lesson Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g., Introduction to Photosynthesis"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g., Biology"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Grade Level</label>
            <input
              type="text"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleChange}
              required
              className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="e.g., 7th Grade"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="button"
            onClick={handleMagicGenerate}
            disabled={isGenerating}
            className={`w-full py-3 border-2 border-indigo-200 rounded-xl text-indigo-600 font-bold flex items-center justify-center gap-2 transition hover:bg-indigo-50 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
            )}
            {isGenerating ? 'Generating Content...' : 'Magic Generate with Gemini AI'}
          </button>
        </div>
      </section>

      {/* Class-wise Schedule Table */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 00-2 2z" /></svg>
            Class-wise Delivery Schedule
          </h3>
          <button
            type="button"
            onClick={addClassSchedule}
            className="text-sm bg-slate-50 text-indigo-600 font-bold px-3 py-1.5 rounded-lg border border-indigo-100 hover:bg-indigo-50 transition flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
            Add Class Row
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-2">Class Name</th>
                <th className="py-3 px-2">Period/Time</th>
                <th className="py-3 px-2">Room</th>
                <th className="py-3 px-2">Specific Notes</th>
                <th className="py-3 px-2 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {formData.classSchedules?.map((schedule) => (
                <tr key={schedule.id} className="border-b border-slate-50 group">
                  <td className="py-2 px-1">
                    <input
                      type="text"
                      value={schedule.className}
                      onChange={(e) => updateClassSchedule(schedule.id, 'className', e.target.value)}
                      placeholder="e.g. 10-A"
                      className="w-full bg-transparent p-1.5 text-sm border-0 border-b border-transparent focus:border-indigo-400 focus:ring-0 outline-none"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="text"
                      value={schedule.period}
                      onChange={(e) => updateClassSchedule(schedule.id, 'period', e.target.value)}
                      placeholder="e.g. 1st Period"
                      className="w-full bg-transparent p-1.5 text-sm border-0 border-b border-transparent focus:border-indigo-400 focus:ring-0 outline-none"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="text"
                      value={schedule.room}
                      onChange={(e) => updateClassSchedule(schedule.id, 'room', e.target.value)}
                      placeholder="e.g. Lab 2"
                      className="w-full bg-transparent p-1.5 text-sm border-0 border-b border-transparent focus:border-indigo-400 focus:ring-0 outline-none"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <input
                      type="text"
                      value={schedule.specificNotes}
                      onChange={(e) => updateClassSchedule(schedule.id, 'specificNotes', e.target.value)}
                      placeholder="Add class notes..."
                      className="w-full bg-transparent p-1.5 text-sm border-0 border-b border-transparent focus:border-indigo-400 focus:ring-0 outline-none"
                    />
                  </td>
                  <td className="py-2 px-1">
                    <button
                      type="button"
                      onClick={() => removeClassSchedule(schedule.id)}
                      className="p-1.5 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
              {(!formData.classSchedules || formData.classSchedules.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm italic">
                    No classes scheduled for this lesson yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Objectives and Standards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-2">Learning Objectives (SWBAT...)</label>
          <textarea
            name="objectives"
            rows={4}
            value={formData.objectives}
            onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="What will students be able to do by the end of this lesson?"
          />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-2">Standards & Alignments</label>
          <textarea
            name="standards"
            rows={4}
            value={formData.standards}
            onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="e.g., CCSS.ELA-LITERACY.RI.7.1"
          />
        </div>
      </section>

      {/* Materials */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <label className="block text-sm font-bold text-slate-800 mb-3">Resources & Materials Needed</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.materials?.map((m, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-sm text-slate-700">
              {m}
              <button type="button" onClick={() => removeMaterial(i)} className="text-slate-400 hover:text-red-500 transition-colors">&times;</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMaterial}
            onChange={(e) => setNewMaterial(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
            className="flex-1 p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="Add material..."
          />
          <button type="button" onClick={addMaterial} className="bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900 transition">Add</button>
        </div>
      </section>

      {/* Procedure Steps */}
      <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
          Step-by-Step Procedure
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Anticipatory Set (Hook)</label>
          <textarea
            name="procedure.anticipatorySet"
            rows={3}
            value={formData.procedure?.anticipatorySet}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Direct Instruction (I Do)</label>
          <textarea
            name="procedure.directInstruction"
            rows={3}
            value={formData.procedure?.directInstruction}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Guided Practice (We Do)</label>
          <textarea
            name="procedure.guidedPractice"
            rows={3}
            value={formData.procedure?.guidedPractice}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Independent Practice (You Do)</label>
          <textarea
            name="procedure.independentPractice"
            rows={3}
            value={formData.procedure?.independentPractice}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Closure</label>
          <textarea
            name="procedure.closure"
            rows={2}
            value={formData.procedure?.closure}
            onChange={handleChange}
            className="w-full p-2 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </section>

      {/* Assessment and Differentiation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-2">Assessment & Evaluation</label>
          <textarea
            name="assessment"
            rows={4}
            value={formData.assessment}
            onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="How will you check for understanding?"
          />
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <label className="block text-sm font-bold text-slate-800 mb-2">Differentiation & Accommodations</label>
          <textarea
            name="differentiation"
            rows={4}
            value={formData.differentiation}
            onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-md outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            placeholder="Supports for EL, IEP, and gifted students..."
          />
        </div>
      </section>
    </form>
  );
};

export default Planner;
