import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { PracticalIndexPage } from './components/index/PracticalIndexPage';
import { Exp1Divergence } from './components/experiments/Exp1Divergence';
import { Exp2Dielectric } from './components/experiments/Exp2Dielectric';
import { Exp3Diffraction } from './components/experiments/Exp3Diffraction';
import { Exp4Photoelectric } from './components/experiments/Exp4Photoelectric';
import { Exp5NumericalAperture } from './components/experiments/Exp5NumericalAperture';
import { Exp6Attenuation } from './components/experiments/Exp6Attenuation';
import { Exp7Hysteresis } from './components/experiments/Exp7Hysteresis';
import { Exp8Ultrasonic } from './components/experiments/Exp8Ultrasonic';
import { LabReportModal } from './components/report/LabReportModal';
import { VivaTutorModal } from './components/viva/VivaTutorModal';
import type { LabReportData } from './types/physics';
import { ArrowLeft } from 'lucide-react';
import './App.css';

export const App: React.FC = () => {
  const [activeExperimentId, setActiveExperimentId] = useState<number | 'index'>('index');
  const [reportData, setReportData] = useState<LabReportData | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);

  const handleGenerateReport = (data: LabReportData) => {
    setReportData(data);
  };

  const renderActiveView = () => {
    if (activeExperimentId === 'index') {
      return <PracticalIndexPage onSelectExperiment={(id) => setActiveExperimentId(id)} />;
    }

    return (
      <div className="space-y-4">
        {/* Academic Breadcrumb to return to Index Page */}
        <div className="flex items-center justify-between bg-slate-900/60 border border-slate-800/80 px-4 py-2.5 rounded-xl text-xs print:hidden">
          <button
            onClick={() => setActiveExperimentId('index')}
            className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Practical File Index</span>
          </button>
          <div className="text-slate-400 font-mono text-[11px] hidden sm:block">
            Journal Entry {activeExperimentId} of 8
          </div>
        </div>

        {/* Experiment Workbench */}
        {activeExperimentId === 1 && <Exp1Divergence onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 2 && <Exp2Dielectric onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 3 && <Exp3Diffraction onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 4 && <Exp4Photoelectric onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 5 && <Exp5NumericalAperture onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 6 && <Exp6Attenuation onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 7 && <Exp7Hysteresis onGenerateReport={handleGenerateReport} />}
        {activeExperimentId === 8 && <Exp8Ultrasonic onGenerateReport={handleGenerateReport} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar
        onOpenViva={() => setIsVivaModalOpen(true)}
        onNavigateIndex={() => setActiveExperimentId('index')}
        isIndexActive={activeExperimentId === 'index'}
      />

      {/* Main Lab Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeExperimentId={activeExperimentId}
            onSelectExperiment={setActiveExperimentId}
          />

          {/* Center Experiment Workbench or Index Page */}
          <div className="flex-1 min-w-0">
            {renderActiveView()}
          </div>
        </div>
      </main>

      {/* Lab Report Generator Modal */}
      <LabReportModal
        data={reportData}
        onClose={() => setReportData(null)}
      />

      {/* Viva Tutor / Examination Modal */}
      {isVivaModalOpen && (
        <VivaTutorModal
          activeExperimentId={typeof activeExperimentId === 'number' ? activeExperimentId : 1}
          onClose={() => setIsVivaModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
