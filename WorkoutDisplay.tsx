
import React, { useState } from 'react';
import { generateWorkoutPlan } from '../services/geminiService';
import { Goal, WorkoutPlan } from '../types';

interface WorkoutDisplayProps {
  workout: WorkoutPlan | null;
  setWorkout: (plan: WorkoutPlan) => void;
}

const WorkoutDisplay: React.FC<WorkoutDisplayProps> = ({ workout, setWorkout }) => {
  const [loading, setLoading] = useState(false);
  const [freq, setFreq] = useState(4);
  const [goal, setGoal] = useState<Goal>(Goal.BULK);
  const [exp, setExp] = useState('Intermediate');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const plan = await generateWorkoutPlan(freq, goal, exp);
      setWorkout(plan);
    } catch (error) {
      console.error(error);
      alert('Failed to forge the iron. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
      <div className="glass p-6 rounded-xl">
        <h2 className="text-2xl font-oswald font-bold text-white mb-6">PROGRAM DESIGNER</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">FREQUENCY (DAYS/WEEK)</label>
            <select 
              value={freq} 
              onChange={(e) => setFreq(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none"
            >
              {[3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Days</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">PHASE</label>
            <select 
              value={goal} 
              onChange={(e) => setGoal(e.target.value as Goal)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none"
            >
              <option value={Goal.BULK}>Hypertrophy / Bulk</option>
              <option value={Goal.CUT}>Fat Loss / Cut</option>
              <option value={Goal.MAINTENANCE}>Maintenance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">EXPERIENCE</label>
            <select 
              value={exp} 
              onChange={(e) => setExp(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced / Competitive</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              FORGING YOUR PROGRAM...
            </>
          ) : 'GENERATE HYPERTROPHY PROTOCOL'}
        </button>
      </div>

      {workout && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-3xl font-oswald font-bold text-white uppercase tracking-tighter">{workout.title}</h3>
            <span className="text-blue-900 font-bold text-xs pb-1 uppercase tracking-widest">{workout.splitType}</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {workout.days.map((day, idx) => (
              <div key={idx} className="glass rounded-xl overflow-hidden border-t-2 border-blue-900">
                <div className="bg-blue-900/10 p-4 border-b border-zinc-800">
                  <h4 className="font-oswald font-bold text-xl text-blue-400">{day.dayName}</h4>
                </div>
                <div className="p-4 space-y-4">
                  {day.exercises.map((ex, eIdx) => (
                    <div key={eIdx} className="bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50 hover:border-blue-900 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-bold text-white text-lg">{ex.name}</h5>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-zinc-800 text-blue-400 text-[10px] rounded font-bold">RPE {ex.rpe}</span>
                          <span className="px-2 py-1 bg-zinc-800 text-zinc-400 text-[10px] rounded font-bold">{ex.tempo}</span>
                        </div>
                      </div>
                      <p className="text-sm text-zinc-400 font-medium mb-3">{ex.sets} SETS × {ex.reps} REPS</p>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">FORM CUES</p>
                        <ul className="text-xs text-blue-100/60 list-disc pl-4 space-y-1">
                          {ex.formCues.map((cue, cIdx) => <li key={cIdx}>{cue}</li>)}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutDisplay;
