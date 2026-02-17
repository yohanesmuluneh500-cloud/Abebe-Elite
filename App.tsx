
import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import WorkoutDisplay from './components/WorkoutDisplay';
import Macros from './components/Macros';
import Chat from './components/Chat';
import Settings from './components/Settings';
import Progress from './components/Progress';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import { WorkoutPlan, Macros as MacroType, WatchData, UserMetrics, Goal } from './types';
import { bluetoothManager } from './services/bluetoothService';
import { supabase } from './services/supabase';

const BackgroundForge: React.FC = () => {
  const embers = Array.from({ length: 20 });
  return (
    <div className="bg-forge">
      <div className="glow-blob glow-1"></div>
      <div className="glow-blob glow-2"></div>
      <div className="glow-blob glow-3"></div>
      <div className="forge-grid"></div>
      {embers.map((_, i) => (
        <div 
          key={i} 
          className="ember" 
          style={{ 
            left: `${Math.random() * 100}%`, 
            animationDelay: `${Math.random() * 15}s`,
            animationDuration: `${12 + Math.random() * 10}s`
          }}
        ></div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('Warrior');
  const [workout, setWorkout] = useState<WorkoutPlan | null>(null);
  const [macros, setMacros] = useState<MacroType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [metrics, setMetrics] = useState<UserMetrics>({
    weight: 80, height: 180, age: 25, gender: 'male', activityLevel: 1.55, goal: Goal.BULK,
  });

  const [watchData, setWatchData] = useState<WatchData>({
    heartRate: null, caloriesBurned: 0, deviceName: null, isConnected: false
  });

  const lastUpdateRef = useRef<number>(Date.now());
  const isFetchingRef = useRef<boolean>(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.id);
      } else {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.id);
      } else {
        setLoading(false);
        setActiveTab('dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    try {
      const [profileRes, workoutRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).single(),
        supabase.from('workouts').select('plan_data').eq('user_id', userId).order('created_at', { ascending: false }).limit(1)
      ]);

      if (profileRes.data) {
        const p = profileRes.data;
        setUserName(p.name);
        setMetrics({ weight: p.weight, height: p.height, age: p.age, gender: p.gender, activityLevel: p.activityLevel, goal: p.goal as Goal });
        setMacros({ calories: p.calories, protein: p.protein, carbs: p.carbs, fats: p.fats });
      }

      if (workoutRes.data?.[0]) {
        setWorkout(workoutRes.data[0].plan_data);
      }
    } catch (err) {
      console.error('Data Sync Error:', err);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  };

  const handleStartApp = () => setShowLanding(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (showLanding) return <LandingPage onStart={handleStartApp} />;
  if (!user) return <Auth />;
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <BackgroundForge />
      <div className="w-16 h-16 bg-blue-600 rounded-2xl animate-pulse shadow-[0_0_50px_rgba(37,99,235,0.4)]"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-blue-50 flex flex-col selection:bg-blue-600 selection:text-white">
      <BackgroundForge />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 animate-in fade-in duration-300">
        {activeTab === 'dashboard' && <Dashboard workout={workout} macros={macros} userName={userName} watchData={watchData} />}
        {activeTab === 'workout' && <WorkoutDisplay workout={workout} setWorkout={setWorkout} />}
        {activeTab === 'nutrition' && <Macros macros={macros} setMacros={setMacros} metrics={metrics} setMetrics={setMetrics} />}
        {activeTab === 'progress' && <Progress />}
        {activeTab === 'chat' && <Chat />}
        {activeTab === 'settings' && (
          <Settings 
            userName={userName} 
            setUserName={setUserName} 
            watchData={watchData} 
            onConnectWatch={() => {}} 
            onDisconnectWatch={() => {}} 
            onResetCalories={() => {}} 
            onLogout={handleLogout} 
          />
        )}
      </main>
      <footer className="py-6 border-t border-zinc-900 text-center text-blue-900 text-[10px] font-bold tracking-widest uppercase">
        IRON MIND ACADEMY | FORGED BY YOHANES MULUNEH
      </footer>
    </div>
  );
};

export default App;
