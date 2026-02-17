
import React, { useState } from 'react';
import { calculateMacros, getFoodNutrition } from '../services/geminiService';
import { Goal, Macros as MacroType, UserMetrics } from '../types';

interface NutritionProps {
  macros: MacroType | null;
  setMacros: (m: MacroType) => void;
  metrics: UserMetrics;
  setMetrics: (m: UserMetrics) => void;
}

interface FoodResult {
  foodName: string;
  servingSize: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  grade: string;
  coachTip: string;
}

const NUTRITION_STAPLES = [
  {
    category: "PRIME PROTEINS",
    color: "text-orange-500",
    foods: [
      { name: "Chicken Breast", size: "100g (Cooked)", cal: 165, p: 31, c: 0, f: 3.6 },
      { name: "Egg Whites", size: "100g", cal: 52, p: 11, c: 0.7, f: 0.2 },
      { name: "Whey Isolate", size: "1 Scoop (30g)", cal: 110, p: 25, c: 2, f: 0.5 },
      { name: "Lean Ground Beef (93/7)", size: "100g", cal: 210, p: 26, c: 0, f: 11 },
      { name: "Tilapia / White Fish", size: "100g", cal: 128, p: 26, c: 0, f: 2.7 },
    ]
  },
  {
    category: "COMPLEX CARBS",
    color: "text-blue-500",
    foods: [
      { name: "White Rice", size: "100g (Cooked)", cal: 130, p: 2.7, c: 28, f: 0.3 },
      { name: "Sweet Potato", size: "100g (Baked)", cal: 90, p: 2, c: 21, f: 0.2 },
      { name: "Oats / Oatmeal", size: "50g (Dry)", cal: 190, p: 7, c: 32, f: 3.5 },
      { name: "Cream of Rice", size: "45g (Dry)", cal: 160, p: 3, c: 36, f: 0 },
      { name: "Quinoa", size: "100g (Cooked)", cal: 120, p: 4.4, c: 21, f: 1.9 },
    ]
  },
  {
    category: "ESSENTIAL FATS",
    color: "text-yellow-500",
    foods: [
      { name: "Avocado", size: "100g", cal: 160, p: 2, c: 8.5, f: 15 },
      { name: "Almonds", size: "28g (1 oz)", cal: 164, p: 6, c: 6, f: 14 },
      { name: "Whole Egg", size: "1 Large", cal: 72, p: 6.3, c: 0.4, f: 4.8 },
      { name: "Peanut Butter", size: "32g (2 tbsp)", cal: 188, p: 8, c: 6, f: 16 },
      { name: "Olive Oil", size: "1 tbsp (14g)", cal: 119, p: 0, c: 0, f: 14 },
    ]
  }
];

