import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, BookOpen, Brain, Sparkles } from 'lucide-react';
import { VIVA_QUESTIONS_DB, EXPERIMENTS } from '../../lib/constants';

interface VivaTutorModalProps {
  activeExperimentId: number;
  onClose: () => void;
}

const experimentTheme: Record<number, { surface: string; text: string; focus: string }> = {
  1: { surface: 'bg-rose-50 border-rose-100', text: 'text-rose-900', focus: 'focus-visible:outline-rose-600' },
  2: { surface: 'bg-amber-50 border-amber-100', text: 'text-amber-900', focus: 'focus-visible:outline-amber-600' },
  3: { surface: 'bg-violet-50 border-violet-100', text: 'text-violet-900', focus: 'focus-visible:outline-violet-600' },
  4: { surface: 'bg-cyan-50 border-cyan-100', text: 'text-cyan-900', focus: 'focus-visible:outline-cyan-700' },
  5: { surface: 'bg-pink-50 border-pink-100', text: 'text-pink-900', focus: 'focus-visible:outline-pink-600' },
  6: { surface: 'bg-blue-50 border-blue-100', text: 'text-blue-900', focus: 'focus-visible:outline-blue-600' },
  7: { surface: 'bg-emerald-50 border-emerald-100', text: 'text-emerald-900', focus: 'focus-visible:outline-emerald-700' },
  8: { surface: 'bg-indigo-50 border-indigo-100', text: 'text-indigo-900', focus: 'focus-visible:outline-indigo-600' },
};

export const VivaTutorModal: React.FC<VivaTutorModalProps> = ({ activeExperimentId, onClose }) => {
  const [selectedExpId, setSelectedExpId] = useState<number>(activeExperimentId);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);
  const [revealedAnswers, setRevealedAnswers] = useState<Record<number, boolean>>({});

  const expMeta = EXPERIMENTS.find((e) => e.id === selectedExpId) || EXPERIMENTS[0];
  const questions = VIVA_QUESTIONS_DB[selectedExpId] || [];
  const theme = experimentTheme[selectedExpId] ?? experimentTheme[1];

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx);
  };

  const toggleReveal = (idx: number) => {
    setRevealedAnswers({ ...revealedAnswers, [idx]: !revealedAnswers[idx] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-700">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                Viva Tutor
              </h2>
              <p className="text-xs text-slate-500">
                Review key ideas and practise your answers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Experiment Selector Bar */}
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <label htmlFor="viva-experiment" className="text-xs text-slate-600 whitespace-nowrap">Experiment</label>
            <select
              id="viva-experiment"
              value={selectedExpId}
              onChange={(e) => {
                setSelectedExpId(Number(e.target.value));
                setExpandedIndex(0);
                setRevealedAnswers({});
              }}
              className={`bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 ${theme.focus}`}
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
                ? 'bg-violet-100 border-violet-300 text-violet-900'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-700" />
            {quizMode ? 'Quiz mode' : 'Study mode'}
          </button>
        </div>

        {/* Question Bank List */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className={`p-4 rounded-xl border ${theme.surface}`}>
            <div className={`text-sm font-semibold mb-1 flex items-center gap-1.5 ${theme.text}`}>
              <BookOpen className="w-3.5 h-3.5" />
              {expMeta.title}
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
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
                  className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-slate-800">
                          {q.question}
                        </div>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                            q.difficulty === 'Basic'
                              ? 'bg-emerald-50 text-emerald-800'
                              : q.difficulty === 'Conceptual'
                              ? 'bg-cyan-50 text-cyan-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}>
                            {q.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 mt-1" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-3 border-t border-slate-100">
                      {isRevealed ? (
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                          <strong className="text-emerald-800 block mb-1">Answer</strong>
                          {q.answer}
                        </div>
                      ) : (
                        <div className="p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300 text-center">
                          <p className="text-sm text-slate-600 mb-2">
                            Try answering before you reveal the explanation.
                          </p>
                          <button
                            onClick={() => toggleReveal(idx)}
                            className="px-3 py-1.5 rounded-lg bg-violet-700 hover:bg-violet-800 text-white text-xs font-semibold transition-colors"
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
