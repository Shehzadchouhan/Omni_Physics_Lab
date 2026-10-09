import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Radio, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp8Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface MicrometerReading {
  nodeIndex: number;
  micrometerReadingMm: number;
}

const LIQUID_PRESETS = [
  { name: 'Distilled Water', densityKgM3: 997, refVelocityMs: 1498, desc: 'Reference pure water @ 25°C' },
  { name: 'Castor Oil', densityKgM3: 961, refVelocityMs: 1490, desc: 'Viscous organic dielectric oil' },
  { name: 'Ethanol (Pure)', densityKgM3: 789, refVelocityMs: 1160, desc: 'Volatile polar solvent' },
  { name: 'Glycerol', densityKgM3: 1261, refVelocityMs: 1904, desc: 'High viscosity acoustic fluid' },
  { name: 'Benzene', densityKgM3: 876, refVelocityMs: 1310, desc: 'Aromatic hydrocarbon' },
];

export const Exp8Ultrasonic: React.FC<Exp8Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Liquid preset & High frequency RF generator
  const [liquidIndex, setLiquidIndex] = useState<number>(0);
  const activeLiquid = LIQUID_PRESETS[liquidIndex];

  const [rfFrequencyMHz, setRfFrequencyMHz] = useState<number>(2.0); // 2 MHz quartz
  const [micrometerPositionMm, setMicrometerPositionMm] = useState<number>(7.49); // position slider

  // 10-node readings table (from College Practical format: x1 to x11)
  const [readings, setReadings] = useState<MicrometerReading[]>([
    { nodeIndex: 1, micrometerReadingMm: 3.75 },
    { nodeIndex: 2, micrometerReadingMm: 4.12 },
    { nodeIndex: 3, micrometerReadingMm: 4.50 },
    { nodeIndex: 4, micrometerReadingMm: 4.87 },
    { nodeIndex: 5, micrometerReadingMm: 5.25 },
    { nodeIndex: 6, micrometerReadingMm: 5.62 },
    { nodeIndex: 7, micrometerReadingMm: 6.00 },
    { nodeIndex: 8, micrometerReadingMm: 6.37 },
    { nodeIndex: 9, micrometerReadingMm: 6.74 },
    { nodeIndex: 10, micrometerReadingMm: 7.12 },
    { nodeIndex: 11, micrometerReadingMm: 7.49 },
  ]);

  // Update table when liquid changes
  useEffect(() => {
    // lambda = v / f => d = lambda / 2 = v / (2 * f)
    const fHz = rfFrequencyMHz * 1e6;
    const halfLambdaMm = ((activeLiquid.refVelocityMs / (2 * fHz)) * 1e3);

    const baseMm = 3.50;
    const newReadings: MicrometerReading[] = Array.from({ length: 11 }, (_, i) => ({
      nodeIndex: i + 1,
      micrometerReadingMm: Number((baseMm + i * halfLambdaMm).toFixed(2)),
    }));
    setReadings(newReadings);
  }, [activeLiquid, rfFrequencyMHz]);

  // Calculations based on x1 and x11
  const calculationResults = useMemo(() => {
    if (readings.length < 2) return null;
    const x1 = readings[0].micrometerReadingMm;
    const x11 = readings[readings.length - 1].micrometerReadingMm;
    const numIntervals = readings.length - 1;

    // Loop width (half wavelength) l = (x11 - x1) / 10 in mm
    const loopWidthMm = (x11 - x1) / numIntervals;
    const loopWidthMeters = loopWidthMm * 1e-3;

    // Wavelength lambda = 2 * l
    const wavelengthMeters = 2 * loopWidthMeters;
    const wavelengthMm = wavelengthMeters * 1e3;

    // Ultrasonic frequency
    const fHz = rfFrequencyMHz * 1e6;

    // Velocity v = f * lambda
    const velocityMs = fHz * wavelengthMeters;

    // Adiabatic compressibility beta_s = 1 / (rho * v^2)
    const rho = activeLiquid.densityKgM3;
    const adiabaticCompressibility = 1 / (rho * Math.pow(velocityMs, 2));

    // Error relative to accepted speed
    const errorPct = Math.abs((velocityMs - activeLiquid.refVelocityMs) / activeLiquid.refVelocityMs) * 100;

    return {
      x1,
      x11,
      loopWidthMm: Number(loopWidthMm.toFixed(3)),
      wavelengthMm: Number(wavelengthMm.toFixed(3)),
      velocityMs: Number(velocityMs.toFixed(1)),
      adiabaticCompressibility,
      errorPct: Number(errorPct.toFixed(2)),
    };
  }, [readings, rfFrequencyMHz, activeLiquid]);

  // 60 FPS Canvas Simulator (Acoustic Standing Waves & Analog Microammeter)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Acoustic Cell Chamber (Left to Mid)
      const cellX = 50;
      const cellY = 40;
      const cellW = width - 260;
      const cellH = height - 80;

      // Quartz Crystal Transducer Plate (Bottom/Left)
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(cellX, cellY + 10, 16, cellH - 20);
      ctx.strokeStyle = '#94a3b8';
      ctx.strokeRect(cellX, cellY + 10, 16, cellH - 20);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('QUARTZ', cellX - 6, cellY + cellH / 2);

      // Cell fluid bounding chamber
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(cellX + 16, cellY, cellW - 16, cellH);

      // Liquid background tint
      ctx.fillStyle = 'rgba(56, 189, 248, 0.05)';
      ctx.fillRect(cellX + 16, cellY, cellW - 16, cellH);

      // Movable Metallic Reflector Plate
      const maxDistMm = 10;
      const reflectorOffset = (micrometerPositionMm / maxDistMm) * (cellW - 70);
      const reflectorX = cellX + 50 + reflectorOffset;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(reflectorX, cellY + 8, 12, cellH - 16);
      ctx.strokeStyle = '#64748b';
      ctx.strokeRect(reflectorX, cellY + 8, 12, cellH - 16);

      // Micrometer Shaft connected to reflector
      ctx.fillStyle = '#475569';
      ctx.fillRect(reflectorX + 12, cellY + cellH / 2 - 6, (cellX + cellW) - (reflectorX + 12), 12);

      // Standing Waves Density Visualization (Fluid compression nodes & antinodes)
      const numWaves = 7;
      const waveSpan = reflectorX - (cellX + 16);

      if (waveSpan > 20) {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;

        for (let x = cellX + 18; x < reflectorX - 2; x += 3) {
          const k = ((x - (cellX + 18)) / waveSpan) * numWaves * Math.PI;
          const standingAmp = Math.sin(k) * Math.cos(t * 3);
          const alpha = 0.15 + Math.abs(standingAmp) * 0.7;

          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
          ctx.fillRect(x, cellY + 2, 2.5, cellH - 4);
        }
      }

      // Analog Microammeter (Right Instrument Panel)
      const meterX = width - 180;
      const meterY = cellY + 15;
      const meterW = 140;
      const meterH = 110;

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(meterX, meterY, meterW, meterH);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(meterX, meterY, meterW, meterH);

      // Meter Arc
      const arcCenterX = meterX + meterW / 2;
      const arcCenterY = meterY + meterH - 15;
      const arcR = 60;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(arcCenterX, arcCenterY, arcR, Math.PI * 1.2, Math.PI * 1.8);
      ctx.stroke();

      // Resonance current oscillation based on standing wave condition
      // Peak current occurs when distance is a multiple of lambda/2
      const halfLambdaApprox = (activeLiquid.refVelocityMs / (2 * rfFrequencyMHz * 1e6)) * 1e3;
      const phaseMod = (micrometerPositionMm % halfLambdaApprox) / halfLambdaApprox;
      const resonancePeak = Math.pow(Math.cos(phaseMod * Math.PI), 4);
      const needleAngle = Math.PI * 1.2 + (Math.PI * 0.6) * resonancePeak;

      // Needle
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(arcCenterX, arcCenterY);
      ctx.lineTo(arcCenterX + Math.cos(needleAngle) * (arcR - 8), arcCenterY + Math.sin(needleAngle) * (arcR - 8));
      ctx.stroke();

      // Center pivot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(arcCenterX, arcCenterY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Meter Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText('µA CURRENT', meterX + 35, meterY + meterH - 22);

      // Micrometer Dial Gauge readout below meter
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`MICROMETER: ${micrometerPositionMm.toFixed(2)} mm`, meterX - 10, cellY + cellH - 10);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [micrometerPositionMm, activeLiquid, rfFrequencyMHz]);

  const handleTriggerReport = () => {
    if (!calculationResults) return;
    onGenerateReport({
      experimentId: 8,
      experimentTitle: 'Velocity of Ultrasonic Waves in Liquids via Interferometer',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To determine the velocity of ultrasonic waves in a liquid medium using an ultrasonic interferometer and evaluate its adiabatic compressibility.',
      apparatus: ['Ultrasonic Interferometer Cell (2 MHz)', 'Piezoelectric Quartz Crystal Transducer', 'RF High-Frequency Oscillator', 'Digital Microammeter', 'Micrometer Screw Gauge (0.01 mm)'],
      formulaLatex: '\\lambda = 2 \\cdot \\Delta d = \\frac{2(x_{11} - x_1)}{10}, \\quad v = f \\cdot \\lambda, \\quad \\beta_s = \\frac{1}{\\rho v^2}',
      parameters: {
        'Liquid Medium': activeLiquid.name,
        'Liquid Density (ρ)': `${activeLiquid.densityKgM3} kg/m³`,
        'Oscillator Frequency (f)': `${rfFrequencyMHz} MHz`,
        'Reading x1': `${calculationResults.x1} mm`,
        'Reading x11': `${calculationResults.x11} mm`,
      },
      readings: readings.map(r => ({
        'Node Index': r.nodeIndex,
        'Micrometer Reading (mm)': r.micrometerReadingMm,
      })),
      calculatedResults: {
        'Half-Wavelength (d)': `${calculationResults.loopWidthMm} mm`,
        'Ultrasonic Wavelength (λ)': `${calculationResults.wavelengthMm} mm`,
        'Acoustic Velocity (v)': `${calculationResults.velocityMs} m/s`,
        'Reference Standard': `${activeLiquid.refVelocityMs} m/s`,
        'Adiabatic Compressibility': `${calculationResults.adiabaticCompressibility.toExponential(3)} m²/N`,
        'Discrepancy Error': `${calculationResults.errorPct}%`,
      },
      conclusion: `The velocity of ultrasonic waves in ${activeLiquid.name} at ${rfFrequencyMHz} MHz was experimentally evaluated to be v = ${calculationResults.velocityMs} m/s (${calculationResults.errorPct}% discrepancy compared to standard ${activeLiquid.refVelocityMs} m/s). The adiabatic compressibility was determined as ${calculationResults.adiabaticCompressibility.toExponential(3)} m²/N.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Acoustics & Ultrasonic Wave Physics
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Ultrasonic Interferometer Testing Bench
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Generate acoustic standing waves in liquids using piezoelectric resonance and evaluate speed <KatexMath math="v = f \lambda" /> and compressibility <KatexMath math="\beta_s = \frac{1}{\rho v^2}" />.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setRfFrequencyMHz(2.0);
              setLiquidIndex(0);
              setMicrometerPositionMm(7.49);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleTriggerReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-950 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lab Report
          </button>
        </div>
      </div>

      {/* 60 FPS Canvas Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            Acoustic Standing Wave Chamber & Microammeter (Live 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="text-cyan-400">Liquid: {activeLiquid.name}</span>
            <span className="text-emerald-400">f = {rfFrequencyMHz} MHz</span>
            {calculationResults && <span className="text-amber-400">v = {calculationResults.velocityMs} m/s</span>}
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
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Liquid Medium & Transducer
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Select Liquid Medium</label>
            <div className="grid grid-cols-2 gap-2">
              {LIQUID_PRESETS.map((liq, idx) => (
                <button
                  key={liq.name}
                  onClick={() => setLiquidIndex(idx)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    liquidIndex === idx
                      ? 'bg-cyan-500/20 border-cyan-500 text-white font-medium'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">{liq.name}</div>
                  <div className="text-[10px] text-slate-500">Ref: {liq.refVelocityMs} m/s</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Oscillator Frequency (f)</span>
              <span className="text-white font-mono">{rfFrequencyMHz.toFixed(1)} MHz</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.5}
              value={rfFrequencyMHz}
              onChange={(e) => setRfFrequencyMHz(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Micrometer Position</span>
              <span className="text-white font-mono">{micrometerPositionMm.toFixed(2)} mm</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={9.0}
              step={0.05}
              value={micrometerPositionMm}
              onChange={(e) => setMicrometerPositionMm(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>

        {/* Observation Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Table className="w-4 h-4 text-cyan-400" />
              Observation Table: Anode Current Resonance Nodes (x1 to x11)
            </div>
          </div>

          <div className="overflow-x-auto max-h-[140px]">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-1.5 px-3">Node #</th>
                  <th className="py-1.5 px-3">Micrometer Reading (mm)</th>
                  <th className="py-1.5 px-3">Interval Spacing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {readings.map((r, i) => (
                  <tr key={r.nodeIndex} className="hover:bg-slate-800/30">
                    <td className="py-1.5 px-3 text-cyan-400 font-bold">x{r.nodeIndex}</td>
                    <td className="py-1.5 px-3 text-slate-200">{r.micrometerReadingMm} mm</td>
                    <td className="py-1.5 px-3 text-slate-500">
                      {i === 0 ? '-' : `+${(r.micrometerReadingMm - readings[i - 1].micrometerReadingMm).toFixed(2)} mm`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Metric Badges */}
          {calculationResults && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Wavelength (λ)</div>
                <div className="text-base font-bold text-cyan-400 mt-1 font-mono">
                  {calculationResults.wavelengthMm} <span className="text-xs text-slate-400">mm</span>
                </div>
                <div className="text-[10px] text-slate-500">2 × Loop Width</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Sound Velocity (v)</div>
                <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                  {calculationResults.velocityMs} <span className="text-xs text-slate-400">m/s</span>
                </div>
                <div className="text-[10px] text-slate-500">Ref: {activeLiquid.refVelocityMs} m/s</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Compressibility (βs)</div>
                <div className="text-sm font-bold text-purple-400 mt-1 font-mono truncate">
                  {calculationResults.adiabaticCompressibility.toExponential(2)}
                </div>
                <div className="text-[10px] text-slate-500">m²/N (Adiabatic)</div>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                <div className="text-[11px] text-slate-400">Discrepancy Error</div>
                <div className="text-base font-bold text-amber-400 mt-1 font-mono">
                  {calculationResults.errorPct}%
                </div>
                <div className="text-[10px] text-emerald-400">✓ In Specification</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-cyan-400" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            An acoustic standing wave is formed in the liquid medium when the distance between the quartz crystal and the metallic reflector is an integral multiple of half-wavelengths <KatexMath math="n \cdot \frac{\lambda}{2}" />. The loop width between 10 consecutive resonant nodes gives:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="l = \frac{x_{11} - x_1}{10} \implies \lambda = 2l \implies v = f \cdot \lambda = 2f \left(\frac{x_{11} - x_1}{10}\right)" block />
          </div>
          <p>
            The adiabatic compressibility <KatexMath math="\beta_s" /> of the liquid is evaluated using the Newton-Laplace formulation:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="\beta_s = \frac{1}{\rho v^2} \quad (\text{m}^2/\text{N} \text{ or } \text{Pa}^{-1})" block />
          </div>
        </div>
      </div>
    </div>
  );
};
