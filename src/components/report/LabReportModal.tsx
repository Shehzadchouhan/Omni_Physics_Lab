import React from 'react';
import { X, Printer, CheckCircle2, Award } from 'lucide-react';
import type { LabReportData } from '../../types/physics';
import { KatexMath } from '../common/KatexMath';

interface LabReportModalProps {
  data: LabReportData | null;
  onClose: () => void;
}

export const LabReportModal: React.FC<LabReportModalProps> = ({ data, onClose }) => {
  if (!data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            <Award className="w-4 h-4 text-cyan-400" />
            Official Laboratory Practical Record Sheet
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-950"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-200 bg-slate-950 print:bg-white print:text-black print:p-0">
          {/* University / Lab Header */}
          <div className="text-center border-b border-slate-800 pb-5 print:border-black">
            <div className="text-xs uppercase tracking-widest text-cyan-400 print:text-blue-700 font-bold">
              Department of Applied Physics & Engineering
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white print:text-black mt-1">
              ENGINEERING PHYSICS LABORATORY REPORT
            </h1>
            <div className="text-xs text-slate-400 print:text-gray-600 mt-1">
              Simulation & Precision Metrology Practical File Record
            </div>
          </div>

          {/* Student & Session Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs print:bg-gray-50 print:border-gray-300">
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Candidate Name:</span>
              <span className="font-semibold text-white print:text-black">{data.studentName}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Registration / Roll No:</span>
              <span className="font-semibold text-white print:text-black font-mono">{data.rollNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Date of Evaluation:</span>
              <span className="font-semibold text-white print:text-black">{data.date}</span>
            </div>
            <div>
              <span className="text-slate-400 print:text-gray-500 block">Status:</span>
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 print:text-green-700">
                <CheckCircle2 className="w-3 h-3" /> Verified & Computed
              </span>
            </div>
          </div>

          {/* Experiment Title & Aim */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 print:text-gray-600">
              EXPERIMENT NO. {data.experimentId}
            </div>
            <h2 className="text-lg font-bold text-cyan-300 print:text-blue-900">
              {data.experimentTitle}
            </h2>
            <div className="text-xs text-slate-300 print:text-gray-800">
              <strong className="text-white print:text-black">Aim: </strong>
              {data.aim}
            </div>
          </div>

          {/* Apparatus */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              Apparatus Required
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-slate-300 print:text-gray-800">
              {data.apparatus.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 print:bg-blue-600"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Formula Used */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              Formulae & Mathematical Formulation
            </h3>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-center print:bg-gray-100 print:border-gray-300">
              <KatexMath math={data.formulaLatex} block />
            </div>
          </div>

          {/* Parameters */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              Experimental Parameters & Presets
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
              {Object.entries(data.parameters).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-200">
                  <span className="text-slate-400 print:text-gray-500 block text-[11px]">{key}</span>
                  <span className="font-mono font-semibold text-slate-200 print:text-black">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Observation Table */}
          {data.readings.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
                Observation Table
              </h3>
              <div className="overflow-x-auto border border-slate-800 rounded-xl print:border-gray-300">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-300 print:bg-gray-200 print:text-black">
                    <tr className="divide-x divide-slate-800 print:divide-gray-300">
                      {Object.keys(data.readings[0]).map((col) => (
                        <th key={col} className="py-2 px-3 font-semibold">{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 font-mono text-slate-200 print:divide-gray-300 print:text-black">
                    {data.readings.map((row, idx) => (
                      <tr key={idx} className="divide-x divide-slate-800/60 hover:bg-slate-900/40 print:divide-gray-300">
                        {Object.values(row).map((val, cellIdx) => (
                          <td key={cellIdx} className="py-1.5 px-3">{String(val)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Calculated Results */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              Calculated Results & Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
              {Object.entries(data.calculatedResults).map(([key, val]) => (
                <div key={key} className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 print:bg-gray-50 print:border-gray-300">
                  <span className="text-slate-400 print:text-gray-500 block text-[11px]">{key}</span>
                  <span className="font-mono font-bold text-cyan-300 print:text-blue-900 text-sm mt-0.5 block">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <h3 className="text-xs font-bold text-slate-400 print:text-gray-700 uppercase tracking-wider">
              Conclusion & Discussion
            </h3>
            <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
              {data.conclusion}
            </p>
          </div>

          {/* Signatures for Academic Submission */}
          <div className="pt-8 border-t border-slate-800 grid grid-cols-2 text-xs text-slate-400 print:border-black print:text-black">
            <div>
              <div className="h-10"></div>
              <div className="border-t border-slate-700 w-44 pt-1 print:border-black">Candidate Signature</div>
            </div>
            <div className="text-right flex flex-col items-end">
              <div className="h-10"></div>
              <div className="border-t border-slate-700 w-44 pt-1 text-right print:border-black">Faculty In-Charge</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
