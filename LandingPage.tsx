import React from 'react';

interface LandingPageProps {
  onStart: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#050505] text-blue-50 selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center font-oswald text-2xl font-bold italic shadow-lg shadow-blue-900/40">A</div>
            <span className="font-oswald text-2xl font-bold tracking-tighter uppercase">ABEBE <span className="text-blue-500">AI</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-bold tracking-widest uppercase text-blue-200/40">
            <a href="#features" className="hover:text-white transition-colors">Science</a>
            <a href="#results" className="hover:text-white transition-colors">Results</a>
            <a href="#about" className="hover:text-white transition-colors">The Coach</a>
          </div>
          <button 
            onClick={onStart}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded font-bold text-xs tracking-widest uppercase transition-all shadow-lg shadow-blue-900/40"
          >
            Enter Academy
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-600/30 blur-[120px] rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 mb-8 bg-zinc-900 border border-blue-900/30 rounded-full text-[10px] font-bold tracking-[0.3em] uppercase text-cyan-400 animate-pulse">
            The Future of Hypertrophy
          </div>
          <h1 className="text-6xl md:text-8xl font-oswald font-bold leading-[0.9] tracking-tighter uppercase mb-8">
            FORGE AN <span className="text-blue-500">ELITE</span> PHYSIQUE <br className="hidden md:block"/> WITH AI PRECISION
          </h1>
          <p className="text-blue-200/40 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop guessing. Start growing. Coach Abebe combines elite-level bodybuilding expertise with advanced AI to deliver the most effective programming on the planet.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onStart}
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-lg tracking-widest uppercase font-oswald transition-all shadow-2xl shadow-blue-900/40"
            >
              Start Your Evolution
            </button>
            <div className="flex items-center gap-4 px-6 py-5 border border-zinc-800 rounded-lg bg-zinc-900/50 backdrop-blur">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-black bg-blue-900 flex items-center justify-center text-[10px] font-bold text-white">W</div>
                ))}
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white uppercase">10k+ Warriors</div>
                <div className="text-[10px] text-blue-300/40 font-bold uppercase tracking-widest">Forged in Iron</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-oswald font-bold tracking-tight uppercase mb-4">ENGINEERED FOR <span className="text-blue-500">MASS</span></h2>
            <p className="text-blue-400/50 uppercase tracking-widest font-bold text-xs">Scientific principles. Brutal intensity.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-600/30 transition-all group">
              <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-oswald font-bold mb-4 uppercase tracking-tight">Dynamic Programming</h3>
              <p className="text-blue-100/40 leading-relaxed text-sm">Adaptive training splits based on your recovery, frequency, and specific muscle weak points.</p>
            </div>

            <div className="p-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-600/30 transition-all group">
              <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-oswald font-bold mb-4 uppercase tracking-tight">Macro Intelligence</h3>
              <p className="text-blue-100/40 leading-relaxed text-sm">Precision nutrition calculations and food analysis. Every calorie is accounted for in your pursuit of mass.</p>
            </div>

            <div className="p-10 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-blue-600/30 transition-all group">
              <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-oswald font-bold mb-4 uppercase tracking-tight">Wearable Sync</h3>
              <p className="text-blue-100/40 leading-relaxed text-sm">Real-time intensity tracking. Monitor your heart rate and caloric expenditure during every brutal session.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-oswald font-bold text-white mb-1">100%</div>
            <div className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Scientifically Backed</div>
          </div>
          <div>
            <div className="text-4xl font-oswald font-bold text-white mb-1">24/7</div>
            <div className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Coach Access</div>
          </div>
          <div>
            <div className="text-4xl font-oswald font-bold text-white mb-1">500k+</div>
            <div className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Reps Tracked</div>
          </div>
          <div>
            <div className="text-4xl font-oswald font-bold text-white mb-1">∞</div>
            <div className="text-[10px] text-blue-400/50 font-bold uppercase tracking-widest">Growth Potential</div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-blue-600 opacity-5"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-7xl font-oswald font-bold tracking-tight uppercase mb-8 leading-tight">THE ONLY THING STANDING <br/> BETWEEN YOU AND YOUR GOALS <br/> IS <span className="text-blue-500">INTENSITY</span></h2>
          <button 
            onClick={onStart}
            className="px-12 py-6 bg-white text-black font-bold rounded-lg text-xl tracking-widest uppercase font-oswald hover:bg-blue-50 transition-all shadow-2xl shadow-white/10"
          >
            Join the Academy Now
          </button>
        </div>
      </section>

      <footer className="py-12 border-t border-zinc-800 text-center text-blue-900">
        <div className="font-oswald text-xl font-bold tracking-tighter text-blue-700 mb-4">ABEBE AI</div>
        <div className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">Created by Yohanes Muluneh</div>
      </footer>
    </div>
  );
};

export default LandingPage;