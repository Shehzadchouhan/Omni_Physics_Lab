import React from 'react';
import { Atom, BookOpen, GitBranch, FileCheck } from 'lucide-react';

interface NavbarProps {
  onOpenViva: () => void;
  onNavigateIndex: () => void;
  isIndexActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenViva, onNavigateIndex, isIndexActive }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & Logo (Clickable to return to Index) */}
        <button
          onClick={onNavigateIndex}
          className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 group-hover:scale-105 transition-transform">
            <Atom className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-cyan-800 transition-colors">
                OmniLab
              </span>
            </div>
            <p className="text-[11px] hidden sm:block text-slate-500">
              Physics practicals, made easier to explore
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {!isIndexActive && (
            <button
              onClick={onNavigateIndex}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-200"
            >
              <FileCheck className="w-3.5 h-3.5 text-cyan-700" />
              <span className="hidden sm:inline">Home</span>
            </button>
          )}

          <button
            onClick={onOpenViva}
            className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-violet-700" />
            <span className="hidden sm:inline">Viva Tutor & Q&A</span>
          </button>

          <a
            href="https://github.com/Shehzadchouhan/Physics-Practical-File"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
