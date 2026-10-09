import React from 'react';
import { Atom, BookOpen, GitBranch } from 'lucide-react';

interface NavbarProps {
  onOpenViva: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenViva }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50">
            <Atom className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white">
                OmniLab
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-bold">
                STUDIO v2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Applied Physics Scientific Simulation & Metrology Engine
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenViva}
            className="px-3.5 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-400" />
            <span>Viva Tutor & Q&A</span>
          </button>

          <a
            href="https://github.com/Shehzadchouhan/Physics-Practical-File"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">GitHub Repository</span>
          </a>
        </div>
      </div>
    </header>
  );
};
