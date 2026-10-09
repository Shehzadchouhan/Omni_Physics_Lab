import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, SunMedium, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp3Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface OrderReading {
  order: number;
  leftSpotCm: number;
  rightSpotCm: number;
}

const GRATING_PRESETS = [
  { linesPerMm: 100, label: '100 lines/mm (d = 10 µm)' },
  { linesPerMm: 300, label: '300 lines/mm (d = 3.33 µm)' },
  { linesPerMm: 500, label: '500 lines/mm (d = 2.0 µm)' },
  { linesPerMm: 600, label: '600 lines/mm (d = 1.67 µm)' },
];

export const Exp3Diffraction: React.FC<Exp3Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Optical bench controls
  const [laserType, setLaserType] = useState<'red' | 'green' | 'violet'>('red');
  const [screenDistanceD_cm, setScreenDistanceD_cm] = useState<number>(100);
  const [linesPerMm, setLinesPerMm] = useState<number>(500);

  // Wavelength mapping
  const wavelengthNm = useMemo(() => {
    switch (laserType) {
      case 'red': return 632.8;
      case 'green': return 532.0;
      case 'violet': return 405.0;
    }
  }, [laserType]);

  const laserColor = useMemo(() => {
    switch (laserType) {
      case 'red': return '#ef4444';
      case 'green': return '#22c55e';
      case 'violet': return '#8b5cf6';
    }
  }, [laserType]);

  // Theoretical grating element d in meters
  const theoreticalD_meters = useMemo(() => {
    return 1 / (linesPerMm * 1000); // meters
  }, [linesPerMm]);

  // Observations table for orders n = 1, 2, 3
  const [readings, setReadings] = useState<OrderReading[]>([
    { order: 1, leftSpotCm: 3.16, rightSpotCm: 3.16 },
    { order: 2, leftSpotCm: 6.45, rightSpotCm: 6.45 },
    { order: 3, leftSpotCm: 10.02, rightSpotCm: 10.02 },
  ]);

  // Update readings automatically when laser or grating preset changes
  useEffect(() => {
    const lambdaMeters = wavelengthNm * 1e-9;
    const D_meters = screenDistanceD_cm * 1e-2;
    const newReadings: OrderReading[] = [1, 2, 3].map((n) => {
      // sin(theta) = n * lambda / d
      const sinTheta = (n * lambdaMeters) / theoreticalD_meters;
      if (sinTheta >= 1) return { order: n, leftSpotCm: 0, rightSpotCm: 0 };
      const tanTheta = Math.tan(Math.asin(sinTheta));
      const yn_cm = Number((tanTheta * D_meters * 100).toFixed(2));
      return { order: n, leftSpotCm: yn_cm, rightSpotCm: yn_cm };
    });
    setReadings(newReadings);
  }, [wavelengthNm, screenDistanceD_cm, theoreticalD_meters]);

  // Computed results across table
  const computedStats = useMemo(() => {
    const lambdaMeters = wavelengthNm * 1e-9;
    const D_meters = screenDistanceD_cm * 1e-2;

    const rowCalculations = readings.map((r) => {
      const avgY_cm = (r.leftSpotCm + r.rightSpotCm) / 2;
      const y_meters = avgY_cm * 1e-2;
      const thetaRad = Math.atan(y_meters / (D_meters || 1));
      const thetaDeg = (thetaRad * 180) / Math.PI;
      const sinTheta = Math.sin(thetaRad);
      // d = n * lambda / sin(theta)
      const d_meters = sinTheta > 0 ? (r.order * lambdaMeters) / sinTheta : 0;
      const d_um = d_meters * 1e6;
      return {
        ...r,
        avgY_cm: Number(avgY_cm.toFixed(2)),
        thetaDeg: Number(thetaDeg.toFixed(2)),
        sinTheta: Number(sinTheta.toFixed(4)),
        d_um: Number(d_um.toFixed(3)),
        d_meters,
      };
    });

    const validRows = rowCalculations.filter((r) => r.d_meters > 0);
    const meanD_meters = validRows.length > 0
      ? validRows.reduce((acc, r) => acc + r.d_meters, 0) / validRows.length
      : theoreticalD_meters;

    const meanD_um = meanD_meters * 1e6;
    const linesPerCm = 1 / (meanD_meters * 100);
    const errorPct = Math.abs((meanD_meters - theoreticalD_meters) / theoreticalD_meters) * 100;

    return {
      rows: rowCalculations,
      meanD_um: Number(meanD_um.toFixed(3)),
      linesPerCm: Math.round(linesPerCm),
      errorPct: Number(errorPct.toFixed(2)),
    };
  }, [readings, wavelengthNm, screenDistanceD_cm, theoreticalD_meters]);

  // 60fps Canvas Simulation (Fraunhofer Diffraction Pattern & Spectrometer)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.05;
      const width = canvas.width;
      const height = canvas.height;

      // Dark optics chamber
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Scale screen width & position
      const screenY = 65;
      const screenHeight = 60;
      const centerX = width / 2;

      // Observation Screen (White strip on top)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(30, screenY, width - 60, screenHeight);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, screenY, width - 60, screenHeight);

      // Ruler tick marks on observation screen
      ctx.strokeStyle = '#475569';
      ctx.fillStyle = '#64748b';
      ctx.font = '9px monospace';
      for (let x = 40; x <= width - 40; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, screenY + screenHeight);
        ctx.lineTo(x, screenY + screenHeight - 6);
        ctx.stroke();
      }

      // Render Central Maxima (m = 0)
      const renderSpot = (x: number, intensity: number, orderLabel: string) => {
        const spotRadius = 14 * intensity;
        const grad = ctx.createRadialGradient(x, screenY + screenHeight / 2, 0, x, screenY + screenHeight / 2, spotRadius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, laserColor);
        grad.addColorStop(0.7, `${laserColor}44`);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, screenY + screenHeight / 2, spotRadius, 0, Math.PI * 2);
        ctx.fill();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(orderLabel, x - 12, screenY + screenHeight + 14);
      };

      // Draw m = 0
      renderSpot(centerX, 1.0, 'm = 0');

      // Draw higher diffraction orders m = ±1, ±2, ±3
      const lambdaM = wavelengthNm * 1e-9;
      const D_m = screenDistanceD_cm * 1e-2;
      const pxPerCm = 15; // visual screen scale

      [1, 2, 3].forEach((m) => {
        const sinTheta = (m * lambdaM) / theoreticalD_meters;
        if (sinTheta < 1) {
          const tanTheta = Math.tan(Math.asin(sinTheta));
          const yn_cm = tanTheta * D_m * 100;
          const offsetPx = yn_cm * pxPerCm;

          const intensity = Math.pow(0.75, m); // intensity falls off for higher orders

          if (centerX + offsetPx < width - 40) {
            renderSpot(centerX + offsetPx, intensity, `+${m}`);
          }
          if (centerX - offsetPx > 40) {
            renderSpot(centerX - offsetPx, intensity, `-${m}`);
          }
        }
      });

      // Bottom Area: Diffraction Intensity Profile Graph I(θ)
      const graphY = height - 40;
      const graphHeight = 65;

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, graphY);
      ctx.lineTo(width - 40, graphY);
      ctx.stroke();

      // Intensity curve
      ctx.beginPath();
      ctx.strokeStyle = laserColor;
      ctx.lineWidth = 1.8;

      for (let px = 40; px < width - 40; px += 2) {
        const dx = (px - centerX) / pxPerCm; // in cm
        const theta = Math.atan((dx * 1e-2) / D_m);
        const beta = (Math.PI * (theoreticalD_meters * 0.4) * Math.sin(theta)) / lambdaM;
        const gamma = (Math.PI * theoreticalD_meters * Math.sin(theta)) / lambdaM;

        const singleSlit = beta === 0 ? 1 : Math.pow(Math.sin(beta) / beta, 2);
        const multiSlit = gamma === 0 ? 1 : Math.pow(Math.sin(3 * gamma) / (3 * Math.sin(gamma) || 1), 2);
        const totalI = singleSlit * multiSlit;

        const py = graphY - totalI * graphHeight;
        if (px === 40) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      // Intensity curve label
      ctx.fillStyle = '#64748b';
      ctx.font = '10px sans-serif';
      ctx.fillText('Fraunhofer Intensity Distribution I(θ)', 45, graphY - graphHeight - 4);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [wavelengthNm, screenDistanceD_cm, theoreticalD_meters, laserColor]);

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 3,
      experimentTitle: 'Diffraction of Laser Beam & Grating Element Determination',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To evaluate the grating element (d) and lines per centimeter of a diffraction grating using monochromatic laser Fraunhofer diffraction.',
      apparatus: ['Laser Source (632.8nm)', 'Diffraction Grating (500 lines/mm)', 'Optical Rail Screen', 'Precision Scale'],
      formulaLatex: 'd = (a + b) = \\frac{n \\cdot \\lambda}{\\sin \\theta_n} = \\frac{n \\cdot \\lambda}{\\sin \\left(\\arctan(y_n / D)\\right)}',
      parameters: {
        'Laser Type': laserType.toUpperCase(),
        'Wavelength (λ)': `${wavelengthNm} nm`,
        'Grating Rating': `${linesPerMm} lines/mm`,
        'Screen Distance (D)': `${screenDistanceD_cm} cm`,
      },
      readings: computedStats.rows.map(r => ({
        'Order (n)': r.order,
        'Left Spot (cm)': r.leftSpotCm,
        'Right Spot (cm)': r.rightSpotCm,
        'Distance yn (cm)': r.avgY_cm,
        'Diffraction Angle θ': `${r.thetaDeg}°`,
        'Computed d (µm)': r.d_um,
      })),
      calculatedResults: {
        'Mean Grating Element (d)': `${computedStats.meanD_um} µm`,
        'Grating Lines / cm': `${computedStats.linesPerCm} lines/cm`,
        'Theoretical d': `${(theoreticalD_meters * 1e6).toFixed(3)} µm`,
        'Percentage Error': `${computedStats.errorPct}%`,
      },
      conclusion: `The transmission grating element was evaluated to be d = ${computedStats.meanD_um} µm, corresponding to ${computedStats.linesPerCm} lines/cm (${computedStats.errorPct}% discrepancy relative to manufacturer specifications).`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            Wave Optics & Interference
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Laser Diffraction & Grating Bench
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Observe multi-order Fraunhofer diffraction spots and evaluate grating element <KatexMath math="d = n\lambda / \sin \theta" />.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setScreenDistanceD_cm(100);
              setLinesPerMm(500);
              setLaserType('red');
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleTriggerReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-950 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lab Report
          </button>
        </div>
      </div>

      {/* 60fps Canvas Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <SunMedium className="w-3.5 h-3.5 text-purple-400" />
            Fraunhofer Diffraction Screen & Spectral Profile
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="text-purple-400">λ = {wavelengthNm} nm</span>
            <span className="text-cyan-400">D = {screenDistanceD_cm} cm</span>
            <span className="text-emerald-400">Grating = {linesPerMm} lines/mm</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={840}
          height={250}
          className="w-full h-[250px] block"
        />
      </div>

      {/* Control Knobs & Observation Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Optical Bench Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            <Sliders className="w-4 h-4 text-purple-400" />
            Diffraction Bench Controls
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Laser Source Wavelength</label>
            <div className="grid grid-cols-3 gap-2">
              {(['red', 'green', 'violet'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLaserType(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium capitalize border transition-all ${
                    laserType === type
                      ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Grating Slit Density</label>
            <div className="space-y-1.5">
              {GRATING_PRESETS.map((p) => (
                <button
                  key={p.linesPerMm}
                  onClick={() => setLinesPerMm(p.linesPerMm)}
                  className={`w-full py-1.5 px-3 rounded-lg text-left text-xs border transition-all ${
                    linesPerMm === p.linesPerMm
                      ? 'bg-purple-500/20 border-purple-500 text-white font-medium'
                      : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Screen Distance (D)</span>
              <span className="text-white font-mono">{screenDistanceD_cm} cm</span>
            </div>
            <input
              type="range"
              min={40}
              max={250}
              step={5}
              value={screenDistanceD_cm}
              onChange={(e) => setScreenDistanceD_cm(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
        </div>

        {/* Observation Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Table className="w-4 h-4 text-purple-400" />
              Observation Table: Diffraction Orders & Angles
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">Order (n)</th>
                  <th className="py-2 px-3">Displacement yn (cm)</th>
                  <th className="py-2 px-3">Angle θ (deg)</th>
                  <th className="py-2 px-3">sin(θ)</th>
                  <th className="py-2 px-3">Grating d (µm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {computedStats.rows.map((r) => (
                  <tr key={r.order} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-purple-400 font-bold">{r.order}</td>
                    <td className="py-2 px-3 text-slate-200">{r.avgY_cm} cm</td>
                    <td className="py-2 px-3 text-cyan-300">{r.thetaDeg}°</td>
                    <td className="py-2 px-3 text-slate-400">{r.sinTheta}</td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{r.d_um} µm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Mean Grating d</div>
              <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                {computedStats.meanD_um} <span className="text-xs text-slate-400">µm</span>
              </div>
              <div className="text-[10px] text-slate-500">Slit Period</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Calculated N</div>
              <div className="text-base font-bold text-cyan-400 mt-1 font-mono">
                {computedStats.linesPerCm}
              </div>
              <div className="text-[10px] text-slate-500">lines / cm</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Target Standard</div>
              <div className="text-base font-bold text-purple-400 mt-1 font-mono">
                {(theoreticalD_meters * 1e6).toFixed(2)} µm
              </div>
              <div className="text-[10px] text-slate-500">{linesPerMm} lines/mm</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Discrepancy Error</div>
              <div className="text-base font-bold text-amber-400 mt-1 font-mono">
                {computedStats.errorPct}%
              </div>
              <div className="text-[10px] text-emerald-400">✓ Accurate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-purple-400" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            When plane monochromatic light waves strike a periodic diffraction grating normally, the condition for constructive interference principal maxima of order <KatexMath math="n" /> is governed by the grating equation:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="d \sin \theta_n = n \lambda \implies d = (a + b) = \frac{n \lambda}{\sin \theta_n}" block />
          </div>
          <p>
            Measuring spot distance <KatexMath math="y_n" /> from the central zero-order spot on a screen placed at distance <KatexMath math="D" /> gives:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="\tan \theta_n = \frac{y_n}{D} \implies \theta_n = \arctan\left(\frac{y_n}{D}\right)" block />
          </div>
        </div>
      </div>
    </div>
  );
};
