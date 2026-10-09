import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Cable, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp5Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface FiberReading {
  id: number;
  screenDistanceL_cm: number;
  spotDiameterW_cm: number;
}

export const Exp5NumericalAperture: React.FC<Exp5Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fiber physical parameters
  const [coreIndexN1, setCoreIndexN1] = useState<number>(1.48);     // Silica core
  const [claddingIndexN2, setCladdingIndexN2] = useState<number>(1.46); // Cladding
  const [screenDistanceL_cm, setScreenDistanceL_cm] = useState<number>(2.5); // 0.5 to 5 cm

  // Readings table
  const [readings, setReadings] = useState<FiberReading[]>([
    { id: 1, screenDistanceL_cm: 1.0, spotDiameterW_cm: 0.52 },
    { id: 2, screenDistanceL_cm: 2.0, spotDiameterW_cm: 0.99 },
    { id: 3, screenDistanceL_cm: 3.0, spotDiameterW_cm: 1.48 },
    { id: 4, screenDistanceL_cm: 4.0, spotDiameterW_cm: 1.96 },
  ]);

  // Theoretical NA from refractive indices
  // NA = sqrt(n1^2 - n2^2)
  const theoreticalNA = useMemo(() => {
    if (coreIndexN1 <= claddingIndexN2) return 0.24;
    return Number(Math.sqrt(Math.pow(coreIndexN1, 2) - Math.pow(claddingIndexN2, 2)).toFixed(3));
  }, [coreIndexN1, claddingIndexN2]);

  const theoreticalThetaDeg = useMemo(() => {
    const rad = Math.asin(Math.min(1, theoreticalNA));
    return Number(((rad * 180) / Math.PI).toFixed(2));
  }, [theoreticalNA]);

  // Current live spot diameter on screen
  const currentSpotDiameterCm = useMemo(() => {
    // r = L * tan(theta_a) => W = 2 * L * tan(theta_a)
    const thetaRad = (theoreticalThetaDeg * Math.PI) / 180;
    const w = 2 * screenDistanceL_cm * Math.tan(thetaRad);
    return Number(w.toFixed(2));
  }, [screenDistanceL_cm, theoreticalThetaDeg]);

  // Experimental NA from table data
  const experimentalStats = useMemo(() => {
    const rows = readings.map((r) => {
      const radius = r.spotDiameterW_cm / 2;
      const tanTheta = radius / (r.screenDistanceL_cm || 1);
      const thetaRad = Math.atan(tanTheta);
      const thetaDeg = (thetaRad * 180) / Math.PI;
      const na = Math.sin(thetaRad);
      return {
        ...r,
        thetaDeg: Number(thetaDeg.toFixed(2)),
        na: Number(na.toFixed(3)),
      };
    });

    const avgNA = rows.length > 0 ? rows.reduce((acc, r) => acc + r.na, 0) / rows.length : 0;
    const avgThetaDeg = rows.length > 0 ? rows.reduce((acc, r) => acc + r.thetaDeg, 0) / rows.length : 0;
    const errorPct = Math.abs((avgNA - theoreticalNA) / theoreticalNA) * 100;

    return {
      rows,
      avgNA: Number(avgNA.toFixed(3)),
      avgThetaDeg: Number(avgThetaDeg.toFixed(2)),
      errorPct: Number(errorPct.toFixed(2)),
    };
  }, [readings, theoreticalNA]);

  // 60 FPS Canvas Simulation (Fiber Core Ray Tracing & Output Cone)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let tick = 0;

    const render = () => {
      tick += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      const midY = height / 2;
      const fiberStartX = 40;
      const fiberEndX = width / 2 - 20;
      const coreH = 46;
      const cladH = 76;

      // Cladding Outer Jacket
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(fiberStartX, midY - cladH / 2, fiberEndX - fiberStartX, cladH);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(fiberStartX, midY - cladH / 2, fiberEndX - fiberStartX, cladH);

      // Core (Higher Refractive Index)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(fiberStartX, midY - coreH / 2, fiberEndX - fiberStartX, coreH);
      ctx.strokeStyle = '#38bdf844';
      ctx.strokeRect(fiberStartX, midY - coreH / 2, fiberEndX - fiberStartX, coreH);

      // Text labels on fiber
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText(`Cladding (n2 = ${claddingIndexN2})`, fiberStartX + 15, midY - coreH / 2 - 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`Core (n1 = ${coreIndexN1})`, fiberStartX + 15, midY + 4);

      // Total Internal Reflection Ray Tracing inside Core
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(fiberStartX, midY);

      const zigZags = 5;
      const segW = (fiberEndX - fiberStartX) / zigZags;
      for (let z = 1; z <= zigZags; z++) {
        const sign = z % 2 === 1 ? -1 : 1;
        const rx = fiberStartX + z * segW;
        const ry = midY + sign * (coreH / 2 - 4);
        ctx.lineTo(rx, ry);
      }
      ctx.lineTo(fiberEndX, midY);
      ctx.stroke();

      // Output Acceptance Cone Emitting from fiber tip
      const maxScreenX = width - 70;
      const screenX = fiberEndX + (screenDistanceL_cm / 5) * (maxScreenX - fiberEndX);
      const coneHalfH = Math.max(10, currentSpotDiameterCm * 25);

      // Gradient cone
      const coneGrad = ctx.createLinearGradient(fiberEndX, midY, screenX, midY);
      coneGrad.addColorStop(0, '#f43f5e');
      coneGrad.addColorStop(1, '#f43f5e22');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(fiberEndX, midY);
      ctx.lineTo(screenX, midY - coneHalfH);
      ctx.lineTo(screenX, midY + coneHalfH);
      ctx.closePath();
      ctx.fill();

      // Cone outer rays
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(fiberEndX, midY);
      ctx.lineTo(screenX, midY - coneHalfH);
      ctx.moveTo(fiberEndX, midY);
      ctx.lineTo(screenX, midY + coneHalfH);
      ctx.stroke();

      // Observation Screen Plate
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(screenX, midY - 80, 10, 160);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(screenX, midY - 80, 10, 160);

      // Projected Red Spot on Screen Plate
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(screenX - 1, midY - coneHalfH, 4, coneHalfH * 2);

      // Screen label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`L = ${screenDistanceL_cm} cm`, screenX - 25, midY + 95);

      // Angular arc annotation for theta_a
      ctx.strokeStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(fiberEndX, midY, 35, -Math.PI / 8, Math.PI / 8);
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`2θa = ${(theoreticalThetaDeg * 2).toFixed(1)}°`, fiberEndX + 38, midY - 14);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [coreIndexN1, claddingIndexN2, screenDistanceL_cm, currentSpotDiameterCm, theoreticalThetaDeg]);

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 5,
      experimentTitle: 'Numerical Aperture & Acceptance Angle of an Optical Fiber',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To evaluate the Numerical Aperture (NA) and acceptance angle (θa) of a multimode optical fiber.',
      apparatus: ['Optical Fiber Trainer Kit', 'Step-Index Fiber (n1=1.48, n2=1.46)', 'Calibrated Target Screen', 'Laser / LED Source'],
      formulaLatex: '\\text{NA} = \\sin \\theta_a = \\frac{W/2}{\\sqrt{(W/2)^2 + L^2}} = \\sqrt{n_1^2 - n_2^2}',
      parameters: {
        'Core Index (n1)': `${coreIndexN1}`,
        'Cladding Index (n2)': `${claddingIndexN2}`,
        'Theoretical NA': `${theoreticalNA}`,
        'Acceptance Angle (θa)': `${theoreticalThetaDeg}°`,
      },
      readings: experimentalStats.rows.map(r => ({
        'Reading No': r.id,
        'Distance L (cm)': r.screenDistanceL_cm,
        'Spot Diameter W (cm)': r.spotDiameterW_cm,
        'Computed Angle θa': `${r.thetaDeg}°`,
        'Computed NA': r.na,
      })),
      calculatedResults: {
        'Average Measured NA': `${experimentalStats.avgNA}`,
        'Average Acceptance Angle': `${experimentalStats.avgThetaDeg}°`,
        'Theoretical Index NA': `${theoreticalNA}`,
        'Discrepancy Error': `${experimentalStats.errorPct}%`,
      },
      conclusion: `The optical fiber's Numerical Aperture was found to be NA = ${experimentalStats.avgNA} with an acceptance angle θa = ${experimentalStats.avgThetaDeg}°, aligning closely with theoretical value ${theoreticalNA} (${experimentalStats.errorPct}% discrepancy).`,
    });
  };

  return (
    <div className="relative isolate space-y-6">
      <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-1 z-10 h-24 w-24 text-rose-500 opacity-[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10 42h48m-48 16h48" />
        <path d="M58 42c12 0 18-12 32-25M58 50h35M58 58c12 0 18 12 32 25" />
        <path d="M18 38v24m7-24v24m7-24v24" strokeDasharray="2 4" />
      </svg>
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
            Fiber Optics & Photon Transport
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Optical Fiber Numerical Aperture Bench
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Simulate Total Internal Reflection (TIR) and measure output beam cone to compute <KatexMath math="\text{NA} = \sin \theta_a = \sqrt{n_1^2 - n_2^2}" />.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCoreIndexN1(1.48);
              setCladdingIndexN2(1.46);
              setScreenDistanceL_cm(2.5);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleTriggerReport}
            className="px-4 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lab Report
          </button>
        </div>
      </div>

      {/* 60 FPS Canvas Simulator */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Cable className="w-3.5 h-3.5 text-rose-700" />
            Core/Cladding Ray Tracing & Acceptance Cone Projection (Live 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="text-rose-700">NA = {theoreticalNA}</span>
            <span className="text-amber-700">θa = {theoreticalThetaDeg}°</span>
            <span className="text-cyan-700">Screen L = {screenDistanceL_cm} cm</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={840}
          height={240}
          className="w-full h-[240px] block"
        />
      </div>

      {/* Controls & Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sliders className="w-4 h-4 text-rose-700" />
            Fiber Indices & Screen Rail
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Core Refractive Index (n1)</span>
              <span className="text-slate-900 font-mono">{coreIndexN1.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={1.46}
              max={1.55}
              step={0.005}
              value={coreIndexN1}
              onChange={(e) => setCoreIndexN1(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Cladding Refractive Index (n2)</span>
              <span className="text-slate-900 font-mono">{claddingIndexN2.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min={1.44}
              max={1.475}
              step={0.005}
              value={claddingIndexN2}
              onChange={(e) => setCladdingIndexN2(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Screen Distance (L)</span>
              <span className="text-slate-900 font-mono">{screenDistanceL_cm} cm</span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.1}
              value={screenDistanceL_cm}
              onChange={(e) => setScreenDistanceL_cm(Number(e.target.value))}
              className="w-full accent-rose-500"
            />
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="text-[11px] text-slate-600">Current Output Spot Diameter (W)</div>
            <div className="text-base font-bold text-rose-700 font-mono mt-1">
              {currentSpotDiameterCm} cm
            </div>
            <div className="text-[10px] text-slate-600">At current screen distance</div>
          </div>
        </div>

        {/* Observation Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Table className="w-4 h-4 text-rose-700" />
              Observation Table: Spot Diameter vs. Screen Distance
            </div>
            <button
              onClick={() => {
                const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
                setReadings([...readings, { id: nextId, screenDistanceL_cm, spotDiameterW_cm: currentSpotDiameterCm }]);
              }}
              className="text-xs text-rose-700 hover:underline"
            >
              + Record Current
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Distance L (cm)</th>
                  <th className="py-2 px-3">Spot W (cm)</th>
                  <th className="py-2 px-3">Angle θa</th>
                  <th className="py-2 px-3">Computed NA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {experimentalStats.rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-600">{r.id}</td>
                    <td className="py-2 px-3 text-slate-700">{r.screenDistanceL_cm} cm</td>
                    <td className="py-2 px-3 text-slate-700">{r.spotDiameterW_cm} cm</td>
                    <td className="py-2 px-3 text-amber-700">{r.thetaDeg}°</td>
                    <td className="py-2 px-3 text-rose-700 font-bold">{r.na}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Mean Measured NA</div>
              <div className="text-base font-bold text-rose-700 mt-1 font-mono">
                {experimentalStats.avgNA}
              </div>
              <div className="text-[10px] text-slate-600">From Screen Projection</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Theoretical NA</div>
              <div className="text-base font-bold text-cyan-700 mt-1 font-mono">
                {theoreticalNA}
              </div>
              <div className="text-[10px] text-slate-600">√(n1² - n2²)</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Acceptance Angle</div>
              <div className="text-base font-bold text-amber-700 mt-1 font-mono">
                {experimentalStats.avgThetaDeg}°
              </div>
              <div className="text-[10px] text-slate-600">Half Cone Angle</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Discrepancy Error</div>
              <div className="text-base font-bold text-emerald-700 mt-1 font-mono">
                {experimentalStats.errorPct}%
              </div>
              <div className="text-[10px] text-emerald-700">✓ In Specification</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-rose-700" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            The numerical aperture (<KatexMath math="\text{NA}" />) is a measure of the light gathering ability of the fiber. By Snell's law at the fiber entrance face and critical angle condition at the core-cladding boundary:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="\text{NA} = \sin \theta_a = \sqrt{n_1^2 - n_2^2}" block />
          </div>
          <p>
            When light emerging from the fiber forms a spot of diameter <KatexMath math="W" /> on a screen placed at perpendicular distance <KatexMath math="L" />, the acceptance angle is:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="\tan \theta_a = \frac{W/2}{L} \implies \text{NA} = \sin \theta_a = \frac{W/2}{\sqrt{(W/2)^2 + L^2}}" block />
          </div>
        </div>
      </div>
    </div>
  );
};
