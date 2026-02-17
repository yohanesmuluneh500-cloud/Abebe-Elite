
import React from 'react';
import { WatchData } from '../types';

interface SettingsProps {
  userName: string;
  setUserName: (name: string) => void;
  watchData?: WatchData;
  onConnectWatch?: () => void;
  onDisconnectWatch?: () => void;
  onResetCalories?: () => void;
}

const Settings: React.FC<SettingsProps> = ({ userName, setUserName, watchData, onConnectWatch, onDisconnectWatch, onResetCalories }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-20">
      <div className="glass p-8 rounded-xl border border-zinc-800/50">
        <div className="flex items-center gap-3 mb-8">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h2 className="text-3xl font-oswald font-bold text-white uppercase tracking-tight">APP SETTINGS</h2>
        </div>

        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="text-zinc-500 font-bold text-xs tracking-[0.2em] uppercase border-b border-zinc-800 pb-2">Warrior Profile</h3>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 block uppercase tracking-widest">Display Name</label>
              <input 
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-orange-600 outline-none transition-all text-lg font-medium"
                placeholder="Enter your name..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-zinc-500 font-bold text-xs tracking-[0.2em] uppercase border-b border-zinc-800 pb-2">Wearable Integration</h3>
            <div className="p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${watchData?.isConnected ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-600'}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-tight">{watchData?.isConnected ? watchData.deviceName : 'No Watch Connected'}</h4>
                    <p className="text-zinc-500 text-xs">Sync biometrics for real-time intensity tracking.</p>
                  </div>
                </div>
                
                {watchData?.isConnected ? (
                  <button 
                    onClick={onDisconnectWatch}
                    className="w-full sm:w-auto px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all"
                  >
                    Disconnect
                  </button>
                ) : (
                  <button 
                    onClick={onConnectWatch}
                    className="w-full sm:w-auto px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20"
                  >
                    Connect Watch
                  </button>
                )}
              </div>
              
              {watchData?.isConnected && (
                <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
                  <div className="text-xs text-zinc-400">
                    <span className="font-bold text-white">{Math.floor(watchData.caloriesBurned)}</span> KCAL BURNED THIS SESSION
                  </div>
                  <button 
                    onClick={onResetCalories}
                    className="text-[10px] font-bold text-zinc-500 hover:text-orange-600 uppercase tracking-widest transition-colors"
                  >
                    Reset Session Burn
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
