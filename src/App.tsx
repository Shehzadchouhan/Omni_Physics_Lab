import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
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
import './App.css';

export const App: React.FC = () => {
  const [activeExperimentId, setActiveExperimentId] = useState<number>(1);
  const [reportData, setReportData] = useState<LabReportData | null>(null);
  const [isVivaModalOpen, setIsVivaModalOpen] = useState<boolean>(false);

  const handleGenerateReport = (data: LabReportData) => {
    setReportData(data);
  };

  const renderActiveExperiment = () => {
    switch (activeExperimentId) {
      case 1:
        return <Exp1Divergence onGenerateReport={handleGenerateReport} />;
      case 2:
        return <Exp2Dielectric onGenerateReport={handleGenerateReport} />;
      case 3:
        return <Exp3Diffraction onGenerateReport={handleGenerateReport} />;
      case 4:
        return <Exp4Photoelectric onGenerateReport={handleGenerateReport} />;
      case 5:
        return <Exp5NumericalAperture onGenerateReport={handleGenerateReport} />;
      case 6:
        return <Exp6Attenuation onGenerateReport={handleGenerateReport} />;
      case 7:
        return <Exp7Hysteresis onGenerateReport={handleGenerateReport} />;
      case 8:
        return <Exp8Ultrasonic onGenerateReport={handleGenerateReport} />;
      default:
        return <Exp1Divergence onGenerateReport={handleGenerateReport} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Top Navbar */}
      <Navbar onOpenViva={() => setIsVivaModalOpen(true)} />

      {/* Main Lab Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Navigation Sidebar */}
          <Sidebar
            activeExperimentId={activeExperimentId}
            onSelectExperiment={setActiveExperimentId}
          />

          {/* Center Experiment Workbench */}
          <div className="flex-1 min-w-0">
            {renderActiveExperiment()}
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
          activeExperimentId={activeExperimentId}
          onClose={() => setIsVivaModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
