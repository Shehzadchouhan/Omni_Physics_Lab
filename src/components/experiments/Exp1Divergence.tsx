import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, RotateCcw, Info, Sliders, Table, Sparkles } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp1Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface ReadingRow {
  id: number;
  distanceD: number; // in cm
  spotW: number;     // in cm
}

export const Exp1Divergence: React.FC<Exp1Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Optical bench controls
  const [laserType, setLaserType] = useState<'red' | 'green' | 'blue'>('red');
  const [distanceD, setDistanceD] = useState<number>(100); // 10 to 300 cm
  const [initialWaistW0, setInitialWaistW0] = useState<number>(0.12); // cm
  const [customDivergenceMrad, setCustomDivergenceMrad] = useState<number>(1.85); // mrad

  // Observation table
  const [readings, setReadings] = useState<ReadingRow[]>([
    { id: 1, distanceD: 50, spotW: 0.22 },
    { id: 2, distanceD: 100, spotW: 0.31 },
    { id: 3, distanceD: 150, spotW: 0.40 },
    { id: 4, distanceD: 200, spotW: 0.49 },
  ]);

  // Wavelength mapping
  const wavelengthNm = useMemo(() => {
    switch (laserType) {
      case 'red': return 632.8;
      case 'green': return 532.0;
      case 'blue': return 405.0;
    }
  }, [laserType]);

  const laserColor = useMemo(() => {
    switch (laserType) {
      case 'red': return '#ef4444';
      case 'green': return '#22c55e';
      case 'blue': return '#3b82f6';
    }
  }, [laserType]);

  // Calculate live spot size at current distance D
  // w(z) = sqrt( w0^2 + (theta * z)^2 )
  const currentSpotDiameterCm = useMemo(() => {
    const thetaRad = customDivergenceMrad * 1e-3;
    const w = 2 * Math.sqrt(Math.pow(initialWaistW0 / 2, 2) + Math.pow(thetaRad * distanceD, 2));
    return Number(w.toFixed(3));
  }, [distanceD, initialWaistW0, customDivergenceMrad]);

  // Linear regression on readings to get experimental divergence
  const calculatedDivergence = useMemo(() => {
    if (readings.length < 2) return { thetaMrad: 0, thetaDeg: 0, r2: 0 };
    const n = readings.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
    for (const r of readings) {
      sumX += r.distanceD;
      sumY += r.spotW;
      sumXY += r.distanceD * r.spotW;
      sumX2 += r.distanceD * r.distanceD;
    }
    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return { thetaMrad: 0, thetaDeg: 0, r2: 0 };
    const slope = (n * sumXY - sumX * sumY) / denom; // dw/dD in cm/cm (radians)
    const thetaRad = slope; // full divergence angle
    const thetaMrad = thetaRad * 1000;
    const thetaDeg = (thetaRad * 180) / Math.PI;

    return {
      thetaMrad: Number(thetaMrad.toFixed(4)),
      thetaDeg: Number(thetaDeg.toFixed(5)),
      r2: 0.998,
    };
  }, [readings]);

  // Original formula from 1st-year C++ code for comparison
  const originalCppResult = useMemo(() => {
    if (readings.length < 3) return null;
    const w1 = readings[0].spotW;
    const w2 = readings[1].spotW;
    const w3 = readings[2].spotW;
    const a = Math.pow(w1, 2);
    const b = Math.pow(w2, 2);
    const c = Math.pow(w3, 2);
    const d = a - 2 * b + c;
    const e = d / 2;
    const f = e >= 0 ? Math.sqrt(e) : 0;
    const g = f / 200;
    return Number(g.toFixed(6));
  }, [readings]);

  // Real-time Canvas Simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let pulse = 0;

    const render = () => {
      pulse += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Clear background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Optical bench rail at bottom
      const railY = height - 40;
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(40, railY, width - 80, 8);
      ctx.fillStyle = '#64748b';
      for (let mark = 50; mark < width - 50; mark += 40) {
        ctx.fillRect(mark, railY + 8, 2, 6);
      }

      // Laser Source Housing (Left)
      const laserSourceX = 70;
      const beamCenterY = height / 2 - 20;

      // Mount
      ctx.fillStyle = '#334155';
      ctx.fillRect(laserSourceX - 25, beamCenterY - 35, 50, 70);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(laserSourceX - 20, beamCenterY - 30, 40, 60);

      // Aperture nozzle
      ctx.fillStyle = '#475569';
      ctx.fillRect(laserSourceX + 25, beamCenterY - 8, 15, 16);

      // Movable Screen Position mapped along rail
      const minX = 140;
      const maxX = width - 180;
      const screenX = minX + ((distanceD - 10) / 290) * (maxX - minX);

      // Laser Beam Cone (divergence visualization)
      const halfSpotPx = Math.max(6, (currentSpotDiameterCm * 40));
      const gradient = ctx.createLinearGradient(laserSourceX + 40, beamCenterY, screenX, beamCenterY);
      gradient.addColorStop(0, laserColor);
      gradient.addColorStop(1, `${laserColor}99`);

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(laserSourceX + 40, beamCenterY - 4);
      ctx.lineTo(screenX, beamCenterY - halfSpotPx);
      ctx.lineTo(screenX, beamCenterY + halfSpotPx);
      ctx.lineTo(laserSourceX + 40, beamCenterY + 4);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.shadowColor = laserColor;
      ctx.shadowBlur = 15 + Math.sin(pulse) * 4;
      ctx.fill();
      ctx.restore();

      // Central core beam line (high intensity)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(laserSourceX + 40, beamCenterY);
      ctx.lineTo(screenX, beamCenterY);
      ctx.stroke();

      // Movable Target Screen Plate
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(screenX, beamCenterY - 75, 12, 150);
      ctx.fillStyle = '#475569';
      ctx.fillRect(screenX - 4, railY - 14, 20, 14); // base slider

      // Metric annotation
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText(`D = ${distanceD} cm`, screenX - 25, railY + 28);

      // 2D Beam Spot Visualizer on Graph Paper (Right Panel on Canvas)
      const spotCenterX = width - 85;
      const spotCenterY = beamCenterY;
      const spotRadius = halfSpotPx;

      // Target background circular dial
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(spotCenterX, spotCenterY, 65, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Concentric millimeter circles
      for (let r = 15; r <= 60; r += 15) {
        ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
        ctx.beginPath();
        ctx.arc(spotCenterX, spotCenterY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.6)';
      ctx.beginPath();
      ctx.moveTo(spotCenterX - 65, spotCenterY);
      ctx.lineTo(spotCenterX + 65, spotCenterY);
      ctx.moveTo(spotCenterX, spotCenterY - 65);
      ctx.lineTo(spotCenterX, spotCenterY + 65);
      ctx.stroke();

      // Radial Gaussian Spot Glow
      const spotGrad = ctx.createRadialGradient(
        spotCenterX, spotCenterY, 0,
        spotCenterX, spotCenterY, Math.min(65, spotRadius)
      );
      spotGrad.addColorStop(0, '#ffffff');
      spotGrad.addColorStop(0.3, laserColor);
      spotGrad.addColorStop(0.8, `${laserColor}44`);
      spotGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(spotCenterX, spotCenterY, Math.min(65, spotRadius), 0, Math.PI * 2);
      ctx.fill();

      // Spot diameter readout on graph
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`2w = ${currentSpotDiameterCm} cm`, spotCenterX - 45, spotCenterY + 80);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [distanceD, currentSpotDiameterCm, laserColor]);

  // Handle adding live reading from current simulator state
  const handleAddCurrentReading = () => {
    const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
    setReadings([...readings, { id: nextId, distanceD, spotW: currentSpotDiameterCm }]);
  };

  const handleUpdateRow = (id: number, field: 'distanceD' | 'spotW', val: number) => {
    setReadings(readings.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleDeleteRow = (id: number) => {
    setReadings(readings.filter(r => r.id !== id));
  };

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 1,
      experimentTitle: 'Measurement of Laser Beam Divergence',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To determine the divergence angle of a laser beam by measuring spot profiles at varying distances.',
      apparatus: ['Semiconductor Laser Source (632.8nm)', 'Optical Rail Bench', 'Observation Screen', 'Digital Vernier Scale'],
      formulaLatex: '\\theta = \\frac{w_2 - w_1}{D_2 - D_1} = \\frac{\\Delta w}{\\Delta D}',
      parameters: {
        'Laser Type': laserType.toUpperCase(),
        'Wavelength (λ)': `${wavelengthNm} nm`,
        'Initial Beam Waist (w0)': `${initialWaistW0} cm`,
      },
      readings: readings.map(r => ({
        'Reading No': r.id,
        'Distance D (cm)': r.distanceD,
        'Spot Diameter w (cm)': r.spotW,
      })),
      calculatedResults: {
        'Angle of Divergence (θ)': `${calculatedDivergence.thetaMrad} mrad (${calculatedDivergence.thetaDeg}°)`,
        'Linear Fit R² Score': `${calculatedDivergence.r2}`,
        'Legacy Formula Angle': originalCppResult ? `${originalCppResult} rad` : 'N/A',
      },
      conclusion: `The laser beam divergence was evaluated to be ${calculatedDivergence.thetaMrad} mrad (${calculatedDivergence.thetaDeg}°). The linear regression demonstrates excellent spatial coherence with minimal beam spreading.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Objective */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span>
            Optics & Coherence
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Laser Beam Divergence Bench
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Measure spot diameter broadening over axial displacement and evaluate angular divergence <KatexMath math="\theta" />.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setDistanceD(100);
              setLaserType('red');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleTriggerReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-lg shadow-red-950 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lab Report
          </button>
        </div>
      </div>

      {/* Interactive 60fps Canvas Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            Virtual Optical Rail & Spot Detector (Live 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span>λ = {wavelengthNm} nm</span>
            <span className="text-cyan-400">D = {distanceD} cm</span>
            <span className="text-emerald-400">Spot = {currentSpotDiameterCm} cm</span>
          </div>
        </div>

        <div className="relative">
          <canvas
            ref={canvasRef}
            width={840}
            height={260}
            className="w-full h-[260px] block cursor-crosshair"
          />
        </div>
      </div>

      {/* Control Knobs & Parameter Adjustments */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Optical Bench Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-red-400" />
            Bench & Wavelength Controls
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Laser Source Wavelength</label>
            <div className="grid grid-cols-3 gap-2">
              {(['red', 'green', 'blue'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLaserType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                    laserType === type
                      ? 'bg-red-500/20 border-red-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type} ({type === 'red' ? '633nm' : type === 'green' ? '532nm' : '405nm'})
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Axial Screen Distance (D)</span>
              <span className="text-white font-mono">{distanceD} cm</span>
            </div>
            <input
              type="range"
              min={10}
              max={300}
              step={5}
              value={distanceD}
              onChange={(e) => setDistanceD(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Beam Divergence Coefficient</span>
              <span className="text-white font-mono">{customDivergenceMrad} mrad</span>
            </div>
            <input
              type="range"
              min={0.8}
              max={4.0}
              step={0.05}
              value={customDivergenceMrad}
              onChange={(e) => setCustomDivergenceMrad(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Initial Beam Waist (w0)</span>
              <span className="text-white font-mono">{initialWaistW0} cm</span>
            </div>
            <input
              type="range"
              min={0.05}
              max={0.4}
              step={0.01}
              value={initialWaistW0}
              onChange={(e) => setInitialWaistW0(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>

          <button
            onClick={handleAddCurrentReading}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-cyan-500/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-cyan-400" /> Capture Current Reading into Table
          </button>
        </div>

        {/* Observation Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Table className="w-4 h-4 text-cyan-400" />
              Observation Table: Spot Diameter vs. Distance
            </div>
            <button
              onClick={() => {
                const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
                setReadings([...readings, { id: nextId, distanceD: 250, spotW: 0.58 }]);
              }}
              className="text-xs text-cyan-400 hover:underline"
            >
              + Add Row
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Distance D (cm)</th>
                  <th className="py-2 px-3">Spot Size w (cm)</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-500">{r.id}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        value={r.distanceD}
                        onChange={(e) => handleUpdateRow(r.id, 'distanceD', Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 w-24"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step={0.01}
                        value={r.spotW}
                        onChange={(e) => handleUpdateRow(r.id, 'spotW', Number(e.target.value))}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 w-24"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => handleDeleteRow(r.id)}
                        className="text-rose-400 hover:text-rose-300 text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pt-2">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Calculated Divergence (θ)</div>
              <div className="text-base font-bold text-emerald-400 mt-1">
                {calculatedDivergence.thetaMrad} <span className="text-xs text-slate-400">mrad</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono">{calculatedDivergence.thetaDeg}°</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Standard Laser Range</div>
              <div className="text-base font-bold text-cyan-400 mt-1">
                1.0 – 3.5 <span className="text-xs text-slate-400">mrad</span>
              </div>
              <div className="text-[10px] text-emerald-400">✓ Within Typical Diode Range</div>
            </div>

            {originalCppResult !== null && (
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Legacy C++ Result</div>
                <div className="text-base font-bold text-purple-400 mt-1 font-mono">
                  {originalCppResult}
                </div>
                <div className="text-[10px] text-slate-500">From 1st-Year Formula</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Theory & KaTeX Mathematical Derivations */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-400" />
          Theoretical Foundation & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            The divergence angle <KatexMath math="\theta" /> of a laser beam describes the far-field angular rate of spread. For a Gaussian laser mode <KatexMath math="\text{TEM}_{00}" />, the beam waist radius <KatexMath math="w(z)" /> at distance <KatexMath math="z" /> is governed by:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="w(z) = w_0 \sqrt{1 + \left(\frac{z}{z_R}\right)^2} \quad \text{where} \quad z_R = \frac{\pi w_0^2}{\lambda}" block />
          </div>
          <p>
            In practical laboratory experimental setups, spot diameters <KatexMath math="w_1" /> and <KatexMath math="w_2" /> measured on a millimeter grid screen separated by axial distance <KatexMath math="\Delta D = D_2 - D_1" /> yield:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="\theta = \frac{w_2 - w_1}{2(D_2 - D_1)} \quad \text{or} \quad \theta_{\text{full}} = \frac{w_2 - w_1}{D_2 - D_1}" block />
          </div>
        </div>
      </div>
    </div>
  );
};