const Macros: React.FC<NutritionProps> = ({ macros, setMacros, metrics, setMetrics }) => {
  const [loading, setLoading] = useState(false);
  const [foodLoading, setFoodLoading] = useState(false);
  const [foodQuery, setFoodQuery] = useState('');
  const [foodResult, setFoodResult] = useState<FoodResult | null>(null);
  const [resultText, setResultText] = useState('');

  const handleCalc = async () => {
    setLoading(true);
    try {
      const result = await calculateMacros(metrics);
      setMacros({
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fats: result.fats,
      });
      setResultText(result.explanation || '');
    } catch (error) {
      console.error(error);
      alert('Failed to calculate. Ensure API access.');
    } finally {
      setLoading(false);
    }
  };

  const handleFoodSearch = async () => {
    if (!foodQuery.trim()) return;
    setFoodLoading(true);
    try {
      const result = await getFoodNutrition(foodQuery);
      setFoodResult(result);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze food.');
    } finally {
      setFoodLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-in slide-in-from-right duration-500 pb-20">
      {/* 1. Macro Calculator */}
      <div className="glass p-6 rounded-xl border border-zinc-800/50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-orange-600 rounded-full"></div>
          <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight">MACRO TARGET PROTOCOL</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">WEIGHT (KG)</label>
            <input 
              type="number"
              value={metrics.weight}
              onChange={(e) => setMetrics({ ...metrics, weight: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">HEIGHT (CM)</label>
            <input 
              type="number"
              value={metrics.height}
              onChange={(e) => setMetrics({ ...metrics, height: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">AGE</label>
            <input 
              type="number"
              value={metrics.age}
              onChange={(e) => setMetrics({ ...metrics, age: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">GENDER</label>
            <select 
              value={metrics.gender}
              onChange={(e) => setMetrics({ ...metrics, gender: e.target.value as 'male' | 'female' })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">GOAL</label>
            <select 
              value={metrics.goal}
              onChange={(e) => setMetrics({ ...metrics, goal: e.target.value as Goal })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none"
            >
              <option value={Goal.BULK}>Lean Bulk / Mass</option>
              <option value={Goal.CUT}>Cutting / Shredding</option>
              <option value={Goal.MAINTENANCE}>Recomp / Maintenance</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-500 block">ACTIVITY LEVEL</label>
            <select 
              value={metrics.activityLevel}
              onChange={(e) => setMetrics({ ...metrics, activityLevel: Number(e.target.value) })}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-orange-600 outline-none"
            >
              <option value={1.2}>Sedentary (Office job, no exercise)</option>
              <option value={1.375}>Light Active (1-3 days weightlifting)</option>
              <option value={1.55}>Mod. Active (3-5 days intense training)</option>
              <option value={1.725}>Very Active (6-7 days intense training)</option>
              <option value={1.9}>Elite Athlete / Heavy Manual Labor</option>
            </select>
          </div>
        </div>
        <button
          onClick={handleCalc}
          disabled={loading}
          className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all shadow-lg flex items-center justify-center gap-2 uppercase font-oswald tracking-widest"
        >
          {loading ? 'ANALYZING METRICS...' : 'CALCULATE TARGETS'}
        </button>
      </div>

      {/* 2. Target Display */}
      {macros && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in zoom-in-95 duration-300">
          <div className="lg:col-span-1 glass p-8 rounded-xl flex flex-col items-center justify-center text-center bg-orange-600/5">
            <h3 className="text-orange-500 text-sm font-bold tracking-widest mb-4">DAILY ENERGY BUDGET</h3>
            <div className="text-7xl font-oswald font-bold text-white mb-2">{macros.calories}</div>
            <p className="text-zinc-500 text-xs font-bold tracking-widest uppercase">KCAL / DAY</p>
          </div>
          
          <div className="lg:col-span-2 glass p-8 rounded-xl border border-zinc-800/50">
             <h3 className="text-zinc-500 text-sm font-bold tracking-widest mb-8 uppercase">ANABOLIC MACRO SPLIT</h3>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
               <div className="text-center group">
                 <div className="w-full bg-zinc-900 h-2 rounded-full mb-3 overflow-hidden">
                   <div className="bg-orange-600 h-full w-[100%] group-hover:bg-orange-400 transition-colors"></div>
                 </div>
                 <span className="block text-4xl font-oswald font-bold text-white group-hover:text-orange-500 transition-colors">{macros.protein}G</span>
                 <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">PROTEIN</span>
               </div>
               <div className="text-center group">
                 <div className="w-full bg-zinc-900 h-2 rounded-full mb-3 overflow-hidden">
                   <div className="bg-blue-600 h-full w-[100%] group-hover:bg-blue-400 transition-colors"></div>
                 </div>
                 <span className="block text-4xl font-oswald font-bold text-white group-hover:text-blue-500 transition-colors">{macros.carbs}G</span>
                 <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">CARBS</span>
               </div>
               <div className="text-center group">
                 <div className="w-full bg-zinc-900 h-2 rounded-full mb-3 overflow-hidden">
                   <div className="bg-yellow-600 h-full w-[100%] group-hover:bg-yellow-400 transition-colors"></div>
                 </div>
                 <span className="block text-4xl font-oswald font-bold text-white group-hover:text-yellow-500 transition-colors">{macros.fats}G</span>
                 <span className="text-zinc-500 text-[10px] font-bold tracking-widest uppercase">FATS</span>
               </div>
             </div>
             {resultText && (
               <div className="mt-8 p-4 bg-zinc-900/30 rounded-lg border border-zinc-800/50 text-sm text-zinc-400 leading-relaxed italic border-l-2 border-l-orange-600">
                 {resultText}
               </div>
             )}
          </div>
        </div>
      )}

      {/* 3. AI Food Nutrition Lookup */}
      <div className="glass p-6 rounded-xl border border-zinc-800/50">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-2 h-6 bg-blue-600 rounded-full"></div>
          <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight">AI FOOD ANALYZER</h2>
        </div>
        <p className="text-zinc-500 text-sm mb-6">Type any meal or food item to get a bodybuilding-specific nutritional breakdown.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input 
            type="text"
            value={foodQuery}
            onChange={(e) => setFoodQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleFoodSearch()}
            placeholder="e.g., '12oz Ribeye steak' or 'Peanut butter sandwich'"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-white focus:border-blue-600 outline-none transition-all"
          />
          <button
            onClick={handleFoodSearch}
            disabled={foodLoading || !foodQuery.trim()}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 uppercase font-oswald tracking-widest"
          >
            {foodLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            ) : 'ANALYZE FOOD'}
          </button>
        </div>

        {foodResult && (
          <div className="mt-8 animate-in fade-in slide-in-from-top duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 glass bg-zinc-900/40 p-6 rounded-xl text-center border border-zinc-800 relative">
                <div className={`absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center font-oswald text-xl font-bold border-2 ${
                  foodResult.grade.startsWith('A') ? 'border-green-500 text-green-500' : 
                  foodResult.grade.startsWith('B') ? 'border-blue-500 text-blue-500' : 
                  'border-orange-500 text-orange-500'
                }`}>
                  {foodResult.grade}
                </div>
                <h4 className="text-zinc-500 text-[10px] font-bold tracking-widest mb-1 uppercase">ANALYZE RESULT</h4>
                <p className="text-xl font-oswald font-bold text-white mb-4 line-clamp-1">{foodResult.foodName}</p>
                <p className="text-zinc-500 text-xs mb-4">Serving: {foodResult.servingSize}</p>
                <div className="text-3xl font-oswald font-bold text-white">{foodResult.calories}</div>
                <p className="text-zinc-600 text-[10px] font-bold tracking-widest">KCAL</p>
              </div>

              <div className="md:col-span-3 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-orange-500 block mb-1 uppercase tracking-widest">PROTEIN</span>
                    <span className="text-2xl font-oswald font-bold text-white">{foodResult.protein}g</span>
                  </div>
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-blue-500 block mb-1 uppercase tracking-widest">CARBS</span>
                    <span className="text-2xl font-oswald font-bold text-white">{foodResult.carbs}g</span>
                  </div>
                  <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-yellow-500 block mb-1 uppercase tracking-widest">FATS</span>
                    <span className="text-2xl font-oswald font-bold text-white">{foodResult.fats}g</span>
                  </div>
                </div>
                
                <div className="p-5 glass border-l-4 border-l-blue-600 bg-blue-900/5">
                   <h5 className="text-[10px] font-bold text-zinc-500 tracking-widest uppercase mb-2">ABEBE'S VERDICT</h5>
                   <p className="text-zinc-300 italic text-sm leading-relaxed">"{foodResult.coachTip}"</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-6 bg-zinc-600 rounded-full"></div>
          <h2 className="text-2xl font-oswald font-bold text-white uppercase tracking-tight">ANABOLIC STAPLES LIBRARY</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {NUTRITION_STAPLES.map((cat, idx) => (
            <div key={idx} className="glass rounded-xl overflow-hidden border border-zinc-800/50">
              <div className="bg-zinc-800/40 p-4 border-b border-zinc-800">
                <h3 className={`font-oswald font-bold text-lg tracking-widest ${cat.color}`}>{cat.category}</h3>
              </div>
              <div className="p-2 divide-y divide-zinc-800/50">
                {cat.foods.map((food, fIdx) => (
                  <div key={fIdx} className="p-4 hover:bg-zinc-800/30 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-zinc-100 text-sm group-hover:text-white transition-colors">{food.name}</h4>
                      <span className="text-[10px] font-bold text-zinc-600">{food.cal} KCAL</span>
                    </div>
                    <p className="text-[10px] text-zinc-500 mb-3 uppercase tracking-tighter">{food.size}</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-[9px] font-bold">
                        <span className="text-orange-500 mr-1">P</span>
                        <span className="text-zinc-300">{food.p}g</span>
                      </div>
                      <div className="text-[9px] font-bold">
                        <span className="text-blue-500 mr-1">C</span>
                        <span className="text-zinc-300">{food.c}g</span>
                      </div>
                      <div className="text-[9px] font-bold">
                        <span className="text-yellow-500 mr-1">F</span>
                        <span className="text-zinc-300">{food.f}g</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Macros;
