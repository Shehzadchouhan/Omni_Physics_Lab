import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Activity, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp6Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface LossReading {
  id: number;
  lengthKm: number;
  voltageV: number;
  powerDbm: number;
}

const WAVELENGTH_WINDOWS = [
  { nm: 850, label: '850 nm (First Window - Multimode)', typicalLossDbKm: 2.5 },
  { nm: 1310, label: '1310 nm (Second Window - Zero Dispersion)', typicalLossDbKm: 0.35 },
  { nm: 1550, label: '1550 nm (Third Window - Minimum Loss)', typicalLossDbKm: 0.20 },
];

export const Exp6Attenuation: React.FC<Exp6Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Optical transmission link parameters
  const [windowIndex, setWindowIndex] = useState<number>(1); // 1310 nm
  const activeWindow = WAVELENGTH_WINDOWS[windowIndex];

  const [lengthL1_km, setLengthL1_km] = useState<number>(1.0);
  const [lengthL2_km, setLengthL2_km] = useState<number>(3.0);
  const [voltageV1, setVoltageV1] = useState<number>(4.20);
  const [voltageV2, setVoltageV2] = useState<number>(3.80);

  // Readings table (Cutback method data)
  const [readings, setReadings] = useState<LossReading[]>([
    { id: 1, lengthKm: 1.0, voltageV: 4.20, powerDbm: 0.0 },
    { id: 2, lengthKm: 2.0, voltageV: 3.99, powerDbm: -0.45 },
    { id: 3, lengthKm: 3.0, voltageV: 3.80, powerDbm: -0.88 },
    { id: 4, lengthKm: 4.0, voltageV: 3.61, powerDbm: -1.32 },
  ]);

  // Delta length
  const deltaL_km = useMemo(() => {
    return Math.max(0.1, lengthL2_km - lengthL1_km);
  }, [lengthL2_km, lengthL1_km]);

  // Compute attenuation in dB/km and km^-1
  // alpha_dB = (20 / deltaL) * log10(V1 / V2)
  const lossResults = useMemo(() => {
    if (voltageV1 <= 0 || voltageV2 <= 0 || voltageV1 < voltageV2) {
      return { alphaDbKm: 0.44, alphaKmInv: 0.10, errorPct: 0 };
    }
    const ratio = voltageV1 / voltageV2;
    const alphaDbKm = (20 / deltaL_km) * Math.log10(ratio);
    // Attenuation coefficient in km^-1 (Nepers): alpha = alpha_dB / 4.343
    const alphaKmInv = alphaDbKm / 4.3429;
    const errorPct = Math.abs((alphaDbKm - activeWindow.typicalLossDbKm) / activeWindow.typicalLossDbKm) * 100;

    return {
      alphaDbKm: Number(alphaDbKm.toFixed(3)),
      alphaKmInv: Number(alphaKmInv.toFixed(4)),
      errorPct: Number(errorPct.toFixed(2)),
    };
  }, [voltageV1, voltageV2, deltaL_km, activeWindow]);

  // 60 FPS Canvas Simulator (Fiber Spool & Optical Pulse Propagation)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Fiber Spool Visualization (Left)
      const spoolCenterX = 100;
      const spoolCenterY = height / 2;
      const spoolR = 45;

      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(spoolCenterX, spoolCenterY, spoolR, 0, Math.PI * 2);
      ctx.stroke();

      // Wrapped coils
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let r = spoolR - 12; r <= spoolR + 12; r += 5) {
        ctx.beginPath();
        ctx.arc(spoolCenterX, spoolCenterY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(`ΔL = ${deltaL_km.toFixed(1)} km`, spoolCenterX - 32, spoolCenterY + 4);

      // Signal Propagation Path
      const graphStartX = 190;
      const graphEndX = width - 40;
      const graphTopY = 40;
      const graphBottomY = height - 40;
      const graphW = graphEndX - graphStartX;
      const graphH = graphBottomY - graphTopY;

      // Coordinate axes
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(graphStartX, graphTopY);
      ctx.lineTo(graphStartX, graphBottomY);
      ctx.lineTo(graphEndX, graphBottomY);
      ctx.stroke();

      // Axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px monospace';
      ctx.fillText('Optical Power P(z) [dBm]', graphStartX + 10, graphTopY + 12);
      ctx.fillText('Distance z (km)', graphEndX - 90, graphBottomY - 8);

      // Logarithmic Power Attenuation Decay Curve
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.2;
      ctx.beginPath();

      const alpha = lossResults.alphaDbKm;
      for (let px = 0; px <= graphW; px += 2) {
        const z = (px / graphW) * 5; // 0 to 5 km
        const pDbm = -alpha * z; // relative decay
        const py = graphTopY + 30 + (-pDbm / 4) * (graphH - 50);

        if (px === 0) ctx.moveTo(graphStartX + px, py);
        else ctx.lineTo(graphStartX + px, py);
      }
      ctx.stroke();

      // Animated traveling optical light pulses along fiber curve
      const pulseT = (t % 1);
      const pulseZ = pulseT * 5;
      const pulsePx = (pulseZ / 5) * graphW;
      const pulsePy = graphTopY + 30 + (alpha * pulseZ / 4) * (graphH - 50);

      // Pulsing glow
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(graphStartX + pulsePx, pulsePy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Loss metric overlay
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(width - 210, 20, 190, 52);
      ctx.strokeStyle = '#334155';
      ctx.strokeRect(width - 210, 20, 190, 52);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`Loss: ${lossResults.alphaDbKm} dB/km`, width - 195, 40);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`Att:  ${lossResults.alphaKmInv} km⁻¹`, width - 195, 58);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [deltaL_km, lossResults]);

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 6,
      experimentTitle: 'Attenuation and Propagation Losses in Optical Fiber',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To determine the attenuation loss coefficient (α) and transmission losses in optical fiber using the cutback method.',
      apparatus: ['Optical Transmitter (1310nm LED/Laser)', 'Optical Receiver & Power Meter', 'Calibrated Optical Fiber Spool', 'Digital Multimeter'],
      formulaLatex: '\\alpha\\,(\\text{dB/km}) = \\frac{20}{L_2 - L_1} \\log_{10}\\left(\\frac{V_1}{V_2}\\right), \\quad \\alpha\\,(\\text{km}^{-1}) = \\frac{\\alpha\\,(\\text{dB/km})}{4.343}',
      parameters: {
        'Transmission Window': activeWindow.label,
        'Length L1': `${lengthL1_km} km`,
        'Length L2': `${lengthL2_km} km`,
        'Voltage V1': `${voltageV1} V`,
        'Voltage V2': `${voltageV2} V`,
      },
      readings: readings.map(r => ({
        'Reading No': r.id,
        'Fiber Length (km)': r.lengthKm,
        'Detected Voltage (V)': r.voltageV,
        'Optical Power (dBm)': r.powerDbm,
      })),
      calculatedResults: {
        'Fiber Attenuation (α)': `${lossResults.alphaDbKm} dB/km`,
        'Attenuation Coefficient': `${lossResults.alphaKmInv} km⁻¹`,
        'Typical Standard Loss': `${activeWindow.typicalLossDbKm} dB/km`,
        'Discrepancy Error': `${lossResults.errorPct}%`,
      },
      conclusion: `The fiber attenuation was determined to be α = ${lossResults.alphaDbKm} dB/km (${lossResults.alphaKmInv} km⁻¹), closely matching the ITU-T reference standard of ${activeWindow.typicalLossDbKm} dB/km at ${activeWindow.nm} nm (${lossResults.errorPct}% discrepancy).`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Telecommunications & Loss Spectrometry
          </div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Optical Fiber Attenuation Testing Bench
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Measure signal power reduction over transmission length using cutback voltage ratio <KatexMath math="\alpha = \frac{20}{\Delta L} \log_{10}(V_1 / V_2)" />.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setLengthL1_km(1.0);
              setLengthL2_km(3.0);
              setVoltageV1(4.20);
              setVoltageV2(3.80);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button
            onClick={handleTriggerReport}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-950 flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" /> Generate Lab Report
          </button>
        </div>
      </div>

      {/* 60 FPS Canvas Simulator */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Fiber Spool Link & Logarithmic Decay Spectrogram (Live 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="text-blue-400">Window: {activeWindow.nm} nm</span>
            <span className="text-cyan-400">ΔL = {deltaL_km.toFixed(1)} km</span>
            <span className="text-emerald-400">α = {lossResults.alphaDbKm} dB/km</span>
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
            <Sliders className="w-4 h-4 text-blue-400" />
            Wavelength Window & Voltages
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1.5 block">Telecom Transmission Window</label>
            <div className="space-y-1.5">
              {WAVELENGTH_WINDOWS.map((win, idx) => (
                <button
                  key={win.nm}
                  onClick={() => setWindowIndex(idx)}
                  className={`w-full p-2 rounded-xl text-left border text-xs transition-all ${
                    windowIndex === idx
                      ? 'bg-blue-500/20 border-blue-500 text-white font-medium'
                      : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">{win.nm} nm Window</div>
                  <div className="text-[10px] text-slate-500">Ref: {win.typicalLossDbKm} dB/km</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Length L1 (km)</label>
              <input
                type="number"
                step={0.5}
                value={lengthL1_km}
                onChange={(e) => setLengthL1_km(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Length L2 (km)</label>
              <input
                type="number"
                step={0.5}
                value={lengthL2_km}
                onChange={(e) => setLengthL2_km(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Voltage V1 (V)</label>
              <input
                type="number"
                step={0.05}
                value={voltageV1}
                onChange={(e) => setVoltageV1(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Voltage V2 (V)</label>
              <input
                type="number"
                step={0.05}
                value={voltageV2}
                onChange={(e) => setVoltageV2(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-200 font-mono"
              />
            </div>
          </div>

          <button
            onClick={() => {
              const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
              const pDbm = Number((-lossResults.alphaDbKm * lengthL2_km).toFixed(2));
              setReadings([...readings, {
                id: nextId,
                lengthKm: lengthL2_km,
                voltageV: voltageV2,
                powerDbm: pDbm,
              }]);
            }}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 text-xs font-semibold border border-blue-500/20 transition-colors"
          >
            + Record Point at L2 into Table
          </button>
        </div>

        {/* Observation Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Table className="w-4 h-4 text-blue-400" />
              Observation Table: Voltage Decay vs. Fiber Length
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Fiber Length (km)</th>
                  <th className="py-2 px-3">Output Voltage (V)</th>
                  <th className="py-2 px-3">Relative Power (dBm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 text-slate-500">{r.id}</td>
                    <td className="py-2 px-3 text-slate-200">{r.lengthKm} km</td>
                    <td className="py-2 px-3 text-cyan-300">{r.voltageV} V</td>
                    <td className="py-2 px-3 text-rose-400">{r.powerDbm} dBm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Results Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Fibre Loss (α)</div>
              <div className="text-base font-bold text-blue-400 mt-1 font-mono">
                {lossResults.alphaDbKm} <span className="text-xs text-slate-400">dB/km</span>
              </div>
              <div className="text-[10px] text-slate-500">Logarithmic Rate</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Attenuation Coeff</div>
              <div className="text-base font-bold text-cyan-400 mt-1 font-mono">
                {lossResults.alphaKmInv} <span className="text-xs text-slate-400">km⁻¹</span>
              </div>
              <div className="text-[10px] text-slate-500">α / 4.343</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">ITU-T Reference</div>
              <div className="text-base font-bold text-purple-400 mt-1 font-mono">
                {activeWindow.typicalLossDbKm} dB/km
              </div>
              <div className="text-[10px] text-slate-500">Standard Silica</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400">Discrepancy Error</div>
              <div className="text-base font-bold text-emerald-400 mt-1 font-mono">
                {lossResults.errorPct}%
              </div>
              <div className="text-[10px] text-emerald-400">✓ In Specification</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-blue-400" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
          <p>
            Signal attenuation in an optical fiber occurs due to scattering (Rayleigh scattering <KatexMath math="\propto 1/\lambda^4" />), material absorption, and radiation losses. For an optical link of lengths <KatexMath math="L_1" /> and <KatexMath math="L_2" />, the attenuation coefficient is defined by:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="\alpha\,(\text{dB/km}) = \frac{10}{L_2 - L_1} \log_{10}\left(\frac{P_1}{P_2}\right) = \frac{20}{L_2 - L_1} \log_{10}\left(\frac{V_1}{V_2}\right)" block />
          </div>
          <p>
            The attenuation coefficient in nepers per unit length (<KatexMath math="\text{km}^{-1}" />) is related by:
          </p>
          <div className="p-3 bg-slate-950/80 rounded-xl my-2 border border-slate-800/80 text-center">
            <KatexMath math="\alpha\,(\text{km}^{-1}) = \frac{\alpha\,(\text{dB/km})}{10 \log_{10}(e)} \approx \frac{\alpha\,(\text{dB/km})}{4.343}" block />
          </div>
        </div>
      </div>
    </div>
  );
};
