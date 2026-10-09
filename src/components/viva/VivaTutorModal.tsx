import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, BookOpen, Brain, Sparkles } from 'lucide-react';
import { VIVA_QUESTIONS_DB, EXPERIMENTS } from '../../lib/constants';

interface VivaTutorModalProps {
  activeExperimentId: number;
  onClose: () => void;
}

export const VivaTutorModal: React.FC<VivaTutorModalProps> = ({ activeExperimentId, onClose }) => {
  const [selectedExpId, setSelectedExpId] = useState<number>(activeExperimentId);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const expMeta = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];
  const questions = VIVA_QUESTIONS_DB[selectedExpId] || [];

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const toggleReveal = (idx: number) => {
    setRevealedAnswers({ ...revealedAnswers, [idx]: !revealedAnswers[idx] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                AI Viva Voce Examiner & Theory Tutor
              </h2>
              <p className="text-xs text-slate-400">
                Master theoretical viva concepts, formulas, and interview defense
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Experiment Selector Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3 overflow-x-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 whitespace-nowrap">Select Experiment:</span>
            <select
              value={selectedExpId}
              onChange={(e) => {
                setSelectedExpId(Number(e.target.value));
                setExpandedIndex(0);
                setRevealedAnswers({});
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
            >
              {EXPERIMENTS.map((exp) => (
                <option key={exp.id} value={exp.id}>
                  Exp {exp.id}: {exp.shortTitle}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setQuizMode(!quizMode)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              quizMode
                ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            {quizMode ? 'Quiz Mode: ON (Hidden Answers)' : 'Study Mode (All Answers)'}
          </button>
        </div>

        {/* Question Bank List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/30">
            <div className="text-xs text-purple-300 font-semibold mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {expMeta.title}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {expMeta.aim}
            </p>
          </div>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isExpanded = expandedIndex === idx;
              const isRevealed = !quizMode || revealedAnswers[idx];

              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all hover:border-slate-700"
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {q.question}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            q.difficulty === 'Basic'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : q.difficulty === 'Conceptual'
                              ? 'bg-cyan-500/10 text-cyan-400'
                              : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-slate-900">
                      {isRevealed ? (
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <strong className="text-emerald-400 block mb-1">Answer / Technical Defense:</strong>
                          {q.answer}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-slate-900/80 border border-dashed border-slate-700 text-center">
                          <p className="text-xs text-slate-400 mb-2">
                            Self-Test Mode: Formulate your answer first!
                          </p>
                          <button
                            onClick={() => toggleReveal(idx)}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
                          >
                            Reveal Answer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
