import React from 'react';
import { EXPERIMENTS } from '../../lib/constants';
import { Zap, Layers, SunMedium, Atom, Cable, Activity, Magnet, Radio, Sparkles, FileCheck } from 'lucide-react';

interface SidebarProps {
  activeExperimentId: number | 'index';
  onSelectExperiment: (id: number | 'index') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeExperimentId, onSelectExperiment }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Laser': return <Zap className="w-4 h-4" />;
      case 'Layers': return <Layers className="w-4 h-4" />;
      case 'SunMedium': return <SunMedium className="w-4 h-4" />;
      case 'Atom': return <Atom className="w-4 h-4" />;
      case 'Cable': return <Cable className="w-4 h-4" />;
      case 'Activity': return <Activity className="w-4 h-4" />;
      case 'Magnet': return <Magnet className="w-4 h-4" />;
      case 'Radio': return <Radio className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const categories = ['Optics', 'Electromagnetism', 'Quantum', 'Acoustics'] as const;

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-5 print:hidden">
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 backdrop-blur-sm">
        {/* Index Page Navigation Item */}
        <div className="mb-3">
          <button
            onClick={() => onSelectExperiment('index')}
            className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
              activeExperimentId === 'index'
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-white font-medium shadow-md shadow-cyan-950/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800/80 bg-slate-950/40'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              activeExperimentId === 'index' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'
            }`}>
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                Practical File Index
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              </div>
              <div className="text-[10px] text-slate-400">Journal & Evaluation Record</div>
            </div>
          </button>
        </div>

        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-2 flex items-center justify-between border-t border-slate-800/60 pt-3">
          <span>Experiment Workbenches</span>
          <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded-full text-cyan-400">
            8 LABS
          </span>
        </div>

        <div className="space-y-4">
          {categories.map((cat) => {
            const catExperiments = EXPERIMENTS.filter((e) => e.category === cat);
            if (catExperiments.length === 0) return null;

            return (
              <div key={cat} className="space-y-1">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-2.5 py-1">
                  {cat}
                </div>
                {catExperiments.map((exp) => {
                  const isActive = exp.id === activeExperimentId;
                  return (
                    <button
                      key={exp.id}
                      onClick={() => onSelectExperiment(exp.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center gap-3 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border border-cyan-500/40 text-white font-medium shadow-md shadow-cyan-950/40'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {getIcon(exp.iconName)}
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate font-medium">
                          Exp {exp.id}: {exp.shortTitle}
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {exp.formulaSummary}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Heritage & Resume Badge */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 text-xs space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>B.Tech Academic Practical File</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Engineered by <strong>Shehzad</strong>. Complete transition from 1st-year C++ CLI scripts to high-precision 60 FPS Canvas simulations and automated lab record reporting.
        </p>
      </div>
    </aside>
  );
};
