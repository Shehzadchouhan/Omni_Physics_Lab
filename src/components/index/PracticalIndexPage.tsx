import React, { useState } from 'react';
import { EXPERIMENTS } from '../../lib/constants';
import {
  Printer,
  ExternalLink,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  Sparkles,
  Zap,
  Layers,
  SunMedium,
  Atom,
  Cable,
  Activity,
  Magnet,
  Radio,
  FileCheck
} from 'lucide-react';

interface PracticalIndexPageProps {
  onSelectExperiment: (id: number) => void;
}

interface IndexRowData {
  id: number;
  datePerformed: string;
  dateSubmitted: string;
  pageFrom: number;
  pageTo: number;
  marksAwarded: number;
  remarks: string;
}

export const PracticalIndexPage: React.FC<PracticalIndexPageProps> = ({ onSelectExperiment }) => {
  // Candidate & Academic Details
  const [studentName, setStudentName] = useState<string>('Shehzad Chouhan');
  const [rollNumber, setRollNumber] = useState<string>('ENG-2024-PHYS01');
  const [academicBranch, setAcademicBranch] = useState<string>('Computer Science & Engineering');
  const [academicYear, setAcademicYear] = useState<string>('B.Tech 1st Year (Sem I/II)');
  const [facultyName, setFacultyName] = useState<string>('Dr. R. K. Sharma (Dept. of Physics)');

  // Default dates and continuous assessment marks for the 8 experiments
  const [indexData] = useState<Record<number, IndexRowData>>({
    1: { id: 1, datePerformed: '12-Aug-2024', dateSubmitted: '19-Aug-2024', pageFrom: 1, pageTo: 6, marksAwarded: 10, remarks: 'Excellent Gaussian profile analysis' },
    2: { id: 2, datePerformed: '26-Aug-2024', dateSubmitted: '02-Sep-2024', pageFrom: 7, pageTo: 13, marksAwarded: 9.5, remarks: 'Accurate dielectric permittivity ratio' },
    3: { id: 3, datePerformed: '09-Sep-2024', dateSubmitted: '16-Sep-2024', pageFrom: 14, pageTo: 20, marksAwarded: 10, remarks: 'Precise diffraction grating element' },
    4: { id: 4, datePerformed: '23-Sep-2024', dateSubmitted: '30-Sep-2024', pageFrom: 21, pageTo: 28, marksAwarded: 10, remarks: 'R² = 0.998 linear regression fit verified' },
    5: { id: 5, datePerformed: '07-Oct-2024', dateSubmitted: '14-Oct-2024', pageFrom: 29, pageTo: 34, marksAwarded: 9.5, remarks: 'Valid TIR and acceptance cone angle' },
    6: { id: 6, datePerformed: '21-Oct-2024', dateSubmitted: '28-Oct-2024', pageFrom: 35, pageTo: 41, marksAwarded: 10, remarks: 'Cutback method attenuation verified' },
    7: { id: 7, datePerformed: '04-Nov-2024', dateSubmitted: '11-Nov-2024', pageFrom: 42, pageTo: 49, marksAwarded: 10, remarks: 'B-H loop traced accurately on CRO' },
    8: { id: 8, datePerformed: '18-Nov-2024', dateSubmitted: '25-Nov-2024', pageFrom: 50, pageTo: 56, marksAwarded: 9.5, remarks: 'Acoustic resonance nodes confirmed' },
  });

  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const getExpIcon = (iconName: string) => {
    switch (iconName) {
      case 'Laser': return <Zap className="w-4 h-4 text-red-400" />;
      case 'Layers': return <Layers className="w-4 h-4 text-amber-400" />;
      case 'SunMedium': return <SunMedium className="w-4 h-4 text-purple-400" />;
      case 'Atom': return <Atom className="w-4 h-4 text-cyan-400" />;
      case 'Cable': return <Cable className="w-4 h-4 text-rose-400" />;
      case 'Activity': return <Activity className="w-4 h-4 text-blue-400" />;
      case 'Magnet': return <Magnet className="w-4 h-4 text-emerald-400" />;
      case 'Radio': return <Radio className="w-4 h-4 text-cyan-400" />;
      default: return <Sparkles className="w-4 h-4 text-yellow-400" />;
    }
  };

  const filteredExperiments = EXPERIMENTS.filter((exp) => {
    if (filterCategory === 'ALL') return true;
    return exp.category.toUpperCase() === filterCategory;
  });

  const totalMarks = Object.values(indexData).reduce((acc, row) => acc + row.marksAwarded, 0);
  const maxPossibleMarks = EXPERIMENTS.length * 10;
  const percentageScore = ((totalMarks / maxPossibleMarks) * 100).toFixed(1);

  const handlePrintIndex = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Academic Journal Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm print:bg-white print:border-black print:p-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5 print:border-black">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-950/50 print:hidden shrink-0">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-cyan-400 print:text-blue-800 font-bold">
                Department of Applied Sciences & Engineering Physics
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold text-white print:text-black mt-0.5">
                LABORATORY PRACTICAL FILE INDEX & CONTINUOUS EVALUATION
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600 mt-1">
                Official Engineering Physics Laboratory Record • Academic Session 2024–2025
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <button
              onClick={handlePrintIndex}
              className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-cyan-950 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Practical Index Sheet</span>
            </button>
          </div>
        </div>

        {/* Student Credentials Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-5 text-xs">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 print:bg-gray-50 print:border-gray-300">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 flex items-center gap-1">
              <User className="w-3 h-3 text-cyan-400 print:hidden" />
              Candidate Name
            </div>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="mt-1 w-full bg-transparent font-bold text-white print:text-black outline-none text-xs"
            />
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 print:bg-gray-50 print:border-gray-300">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-emerald-400 print:hidden" />
              Roll / Reg. Number
            </div>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="mt-1 w-full bg-transparent font-mono font-bold text-white print:text-black outline-none text-xs"
            />
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 print:bg-gray-50 print:border-gray-300">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500">
              Discipline / Branch
            </div>
            <input
              type="text"
              value={academicBranch}
              onChange={(e) => setAcademicBranch(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-slate-200 print:text-black outline-none text-xs"
            />
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 print:bg-gray-50 print:border-gray-300">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-amber-400 print:hidden" />
              Academic Year / Term
            </div>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-slate-200 print:text-black outline-none text-xs"
            />
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 print:bg-gray-50 print:border-gray-300 col-span-2 sm:col-span-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-500 print:text-gray-500">
              Evaluator / Faculty
            </div>
            <input
              type="text"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
              className="mt-1 w-full bg-transparent font-semibold text-slate-300 print:text-black outline-none text-xs"
            />
          </div>
        </div>
      </div>

      {/* Domain Filter Badges (Screen view only) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Domain Filter:</span>
          {['ALL', 'OPTICS', 'ELECTROMAGNETISM', 'QUANTUM', 'ACOUSTICS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Total Score:</span>
          <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            {totalMarks} / {maxPossibleMarks} ({percentageScore}%)
          </span>
        </div>
      </div>

      {/* Official Practical File Index Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl print:bg-white print:border-black print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 border-b border-slate-800 text-slate-300 uppercase tracking-wider text-[11px] print:bg-gray-100 print:text-black print:border-black">
                <th className="py-3.5 px-3 text-center w-12 font-bold">Exp No.</th>
                <th className="py-3.5 px-3 font-semibold min-w-[280px]">Aim & Title of Experiment</th>
                <th className="py-3.5 px-3 font-semibold text-center w-28">Date Performed</th>
                <th className="py-3.5 px-3 font-semibold text-center w-28">Date Submitted</th>
                <th className="py-3.5 px-3 font-semibold text-center w-20">Page No.</th>
                <th className="py-3.5 px-3 font-semibold text-center w-24">Marks (10)</th>
                <th className="py-3.5 px-3 font-semibold min-w-[200px]">Remarks & Faculty Sign</th>
                <th className="py-3.5 px-3 text-center w-28 print:hidden">Workbench</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 font-sans print:divide-black">
              {filteredExperiments.map((exp) => {
                const row = indexData[exp.id] || {
                  id: exp.id,
                  datePerformed: '12-Aug-2024',
                  dateSubmitted: '19-Aug-2024',
                  pageFrom: exp.id * 7 - 6,
                  pageTo: exp.id * 7,
                  marksAwarded: 10,
                  remarks: 'Verified & Signed',
                };

                return (
                  <tr
                    key={exp.id}
                    className="hover:bg-slate-800/40 transition-colors group print:text-black"
                  >
                    {/* S.No */}
                    <td className="py-3 px-3 text-center font-bold text-cyan-400 print:text-black font-mono">
                      {String(exp.id).padStart(2, '0')}
                    </td>

                    {/* Experiment Title & Aim */}
                    <td className="py-3 px-3">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1 rounded bg-slate-800/80 border border-slate-700/60 print:hidden shrink-0 mt-0.5">
                          {getExpIcon(exp.iconName)}
                        </div>
                        <div>
                          <div className="font-semibold text-white print:text-black text-xs leading-snug">
                            {exp.title}
                          </div>
                          <div className="text-[11px] text-slate-400 print:text-gray-700 mt-0.5 leading-relaxed line-clamp-1">
                            {exp.aim}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 print:bg-gray-200 text-slate-300 print:text-black font-mono">
                              {exp.category}
                            </span>
                            <span className="text-[10px] text-slate-500 print:text-gray-600 font-mono">
                              {exp.formulaSummary}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date Performed */}
                    <td className="py-3 px-3 text-center font-mono text-slate-300 print:text-black text-[11px]">
                      {row.datePerformed}
                    </td>

                    {/* Date Submitted */}
                    <td className="py-3 px-3 text-center font-mono text-slate-300 print:text-black text-[11px]">
                      {row.dateSubmitted}
                    </td>

                    {/* Page Range */}
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-200 print:text-black text-[11px]">
                      {String(row.pageFrom).padStart(2, '0')} – {String(row.pageTo).padStart(2, '0')}
                    </td>

                    {/* Marks Awarded */}
                    <td className="py-3 px-3 text-center font-mono font-bold text-emerald-400 print:text-black text-xs">
                      {row.marksAwarded} / 10
                    </td>

                    {/* Remarks & Stamp / Signature */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 print:text-black shrink-0" />
                        <span className="text-[11px] text-slate-300 print:text-black italic">
                          {row.remarks}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 print:text-gray-700 font-mono mt-0.5">
                        Sign: [R.K. Sharma] ✔
                      </div>
                    </td>

                    {/* Action button (screen only) */}
                    <td className="py-3 px-3 text-center print:hidden">
                      <button
                        onClick={() => onSelectExperiment(exp.id)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-600 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1 transition-all border border-slate-700 hover:border-cyan-500 shadow-sm cursor-pointer w-full"
                      >
                        <span>Launch</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Index Table Footer Summary */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 print:bg-white print:border-black print:text-black">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-white print:text-black">
              Total Experiments Performed: 8 of 8
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Practical Course Completion
            </span>
          </div>

          <div className="font-mono font-bold text-slate-200 print:text-black text-sm">
            Cumulative Grade: A+ (Outstanding)
          </div>
        </div>
      </div>

      {/* Accreditation Course Outcomes (CO) & Academic Evaluation Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:hidden">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curriculum Course Outcomes (CO Mapping)
          </h3>
          <ul className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <li>
              <strong className="text-slate-200">CO1 (Wave Optics):</strong> Analyze laser beam divergence and evaluate Fraunhofer grating elements via diffraction.
            </li>
            <li>
              <strong className="text-slate-200">CO2 (Electromagnetism):</strong> Determine dielectric constant of solid specimens and trace magnetic hysteresis loops on a CRO.
            </li>
            <li>
              <strong className="text-slate-200">CO3 (Quantum Mechanics):</strong> Measure stopping potentials and compute Planck's constant & work function via least squares regression.
            </li>
            <li>
              <strong className="text-slate-200">CO4 (Fiber Optics & Acoustics):</strong> Calculate numerical aperture, signal attenuation in optical fibers, and ultrasonic wave velocity.
            </li>
          </ul>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Continuous Internal Assessment (CIA) Criteria
          </h3>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            <p>
              Each experiment in this practical file is continuously assessed across three academic parameters:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-white font-bold text-sm">4 Marks</div>
                <div className="text-[10px] text-slate-500">Performance & Simulation</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-white font-bold text-sm">3 Marks</div>
                <div className="text-[10px] text-slate-500">Calculations & Graphs</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <div className="text-white font-bold text-sm">3 Marks</div>
                <div className="text-[10px] text-slate-500">Viva Voce Defense</div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              *All 8 experiments are simulated with real-time 60 FPS physics engines and statistical confidence scores.
            </p>
          </div>
        </div>
      </div>

      {/* Signature Block for Printed Index Page */}
      <div className="hidden print:grid grid-cols-3 pt-12 text-xs border-t border-black text-black">
        <div>
          <div className="h-12"></div>
          <div className="border-t border-black pt-1 w-44">Signature of Candidate</div>
        </div>
        <div className="text-center">
          <div className="h-12"></div>
          <div className="border-t border-black pt-1 w-44 mx-auto">Teacher In-Charge</div>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="h-12"></div>
          <div className="border-t border-black pt-1 w-44 text-right">Head of Department</div>
        </div>
      </div>
    </div>
  );
};
