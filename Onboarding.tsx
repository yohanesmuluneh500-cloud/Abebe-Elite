
import React, { useState } from 'react';
import { Goal, UserMetrics, Macros } from '../types';
import { calculateMacros } from '../services/geminiService';

interface OnboardingProps {
  onComplete: (name: string, metrics: UserMetrics, macros: Macros) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [metrics, setMetrics] = useState<UserMetrics>({
    weight: 80,
    height: 180,
    age: 25,
    gender: 'male',
    activityLevel: 1.55,
    goal: Goal.BULK,
  });

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await calculateMacros(metrics);
      onComplete(name, metrics, {
        calories: results.calories,
        protein: results.protein,
        carbs: results.carbs,
        fats: results.fats
      });
    } catch (err) {
      alert("Failed to sync with Abebe's servers. Check connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#0a0a0a] flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-xl w-full glass p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center font-oswald text-4xl font-bold italic mb-6 shadow-xl shadow-orange-900/40">A</div>
          <h2 className="text-4xl font-oswald font-bold text-white tracking-tighter uppercase mb-2">Warrior Onboarding</h2>
          <p className="text-zinc-500 text-sm tracking-widest uppercase font-bold">Initialize your hypertrophy profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Identify Yourself (Name)</label>
                <input 
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none transition-all text-xl"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Age</label>
                  <input 
                    type="number"
                    value={metrics.age}
                    onChange={(e) => setMetrics({...metrics, age: Number(e.target.value)})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Gender</label>
                  <select 
                    value={metrics.gender}
                    onChange={(e) => setMetrics({...metrics, gender: e.target.value as 'male' | 'female'})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <button 
                type="button" 
                onClick={handleNext} 
                disabled={!name}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all font-oswald tracking-widest uppercase"
              >
                Continue to Biometrics
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Weight (KG)</label>
                  <input 
                    type="number"
                    value={metrics.weight}
                    onChange={(e) => setMetrics({...metrics, weight: Number(e.target.value)})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Height (CM)</label>
                  <input 
                    type="number"
                    value={metrics.height}
                    onChange={(e) => setMetrics({...metrics, height: Number(e.target.value)})}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Activity Intensity</label>
                <select 
                  value={metrics.activityLevel}
                  onChange={(e) => setMetrics({...metrics, activityLevel: Number(e.target.value)})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                >
                  <option value={1.2}>Sedentary (No Exercise)</option>
                  <option value={1.375}>Lightly Active (1-3 days)</option>
                  <option value={1.55}>Moderately Active (3-5 days)</option>
                  <option value={1.725}>Very Active (6-7 days)</option>
                  <option value={1.9}>Elite/Manual Labor</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 block uppercase tracking-widest">Primary Objective</label>
                <select 
                  value={metrics.goal}
                  onChange={(e) => setMetrics({...metrics, goal: e.target.value as Goal})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none"
                >
                  <option value={Goal.BULK}>Mass Gain / Bulk</option>
                  <option value={Goal.CUT}>Fat Loss / Cut</option>
                  <option value={Goal.MAINTENANCE}>Recomp / Maintain</option>
                </select>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  onClick={handleBack} 
                  className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-lg transition-all font-oswald tracking-widest uppercase"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all font-oswald tracking-widest uppercase flex items-center justify-center gap-2"
                >
                  {loading ? 'CALCULATING PROTOCOL...' : 'FINALIZE PROFILE'}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-8 flex justify-center gap-2">
          <div className={`h-1 w-8 rounded-full transition-colors ${step === 1 ? 'bg-orange-600' : 'bg-zinc-800'}`}></div>
          <div className={`h-1 w-8 rounded-full transition-colors ${step === 2 ? 'bg-orange-600' : 'bg-zinc-800'}`}></div>
        </div>
        
        <p className="mt-8 text-[10px] text-zinc-600 text-center uppercase tracking-[0.2em] font-bold italic">
          Coach Abebe is processing your biometrics...
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
