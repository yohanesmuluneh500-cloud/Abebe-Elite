
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Goal } from '../types';

const Auth: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('180');
  const [weight, setWeight] = useState('80');

  // Shadow identity generator
  const getShadowEmail = (username: string) => {
    const cleanName = username.trim().toLowerCase().replace(/\s+/g, '.');
    return `${cleanName}@iron.academy`;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const shadowEmail = getShadowEmail(name);
    
    try {
      if (isSignUp) {
        // Create the Auth User with shadow email
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: shadowEmail,
          password: password,
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Immediately create the profile with metrics
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            name: name,
            weight: Number(weight),
            height: Number(height),
            age: Number(age),
            gender: 'male',
            goal: Goal.BULK,
            calories: 2500,
            protein: 180,
            carbs: 250,
            fats: 70,
            updated_at: new Date()
          });

          if (profileError) throw profileError;
          
          if (!authData.session) {
            setError("Warrior Registered. Sign in with your Name and Password to enter.");
            setIsSignUp(false);
          }
        }
      } else {
        // Sign In logic
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: shadowEmail,
          password: password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message.includes("Invalid login credentials") ? "Access Denied. Check your Name and Password." : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-zinc-800 shadow-2xl animate-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center font-oswald text-4xl font-bold italic mb-6 shadow-xl shadow-blue-900/40">A</div>
          <h2 className="text-3xl font-oswald font-bold text-white tracking-tighter uppercase mb-2">Iron Academy</h2>
          <p className="text-blue-300/40 text-[10px] tracking-[0.3em] uppercase font-bold">Forge Your Physique</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest">Warrior Name</label>
            <input 
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 text-white focus:border-blue-600 outline-none transition-all text-lg"
              placeholder="e.g. Abebe"
            />
          </div>

          {isSignUp && (
            <div className="grid grid-cols-3 gap-3 animate-in slide-in-from-top duration-300">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest">Age</label>
                <input 
                  required
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest">Height</label>
                <input 
                  required
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest">Weight</label>
                <input 
                  required
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-600 outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 block uppercase tracking-widest">Password</label>
            <input 
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3.5 text-white focus:border-blue-600 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && <div className="p-3 bg-red-900/10 border border-red-900/30 text-red-500 text-[10px] font-bold rounded-lg tracking-wider uppercase">{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all font-oswald tracking-widest uppercase shadow-lg shadow-blue-900/20"
          >
            {loading ? 'INITIALIZING...' : (isSignUp ? 'REGISTER & ENTER' : 'SECURE SIGN IN')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[9px] text-zinc-500 hover:text-blue-400 font-bold uppercase tracking-[0.2em] transition-colors"
          >
            {isSignUp ? 'ALREADY REGISTERED? LOG IN' : 'NEW WARRIOR? START REGISTRATION'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
