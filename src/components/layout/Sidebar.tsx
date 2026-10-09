import React from 'react';
import { EXPERIMENTS } from '../../lib/constants';
import { Zap, Layers, SunMedium, Atom, Cable, Activity, Magnet, Radio, FileCheck, Sparkles } from 'lucide-react';

interface SidebarProps {
  activeExperimentId: number | 'index';
  onSelectExperiment: (id: number | 'index') => void;
}

const activeStyles: Record<string, string> = {
  Laser: 'border-rose-200 bg-rose-50 text-rose-950',
  Layers: 'border-amber-200 bg-amber-50 text-amber-950',
  SunMedium: 'border-violet-200 bg-violet-50 text-violet-950',
  Atom: 'border-cyan-200 bg-cyan-50 text-cyan-950',
  Cable: 'border-pink-200 bg-pink-50 text-pink-950',
  Activity: 'border-blue-200 bg-blue-50 text-blue-950',
  Magnet: 'border-emerald-200 bg-emerald-50 text-emerald-950',
  Radio: 'border-indigo-200 bg-indigo-50 text-indigo-950',
};

const activeIconStyles: Record<string, string> = {
  Laser: 'bg-rose-600 text-white',
  Layers: 'bg-amber-600 text-white',
  SunMedium: 'bg-violet-600 text-white',
  Atom: 'bg-cyan-700 text-white',
  Cable: 'bg-pink-600 text-white',
  Activity: 'bg-blue-600 text-white',
  Magnet: 'bg-emerald-700 text-white',
  Radio: 'bg-indigo-600 text-white',
};

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

  return (
    <aside className="w-full lg:w-64 xl:w-72 shrink-0 print:hidden">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-sm font-semibold text-slate-900">Experiments</h2>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">8 practicals</span>
        </div>
        <div className="mb-2">
          <button
            onClick={() => onSelectExperiment('index')}
            className={`w-full rounded-xl border p-2.5 text-left flex items-center gap-3 transition-colors ${
              activeExperimentId === 'index'
                ? 'border-cyan-200 bg-cyan-50 text-cyan-950'
                : 'border-transparent text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className={`p-1.5 rounded-lg shrink-0 ${
              activeExperimentId === 'index' ? 'bg-cyan-700 text-white' : 'bg-slate-100 text-cyan-800'
            }`}>
              <FileCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-semibold">Home</span>
          </button>
        </div>

        <nav aria-label="Experiment navigation" className="grid grid-cols-2 gap-1.5 lg:flex lg:flex-col">
          {EXPERIMENTS.map((exp) => {
            const isActive = exp.id === activeExperimentId;
            const activeStyle = activeStyles[exp.iconName] ?? 'border-cyan-200 bg-cyan-50 text-cyan-950';
            const activeIconStyle = activeIconStyles[exp.iconName] ?? 'bg-cyan-700 text-white';
            return (
              <button
                key={exp.id}
                onClick={() => onSelectExperiment(exp.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`w-full min-w-0 rounded-xl border p-2 text-left flex items-center gap-2 transition-colors ${
                  isActive
                    ? activeStyle
                    : 'border-transparent text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className={`p-1.5 rounded-lg shrink-0 ${isActive ? activeIconStyle : 'bg-slate-100 text-slate-500'}`}>
                  {getIcon(exp.iconName)}
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] text-slate-500">Experiment {exp.id}</span>
                  <span className="block truncate text-xs font-medium">{exp.shortTitle}</span>
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
