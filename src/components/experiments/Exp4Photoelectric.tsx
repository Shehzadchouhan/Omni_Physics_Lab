import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Atom, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';
import { PHYSICAL_CONSTANTS } from '../../lib/constants';
import { calculateLinearRegression } from '../../lib/math/statistics';

interface Exp4Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface PhotoelectricReading {
  id: number;
  filterColor: string;
  wavelengthNm: number;
  frequencyTHz: number; // 10^12 Hz (or 10^14 Hz)
  stoppingPotentialV: number;
}

const CATHODE_MATERIALS = [
  { name: 'Cesium (Cs)', workFunctionEv: 1.95, thresholdFreqTHz: 471 },
  { name: 'Potassium (K)', workFunctionEv: 2.29, thresholdFreqTHz: 554 },
  { name: 'Sodium (Na)', workFunctionEv: 2.36, thresholdFreqTHz: 571 },
  { name: 'Zinc (Zn)', workFunctionEv: 4.31, thresholdFreqTHz: 1042 },
];

export const Exp4Photoelectric: React.FC<Exp4Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Metal cathode selection
  const [selectedMetalIndex, setSelectedMetalIndex] = useState<number>(0);
  const activeMetal = CATHODE_MATERIALS[selectedMetalIndex];

  // Live apparatus controls
  const [currentWavelengthNm, setCurrentWavelengthNm] = useState<number>(450); // 350 to 650 nm
  const [retardingVoltage, setRetardingVoltage] = useState<number>(0.8);       // 0 to 3 V
  const [lightIntensity, setLightIntensity] = useState<number>(80);           // 10 to 100%

  // Observation table points
  const [readings, setReadings] = useState<PhotoelectricReading[]>([
    { id: 1, filterColor: 'Violet', wavelengthNm: 405, frequencyTHz: 740.7, stoppingPotentialV: 1.11 },
    { id: 2, filterColor: 'Blue', wavelengthNm: 436, frequencyTHz: 688.1, stoppingPotentialV: 0.89 },
    { id: 3, filterColor: 'Cyan', wavelengthNm: 492, frequencyTHz: 609.8, stoppingPotentialV: 0.57 },
    { id: 4, filterColor: 'Green', wavelengthNm: 546, frequencyTHz: 549.5, stoppingPotentialV: 0.32 },
    { id: 5, filterColor: 'Yellow', wavelengthNm: 577, frequencyTHz: 520.0, stoppingPotentialV: 0.20 },
  ]);

  // Photon frequency of current slider
  const currentFrequencyHz = useMemo(() => {
    return PHYSICAL_CONSTANTS.c / (currentWavelengthNm * 1e-9);
  }, [currentWavelengthNm]);

  // Theoretical stopping potential at current frequency
  // V0 = (h/e)*nu - Phi
  const exactStoppingPotential = useMemo(() => {
    const photonEnergyEv = (PHYSICAL_CONSTANTS.h * currentFrequencyHz) / PHYSICAL_CONSTANTS.e;
    const v0 = Math.max(0, photonEnergyEv - activeMetal.workFunctionEv);
    return Number(v0.toFixed(2));
  }, [currentFrequencyHz, activeMetal]);

  // Linear Regression on Readings (Stopping potential V0 vs Frequency nu)
  const regressionResults = useMemo(() => {
    // x = nu in Hz, y = V0 in Volts
    const points = readings.map((r) => ({
      x: r.frequencyTHz * 1e12,
      y: r.stoppingPotentialV,
    }));

    const reg = calculateLinearRegression(points);
    if (!reg) return null;

    // Slope m = h / e => h = m * e
    const experimentalH = reg.slope * PHYSICAL_CONSTANTS.e;
    // Y-intercept c = -Phi / e => Phi = -c (in eV)
    const experimentalWorkFunctionEv = -reg.intercept;

    // Discrepancy against accepted Planck Constant
    const errorPctH = Math.abs((experimentalH - PHYSICAL_CONSTANTS.h) / PHYSICAL_CONSTANTS.h) * 100;

    return {
      slope: reg.slope,
      intercept: reg.intercept,
      r2: Number(reg.r2.toFixed(4)),
      experimentalH,
      experimentalWorkFunctionEv: Number(experimentalWorkFunctionEv.toFixed(2)),
      errorPctH: Number(errorPctH.toFixed(2)),
    };
  }, [readings]);

  // Apparatus Simulation (Phototube vacuum chamber with photon/electron emission)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const render = () => {
      frame += 1;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Vacuum Glass Tube Outline
      const tubeX = 60;
      const tubeY = 30;
      const tubeW = width - 120;
      const tubeH = height - 60;

      ctx.strokeStyle = '#38bdf844';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(tubeX, tubeY, tubeW, tubeH, 30);
      ctx.stroke();

      // Glass highlight reflections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tubeX + 30, tubeY + 12);
      ctx.lineTo(tubeX + tubeW - 30, tubeY + 12);
      ctx.stroke();

      // Cathode Plate (Left)
      const cathodeX = tubeX + 50;
      const plateH = tubeH - 60;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(cathodeX, tubeY + 30, 14, plateH);
      ctx.fillStyle = '#f87171';
      ctx.font = 'bold 10px monospace';
      ctx.fillText('Cathode (-)', cathodeX - 20, tubeY + 22);

      // Anode Ring/Plate (Right)
      const anodeX = tubeX + tubeW - 70;
      ctx.fillStyle = '#64748b';
      ctx.fillRect(anodeX, tubeY + 30, 10, plateH);
      ctx.fillStyle = '#60a5fa';
      ctx.fillText('Anode (+)', anodeX - 10, tubeY + 22);

      // Light beam photons striking cathode
      const wavelengthColor = `hsl(${Math.max(200, 380 - (currentWavelengthNm - 380) * 0.7)}, 90%, 55%)`;
      ctx.strokeStyle = wavelengthColor;
      ctx.lineWidth = 2;

      const numPhotons = Math.floor(lightIntensity / 18);
      for (let i = 0; i < numPhotons; i++) {
        const offset = ((frame * 3 + i * 40) % (cathodeX - 20));
        const py = tubeY + 45 + (i * 24);
        ctx.beginPath();
        ctx.moveTo(offset, py - 5);
        ctx.lineTo(offset + 15, py);
        ctx.lineTo(offset + 30, py - 5);
        ctx.stroke();
      }

      // Emitted Photoelectrons
      const isEmitting = currentFrequencyHz > (activeMetal.thresholdFreqTHz * 1e12);
      if (isEmitting) {
        ctx.fillStyle = '#38bdf8';
        const kineticEnergy = Math.max(0, exactStoppingPotential - retardingVoltage);
        const speed = kineticEnergy * 2.5;

        for (let i = 0; i < 16; i++) {
          const t = (frame * speed + i * 35) % (anodeX - cathodeX);
          const ex = cathodeX + 16 + t;
          const ey = tubeY + 40 + ((i * 19) % (plateH - 20));

          // Retarding field pushes them back if voltage exceeds stopping potential
          if (retardingVoltage >= exactStoppingPotential && ex > cathodeX + 40) {
            continue; // turned around by repulsive anode
          }

          ctx.beginPath();
          ctx.arc(ex, ey, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Photocurrent meter readout on bottom
      const currentMicroAmps = retardingVoltage >= exactStoppingPotential
        ? 0
        : Number(((exactStoppingPotential - retardingVoltage) * (lightIntensity / 10)).toFixed(2));

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(width / 2 - 90, height - 42, 180, 32);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(width / 2 - 90, height - 42, 180, 32);

      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = currentMicroAmps === 0 ? '#ef4444' : '#4ade80';
      ctx.fillText(`Photocurrent: ${currentMicroAmps} µA`, width / 2 - 75, height - 22);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentWavelengthNm, retardingVoltage, lightIntensity, exactStoppingPotential, activeMetal, currentFrequencyHz]);

  // Graph Canvas (Stopping Potential vs Frequency Regression Line)
  useEffect(() => {
    const canvas = graphCanvasRef.current;
    if (!canvas || !regressionResults) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const padL = 50;
    const padB = 40;
    const padR = 25;
    const padT = 25;
    const plotW = width - padL - padR;
    const plotH = height - padT - padB;

    // Coordinate ranges: freq 450 to 800 THz, V0 from 0 to 1.8 V
    const minX = 450;
    const maxX = 820;
    const minY = 0;
    const maxY = 1.6;

    const mapX = (xTHz: number) => padL + ((xTHz - minX) / (maxX - minX)) * plotW;
    const mapY = (yV: number) => height - padB - ((yV - minY) / (maxY - minY)) * plotH;

    // Axes
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, height - padB);
    ctx.lineTo(width - padR, height - padB);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    ctx.fillText('Frequency ν (THz)', width / 2 - 30, height - 12);
    ctx.fillText('V0 (V)', 10, padT + 5);

    // Ticks
    for (let f = 500; f <= 800; f += 100) {
      const px = mapX(f);
      ctx.fillText(`${f}`, px - 10, height - padB + 16);
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(px, padT);
      ctx.lineTo(px, height - padB);
      ctx.stroke();
    }

    for (let v = 0.4; v <= 1.4; v += 0.4) {
      const py = mapY(v);
      ctx.fillText(`${v.toFixed(1)}`, padL - 28, py + 4);
      ctx.strokeStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(padL, py);
      ctx.lineTo(width - padR, py);
      ctx.stroke();
    }

    // Regression Line
    const x1 = minX;
    const y1 = (regressionResults.slope * (x1 * 1e12) + regressionResults.intercept);
    const x2 = maxX;
    const y2 = (regressionResults.slope * (x2 * 1e12) + regressionResults.intercept);

    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mapX(x1), mapY(y1));
    ctx.lineTo(mapX(x2), mapY(y2));
    ctx.stroke();

    // Data Points
    readings.forEach((r) => {
      const px = mapX(r.frequencyTHz);
      const py = mapY(r.stoppingPotentialV);

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
  }, [readings, regressionResults]);

  const handleTriggerReport = () => {
    if (!regressionResults) return;
    onGenerateReport({
      experimentId: 4,
      experimentTitle: "Determination of Planck's Constant & Work Function",
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: "To determine Planck's constant (h) and the work function of photosensitive metals using the photoelectric effect and stopping potential linear regression.",
      apparatus: ['Vacuum Phototube Apparatus', 'Variable Monochromatic Light Source', 'Regulated DC Power Unit', 'Picoammeter & Voltmeter'],
      formulaLatex: 'V_0 = \\left(\\frac{h}{e}\\right) \\nu - \\frac{\\Phi}{e} \\implies h = e \\cdot (\\text{Slope}), \\quad \\Phi = e \\cdot |\\text{Intercept}|',
      parameters: {
        'Cathode Material': activeMetal.name,
        'Theoretical Work Function': `${activeMetal.workFunctionEv} eV`,
        'NIST Standard h': '6.62607 × 10^-34 J·s',
      },
      readings: readings.map(r => ({
        'Spectral Line': r.filterColor,
        'Wavelength (nm)': r.wavelengthNm,
        'Frequency (THz)': r.frequencyTHz,
        'Stopping Potential V0 (V)': r.stoppingPotentialV,
      })),
      calculatedResults: {
        'Linear Regression Slope': `${regressionResults.slope.toExponential(4)} V·s`,
        "Calculated Planck's Constant (h)": `${regressionResults.experimentalH.toExponential(4)} J·s`,
        'Evaluated Work Function (Φ)': `${regressionResults.experimentalWorkFunctionEv} eV`,
        'Regression Fit Score (R²)': `${regressionResults.r2}`,
        'Discrepancy Error (% vs NIST)': `${regressionResults.errorPctH}%`,
      },
      conclusion: `Planck's constant was experimentally determined to be h = ${regressionResults.experimentalH.toExponential(4)} J·s (${regressionResults.errorPctH}% discrepancy relative to NIST standard) with an R² confidence of ${regressionResults.r2}. The work function of ${activeMetal.name} was found to be ${regressionResults.experimentalWorkFunctionEv} eV.`,
    });
  };

  return (
    <div className="relative isolate space-y-6">
      <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-1 z-10 h-24 w-24 text-cyan-500 opacity-[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="5" />
        <ellipse cx="50" cy="50" rx="34" ry="13" /><ellipse cx="50" cy="50" rx="34" ry="13" transform="rotate(60 50 50)" />
        <circle cx="82" cy="50" r="3" /><circle cx="34" cy="22" r="3" /><circle cx="34" cy="78" r="3" />
        <path d="M8 50h15m-5-5 5 5-5 5" />
      </svg>
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Quantum Mechanics & Modern Physics
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Photoelectric Effect & Planck Constant Bench
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Simulate photon-electron emission and compute <KatexMath math="h = e \cdot \frac{dV_0}{d\nu}" /> via Ordinary Least Squares linear regression.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCurrentWavelengthNm(450);
              setRetardingVoltage(0.8);
              setSelectedMetalIndex(0);
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

      {/* Visual Phototube Simulator */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Atom className="w-3.5 h-3.5 text-cyan-700" />
            Vacuum Phototube Chamber & Photoelectron Dynamics (Live 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="text-cyan-700">λ = {currentWavelengthNm} nm</span>
            <span className="text-emerald-700">Stopping V0 = {exactStoppingPotential} V</span>
            <span className="text-amber-700">Cathode = {activeMetal.name}</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={840}
          height={240}
          className="w-full h-[240px] block"
        />
      </div>

      {/* Controls & Graph */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Phototube Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sliders className="w-4 h-4 text-cyan-700" />
            Source & Voltage Adjustments
          </div>

          <div>
            <label className="text-xs text-slate-600 mb-1.5 block">Photosensitive Cathode</label>
            <div className="grid grid-cols-2 gap-2">
              {CATHODE_MATERIALS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setSelectedMetalIndex(idx)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    selectedMetalIndex === idx
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-800 font-medium'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-[10px] text-slate-600">Φ = {m.workFunctionEv} eV</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Light Wavelength (λ)</span>
              <span className="text-slate-900 font-mono">{currentWavelengthNm} nm</span>
            </div>
            <input
              type="range"
              min={350}
              max={650}
              step={5}
              value={currentWavelengthNm}
              onChange={(e) => setCurrentWavelengthNm(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Retarding Anode Voltage</span>
              <span className="text-slate-900 font-mono">{retardingVoltage.toFixed(2)} V</span>
            </div>
            <input
              type="range"
              min={0}
              max={2.5}
              step={0.05}
              value={retardingVoltage}
              onChange={(e) => setRetardingVoltage(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Light Intensity</span>
              <span className="text-slate-900 font-mono">{lightIntensity}%</span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={lightIntensity}
              onChange={(e) => setLightIntensity(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <button
            onClick={() => {
              const freqTHz = Number((currentFrequencyHz * 1e-12).toFixed(1));
              const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
              setReadings([...readings, {
                id: nextId,
                filterColor: `${currentWavelengthNm}nm`,
                wavelengthNm: currentWavelengthNm,
                frequencyTHz: freqTHz,
                stoppingPotentialV: exactStoppingPotential,
              }]);
            }}
            className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-cyan-700 text-xs font-semibold border border-cyan-300/20 transition-colors"
          >
            + Record Current Point on Graph
          </button>
        </div>

        {/* Dynamic Linear Regression Graph Canvas */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-2 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Table className="w-4 h-4 text-cyan-700" />
              Stopping Potential vs. Frequency Linear Fit Graph
            </div>
            {regressionResults && (
              <span className="text-xs text-emerald-700 font-mono">
                R² = {regressionResults.r2}
              </span>
            )}
          </div>

          <canvas
            ref={graphCanvasRef}
            width={520}
            height={210}
            className="w-full h-[210px] block rounded-xl border border-slate-200"
          />

          {/* Results Metric Badges */}
          {regressionResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600">Evaluated h</div>
                <div className="text-sm font-bold text-emerald-700 mt-1 font-mono truncate">
                  {regressionResults.experimentalH.toExponential(3)}
                </div>
                <div className="text-[10px] text-slate-600">J · s</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600">Work Function Φ</div>
                <div className="text-sm font-bold text-cyan-700 mt-1 font-mono">
                  {regressionResults.experimentalWorkFunctionEv} eV
                </div>
                <div className="text-[10px] text-slate-600">From Y-Intercept</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600">Standard NIST h</div>
                <div className="text-sm font-bold text-purple-700 mt-1 font-mono">
                  6.626 × 10^-34
                </div>
                <div className="text-[10px] text-slate-600">CODATA Value</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="text-[11px] text-slate-600">Error Margin</div>
                <div className="text-sm font-bold text-amber-700 mt-1 font-mono">
                  {regressionResults.errorPctH}%
                </div>
                <div className="text-[10px] text-emerald-700">✓ High Precision</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-700" />
          Einstein's Photoelectric Equation & Regression
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            When light of frequency <KatexMath math="\nu" /> strikes a photosensitive metal surface of work function <KatexMath math="\Phi" />, electrons are ejected with maximum kinetic energy <KatexMath math="K_{\max} = e V_0" />:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="h\nu = \Phi + e V_0 \implies V_0 = \left(\frac{h}{e}\right)\nu - \frac{\Phi}{e}" block />
          </div>
          <p>
            Plotting stopping potential <KatexMath math="V_0" /> on the y-axis against frequency <KatexMath math="\nu" /> on the x-axis yields a straight line whose slope <KatexMath math="m = \frac{h}{e}" /> directly allows calculating Planck's constant <KatexMath math="h = m \cdot e" />.
          </p>
        </div>
      </div>
    </div>
  );
};
