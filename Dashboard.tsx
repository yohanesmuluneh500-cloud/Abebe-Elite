
import React from 'react';
import { Goal, Macros, WorkoutPlan, WatchData } from '../types';

interface DashboardProps {
  workout: WorkoutPlan | null;
  macros: Macros | null;
  userName: string;
  watchData?: WatchData;
}

const Dashboard: React.FC<DashboardProps> = ({ workout, macros, userName, watchData }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-oswald font-bold text-white mb-2 uppercase tracking-tight">WELCOME BACK, {userName.toUpperCase()}</h2>
          <p className="text-blue-200/60">Coach Abebe is ready to push your limits. Consistency is the only path.</p>
        </div>
        
        {/* Watch Connectivity Status Indicator */}
        {watchData?.isConnected && (
          <div className="flex items-center gap-3 px-4 py-2 bg-blue-600/10 border border-blue-600/30 rounded-full">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
            <span className="text-[10px] font-bold text-white tracking-widest uppercase">{watchData.deviceName} CONNECTED</span>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* TRAINING TELEMETRY CENTER (Bluetooth Data) */}
        <div className={`glass p-6 rounded-xl relative overflow-hidden group transition-all duration-500 border border-zinc-800/50 ${watchData?.isConnected ? 'border-blue-600/40 bg-blue-600/[0.03]' : ''}`}>
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-blue-400/50 font-bold text-xs tracking-widest uppercase">TRAINING TELEMETRY</h3>
            {watchData?.isConnected && <div className="text-[10px] font-bold text-blue-400 animate-pulse tracking-widest uppercase">LIVE SYNCING</div>}
          </div>

          <div className="space-y-6">
            {/* Heart Rate Section */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${watchData?.isConnected ? 'bg-blue-600/20 text-blue-400' : 'bg-zinc-800 text-zinc-600'}`}>
                <svg className={`w-6 h-6 ${watchData?.isConnected && watchData.heartRate ? 'animate-[pulse_1s_infinite]' : ''}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                </svg>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">HEART RATE</span>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-oswald font-bold text-white leading-none">
                    {watchData?.isConnected ? (watchData.heartRate || '--') : '00'}
                  </p>
                  <span className="text-zinc-600 text-[10px] font-bold">BPM</span>
                </div>
              </div>
            </div>

            {/* Active Calories Section */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${watchData?.isConnected ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'bg-zinc-800 text-zinc-600'}`}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.66 11.2C17.43 10.9 17.15 10.64 16.89 10.38C16.22 9.7 15.46 9.03 14.83 8.24C13.56 6.64 13 4.72 13.56 2.72C13.59 2.58 13.53 2.44 13.4 2.37C13.28 2.3 13.12 2.3 13.03 2.4C10.15 5.17 9.87 9.17 11.19 12.38C11.23 12.48 11.23 12.6 11.16 12.68C11.1 12.76 11 12.8 10.9 12.8C10.74 12.8 10.58 12.78 10.43 12.75C9.4 12.56 8.5 12 7.8 11.19C7.71 11.08 7.56 11.05 7.45 11.11C7.33 11.17 7.27 11.31 7.28 11.44C7.5 13.9 8.71 16.2 10.74 17.75C11.08 18.03 11.44 18.27 11.83 18.47C11.66 18.7 11.51 18.95 11.39 19.22C10.34 21.6 11.53 24.36 14.07 25.43C16.6 26.5 19.64 25.32 20.7 22.78C21.75 20.24 20.57 17.48 18.03 16.41C17.91 16.36 17.76 16.36 17.65 16.43C17.54 16.5 17.47 16.61 17.48 16.74C17.6 18.25 16.92 19.74 15.65 20.6C14.39 21.46 12.76 21.55 11.4 20.85C13.3 19.66 14.28 17.41 13.88 15.15C13.84 14.88 14.03 14.63 14.3 14.59C14.38 14.58 14.47 14.58 14.55 14.61C16.3 15.31 17.74 16.59 18.66 18.26C18.72 18.37 18.84 18.43 18.96 18.42C19.08 18.41 19.19 18.33 19.23 18.22C20.3 15.7 19.75 12.8 17.66 11.2Z" />
                </svg>
              </div>
              <div>
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] block mb-1">ACTIVE BURN</span>
                <div className="flex items-baseline gap-1">
                  <p className="text-3xl font-oswald font-bold text-white leading-none">
                    {watchData?.isConnected ? Math.floor(watchData.caloriesBurned) : '00'}
                  </p>
                  <span className="text-zinc-600 text-[10px] font-bold">KCAL</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-1">
             <div className={`h-1 flex-1 rounded-full ${watchData?.isConnected ? 'bg-blue-600 animate-pulse' : 'bg-zinc-800'}`}></div>
             <div className={`h-1 flex-1 rounded-full ${watchData?.isConnected ? 'bg-blue-600/60 animate-pulse [animation-delay:0.2s]' : 'bg-zinc-800'}`}></div>
             <div className={`h-1 flex-1 rounded-full ${watchData?.isConnected ? 'bg-blue-600/30 animate-pulse [animation-delay:0.4s]' : 'bg-zinc-800'}`}></div>
          </div>
        </div>

        <div className="glass p-6 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-20 h-20 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L6.28 3.43L4.86 2L3.43 3.43L2 2L2 3.43L3.43 4.86L2 6.28L3.43 7.71L2 9.14L3.43 10.57L2 12L3.43 13.43L2 14.86L3.43 16.28L2 17.71L3.43 19.14L2 20.57L2 22L3.43 22L4.86 20.57L6.28 22L7.71 20.57L9.14 22L10.57 20.57L12 22L12 20.57L15.57 17L20.57 14.86Z" /></svg>
          </div>
          <h3 className="text-zinc-500 font-bold text-xs tracking-widest mb-1 uppercase">CURRENT SPLIT</h3>
          <p className="text-2xl font-oswald font-bold text-white uppercase">{workout?.title || 'No Active Plan'}</p>
          <p className="text-zinc-400 text-sm mt-2">{workout?.splitType || 'Setup your training frequency in Workouts.'}</p>
        </div>

        <div className="glass p-6 rounded-xl">
          <h3 className="text-zinc-500 font-bold text-xs tracking-widest mb-4 uppercase">DAILY MACRO TARGETS</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <span className="text-zinc-500 text-[10px] font-bold block mb-1">CALORIES</span>
              <span className="text-xl font-oswald font-bold text-white">{macros?.calories || '—'}</span>
            </div>
            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-800">
              <span className="text-blue-400 text-[10px] font-bold block mb-1 uppercase">PROTEIN</span>
              <span className="text-xl font-oswald font-bold text-white">{macros?.protein || '—'}g</span>
            </div>
          </div>
        </div>
      </div>

      <section className="glass p-6 rounded-xl border-l-4 border-blue-600 bg-blue-600/5">
        <h3 className="text-xl font-oswald font-bold text-white mb-2 italic">ABEBE'S DAILY MANTRA</h3>
        <p className="text-blue-100/70 italic leading-relaxed">"The pain of discipline is far less than the pain of regret. Leave your ego at the door, but bring your intensity. Every rep is a transaction with the future version of yourself."</p>
      </section>
    </div>
  );
};

export default Dashboard;
