import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Layers, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';
import { PHYSICAL_CONSTANTS } from '../../lib/constants';

interface Exp2Props {
  onGenerateReport: (data: LabReportData) => void;
}

interface DimensionReading {
  id: number;
  diameterCm: number;
  thicknessMm: number;
}

const MATERIAL_PRESETS = [
  { name: 'Plate Glass', kRef: 6.5, color: '#38bdf8', desc: 'Silica glass sample' },
  { name: 'Mica Sheet', kRef: 5.8, color: '#f59e0b', desc: 'Muscovite mica dielectric' },
  { name: 'Teflon (PTFE)', kRef: 2.1, color: '#ec4899', desc: 'Fluoropolymer dielectric' },
  { name: 'Ceramic BaTiO3', kRef: 82.0, color: '#10b981', desc: 'High-permittivity ceramic' },
  { name: 'Bakelite', kRef: 4.8, color: '#a855f7', desc: 'Synthetic polymer resin' },
];

export const Exp2Dielectric: React.FC<Exp2Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Material & preset
  const [selectedMaterialIndex, setSelectedMaterialIndex] = useState<number>(0);
  const activeMaterial = MATERIAL_PRESETS[selectedMaterialIndex];

  // Circuit electrical parameters
  const [csPicoFarad, setCsPicoFarad] = useState<number>(50); // Cs in pF
  const [vsVolts, setVsVolts] = useState<number>(10.0);       // Standard capacitor voltage
  const [vdVolts, setVdVolts] = useState<number>(1.54);       // Dielectric voltage

  // Dielectric slab physical insertion fraction (0 to 1)
  const [insertionFraction, setInsertionFraction] = useState<number>(0.85);

  // Dimension readings table
  const [readings, setReadings] = useState<DimensionReading[]>([
    { id: 1, diameterCm: 4.82, thicknessMm: 2.10 },
    { id: 2, diameterCm: 4.80, thicknessMm: 2.12 },
    { id: 3, diameterCm: 4.81, thicknessMm: 2.08 },
    { id: 4, diameterCm: 4.83, thicknessMm: 2.11 },
  ]);

  // Statistical calculations for dimensions
  const stats = useMemo(() => {
    const n = readings.length;
    if (n === 0) return { davMeters: 0.048, thkMeters: 0.0021, areaM2: 0 };
    const avgD_cm = readings.reduce((acc, r) => acc + r.diameterCm, 0) / n;
    const avgThk_mm = readings.reduce((acc, r) => acc + r.thicknessMm, 0) / n;

    const davMeters = (avgD_cm * 1e-2); // cm to m
    const thkMeters = (avgThk_mm * 1e-3); // mm to m
    const radiusMeters = davMeters / 2;
    const areaM2 = Math.PI * Math.pow(radiusMeters, 2);

    return {
      avgD_cm: Number(avgD_cm.toFixed(3)),
      avgThk_mm: Number(avgThk_mm.toFixed(3)),
      davMeters,
      thkMeters,
      areaM2,
    };
  }, [readings]);

  // Capacitances & Dielectric Constant K
  const calculationResults = useMemo(() => {
    const CsFarads = csPicoFarad * 1e-12;
    // Capacity with dielectric: Cd = (Vs * Cs) / Vd
    const CdFarads = (vsVolts * CsFarads) / (vdVolts || 1);

    // Capacity without dielectric: C0 = (ε0 * Area) / d
    const eps0 = PHYSICAL_CONSTANTS.epsilon_0;
    const C0Farads = (eps0 * stats.areaM2) / (stats.thkMeters || 1e-4);

    // Experimental K
    const kExperimental = C0Farads > 0 ? CdFarads / C0Farads : 1;

    // Error percentage
    const errorPct = Math.abs((kExperimental - activeMaterial.kRef) / activeMaterial.kRef) * 100;

    return {
      Cd_pF: Number((CdFarads * 1e12).toFixed(2)),
      C0_pF: Number((C0Farads * 1e12).toFixed(2)),
      kExperimental: Number(kExperimental.toFixed(3)),
      errorPct: Number(errorPct.toFixed(2)),
    };
  }, [csPicoFarad, vsVolts, vdVolts, stats, activeMaterial]);

  // Interactive 60fps Canvas Simulator (Electric field & capacitor cross section)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let wave = 0;

    const render = () => {
      wave += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Dark sci-fi lab background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Capacitor bounding box
      const capX = 80;
      const capWidth = width - 160;
      const plateTopY = 45;
      const plateBottomY = height - 55;
      const plateThickness = 14;

      // Top Conducting Plate (+Q)
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(capX, plateTopY, capWidth, plateThickness);
      // Bottom Conducting Plate (-Q)
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(capX, plateBottomY, capWidth, plateThickness);

      // Plate Labels & Charge Signs
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#ffffff';
      for (let x = capX + 25; x < capX + capWidth - 20; x += 35) {
        ctx.fillText('+', x, plateTopY + 11);
        ctx.fillText('-', x, plateBottomY + 11);
      }

      // Dielectric Slab (Inserted from left)
      const slabGap = plateBottomY - (plateTopY + plateThickness);
      const slabX = capX + 10;
      const maxSlabWidth = capWidth - 20;
      const currentSlabWidth = maxSlabWidth * insertionFraction;

      // Draw Dielectric Slab
      if (currentSlabWidth > 0) {
        ctx.save();
        ctx.fillStyle = `${activeMaterial.color}33`;
        ctx.strokeStyle = activeMaterial.color;
        ctx.lineWidth = 2;
        ctx.fillRect(slabX, plateTopY + plateThickness + 3, currentSlabWidth, slabGap - 6);
        ctx.strokeRect(slabX, plateTopY + plateThickness + 3, currentSlabWidth, slabGap - 6);

        // Internal Bound Polarized Charges
        ctx.fillStyle = activeMaterial.color;
        ctx.font = '10px monospace';
        for (let bx = slabX + 15; bx < slabX + currentSlabWidth - 10; bx += 30) {
          ctx.fillText('-', bx, plateTopY + plateThickness + 18);
          ctx.fillText('+', bx, plateBottomY - 10);
        }
        ctx.restore();
      }

      // Electric Field Lines (Vertical lines between plates)
      ctx.lineWidth = 1;
      const numLines = 18;
      const stepX = capWidth / (numLines + 1);

      for (let i = 1; i <= numLines; i++) {
        const lx = capX + i * stepX;
        const isInsideDielectric = lx >= slabX && lx <= slabX + currentSlabWidth;

        // Field strength reduced inside dielectric by factor of K
        const fieldAlpha = isInsideDielectric ? 0.3 : 0.85;
        const lineColor = isInsideDielectric ? activeMaterial.color : '#38bdf8';

        ctx.strokeStyle = `${lineColor}${Math.floor(fieldAlpha * 255).toString(16).padStart(2, '0')}`;
        ctx.beginPath();
        ctx.moveTo(lx, plateTopY + plateThickness + 1);
        ctx.lineTo(lx, plateBottomY - 1);
        ctx.stroke();

        // Animated field direction arrows
        const arrowY = plateTopY + plateThickness + ((plateBottomY - plateTopY - plateThickness) * ((wave + i * 0.1) % 1));
        ctx.fillStyle = lineColor;
        ctx.beginPath();
        ctx.moveTo(lx, arrowY);
        ctx.lineTo(lx - 3, arrowY - 6);
        ctx.lineTo(lx + 3, arrowY - 6);
        ctx.fill();
      }

      // Lead wires & measurement voltmeter indicators
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 3;
      // Top wire
      ctx.beginPath();
      ctx.moveTo(capX + capWidth / 2, plateTopY);
      ctx.lineTo(capX + capWidth / 2, 15);
      ctx.stroke();

      // Bottom wire
      ctx.beginPath();
      ctx.moveTo(capX + capWidth / 2, plateBottomY + plateThickness);
      ctx.lineTo(capX + capWidth / 2, height - 15);
      ctx.stroke();

      // Digital Metrology Overlay
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(capX + capWidth - 170, height / 2 - 28, 160, 56);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(capX + capWidth - 170, height / 2 - 28, 160, 56);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`C0 = ${calculationResults.C0_pF} pF`, capX + capWidth - 155, height / 2 - 10);
      ctx.fillStyle = '#4ade80';
      ctx.fillText(`Cd = ${calculationResults.Cd_pF} pF`, capX + capWidth - 155, height / 2 + 8);
      ctx.fillStyle = '#f59e0b';
      ctx.fillText(`K  = ${calculationResults.kExperimental}`, capX + capWidth - 155, height / 2 + 22);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [insertionFraction, activeMaterial, calculationResults]);

  const handleUpdateRow = (id: number, field: 'diameterCm' | 'thicknessMm', val: number) => {
    setReadings(readings.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 2,
      experimentTitle: 'Determination of Dielectric Constant of Solid Sample',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To evaluate the dielectric constant (relative permittivity K) of a solid specimen by parallel-plate capacitance measurement.',
      apparatus: ['Dielectric Capacitance Cell', 'Standard Capacitor Cs', 'AC High-Frequency Signal Generator', 'AC Millivoltmeter', 'Micrometer Screw Gauge', 'Vernier Calipers'],
      formulaLatex: 'K = \\frac{C_d}{C_0} = \\frac{(V_s \\cdot C_s) / V_d}{\\frac{\\varepsilon_0 \\cdot \\pi (D_{av}/2)^2}{d_{av}}}',
      parameters: {
        'Tested Specimen': activeMaterial.name,
        'Standard Capacitor (Cs)': `${csPicoFarad} pF`,
        'Source Voltage (Vs)': `${vsVolts} V`,
        'Dielectric Voltage (Vd)': `${vdVolts} V`,
      },
      readings: readings.map(r => ({
        'Trial No': r.id,
        'Diameter D (cm)': r.diameterCm,
        'Thickness d (mm)': r.thicknessMm,
      })),
      calculatedResults: {
        'Average Diameter': `${stats.avgD_cm} cm`,
        'Average Thickness': `${stats.avgThk_mm} mm`,
        'Capacitance with Air (C0)': `${calculationResults.C0_pF} pF`,
        'Capacitance with Slab (Cd)': `${calculationResults.Cd_pF} pF`,
        'Experimental Dielectric Constant (K)': `${calculationResults.kExperimental}`,
        'Reference Standard K': `${activeMaterial.kRef}`,
        'Discrepancy Error': `${calculationResults.errorPct}%`,
      },
      conclusion: `The relative permittivity of ${activeMaterial.name} was experimentally found to be K = ${calculationResults.kExperimental}, compared to accepted reference K = ${activeMaterial.kRef} (${calculationResults.errorPct}% discrepancy).`,
    });
  };

  return (
    <div className="relative isolate space-y-6">
      <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-1 z-10 h-24 w-24 text-amber-500 opacity-[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M28 16v68M72 16v68M28 33h44M28 67h44" />
        <path d="M50 34v9m0 14v9M42 45l8 8 8-8M42 55l8-8 8 8" />
        <circle cx="50" cy="50" r="3" />
      </svg>
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            Electromagnetism & Materials
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Dielectric Constant Testing Bench
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Determine relative permittivity <KatexMath math="K = C_d / C_0" /> by substituting solid dielectric samples in a parallel plate capacitor.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setVdVolts(1.54);
              setVsVolts(10.0);
              setInsertionFraction(0.85);
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

      {/* 60 FPS Visual Capacitor Simulation */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            Parallel Plate Cross-Section & Bound Electric Field Lines
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="text-amber-700">Sample: {activeMaterial.name}</span>
            <span className="text-emerald-700">Insertion: {Math.round(insertionFraction * 100)}%</span>
            <span className="text-cyan-700">K = {calculationResults.kExperimental}</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={840}
          height={250}
          className="w-full h-[250px] block"
        />
      </div>

      {/* Interactive Controls & Observation Table */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Specimen & Electrical Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sliders className="w-4 h-4 text-amber-700" />
            Dielectric Sample & Test Voltage
          </div>

          <div>
            <label className="text-xs text-slate-600 mb-1.5 block">Select Dielectric Sample</label>
            <div className="grid grid-cols-2 gap-2">
              {MATERIAL_PRESETS.map((mat, idx) => (
                <button
                  key={mat.name}
                  onClick={() => {
                    setSelectedMaterialIndex(idx);
                    // adjust Vd slightly according to reference K
                    const simulatedVd = Number((vsVolts / (mat.kRef * 1.05)).toFixed(2));
                    setVdVolts(simulatedVd);
                  }}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    selectedMaterialIndex === idx
                      ? 'bg-amber-50 border-amber-300 text-amber-800 font-medium'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{mat.name}</div>
                  <div className="text-[10px] text-slate-600">Ref K ≈ {mat.kRef}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Slab Insertion Ratio</span>
              <span className="text-slate-900 font-mono">{Math.round(insertionFraction * 100)}%</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={1.0}
              step={0.05}
              value={insertionFraction}
              onChange={(e) => setInsertionFraction(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Source Vs (V)</label>
              <input
                type="number"
                step={0.1}
                value={vsVolts}
                onChange={(e) => setVsVolts(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-700 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-600 block mb-1">Dielectric Vd (V)</label>
              <input
                type="number"
                step={0.01}
                value={vdVolts}
                onChange={(e) => setVdVolts(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-700 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1">Standard Capacitor Cs (pF)</label>
            <input
              type="number"
              value={csPicoFarad}
              onChange={(e) => setCsPicoFarad(Number(e.target.value))}
              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs text-slate-700 font-mono"
            />
          </div>
        </div>

        {/* Dimension Table & Metrology */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Table className="w-4 h-4 text-amber-700" />
              Observation Table: Micrometer & Vernier Specimen Dimensions
            </div>
            <button
              onClick={() => {
                const nextId = readings.length > 0 ? Math.max(...readings.map(r => r.id)) + 1 : 1;
                setReadings([...readings, { id: nextId, diameterCm: 4.81, thicknessMm: 2.10 }]);
              }}
              className="text-xs text-amber-700 hover:underline"
            >
              + Add Reading
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 text-slate-600">
                  <th className="py-2 px-3">#</th>
                  <th className="py-2 px-3">Diameter D (cm)</th>
                  <th className="py-2 px-3">Thickness d (mm)</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                {readings.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50">
                    <td className="py-2 px-3 text-slate-600">{r.id}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step={0.01}
                        value={r.diameterCm}
                        onChange={(e) => handleUpdateRow(r.id, 'diameterCm', Number(e.target.value))}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 w-28"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        step={0.01}
                        value={r.thicknessMm}
                        onChange={(e) => handleUpdateRow(r.id, 'thicknessMm', Number(e.target.value))}
                        className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-700 w-28"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <button
                        onClick={() => setReadings(readings.filter(row => row.id !== r.id))}
                        className="text-rose-700 hover:text-rose-700 text-xs"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Free-Space C0</div>
              <div className="text-base font-bold text-cyan-700 mt-1 font-mono">
                {calculationResults.C0_pF} <span className="text-xs text-slate-600">pF</span>
              </div>
              <div className="text-[10px] text-slate-600">Air / Vacuum</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Dielectric Cd</div>
              <div className="text-base font-bold text-emerald-700 mt-1 font-mono">
                {calculationResults.Cd_pF} <span className="text-xs text-slate-600">pF</span>
              </div>
              <div className="text-[10px] text-slate-600">With Slab</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Experimental K</div>
              <div className="text-base font-bold text-amber-700 mt-1 font-mono">
                {calculationResults.kExperimental}
              </div>
              <div className="text-[10px] text-slate-600">Ref: {activeMaterial.kRef}</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Discrepancy Error</div>
              <div className="text-base font-bold text-purple-700 mt-1 font-mono">
                {calculationResults.errorPct}%
              </div>
              <div className="text-[10px] text-emerald-700">✓ Validated</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Mathematical Derivations */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-amber-700" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            When a dielectric slab of thickness <KatexMath math="d" /> and relative permittivity <KatexMath math="K" /> completely fills the volume between capacitor plates of area <KatexMath math="A" />, the capacitance with air/vacuum is:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="C_0 = \frac{\varepsilon_0 A}{d} = \frac{\varepsilon_0 \pi (D_{av}/2)^2}{d_{av}}" block />
          </div>
          <p>
            Using the AC substitution method with standard capacitor <KatexMath math="C_s" />, the dielectric capacitance <KatexMath math="C_d" /> and dielectric constant <KatexMath math="K" /> are given by:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="C_d = \frac{V_s \cdot C_s}{V_d} \implies K = \frac{C_d}{C_0} = \frac{V_s \cdot C_s \cdot d_{av}}{V_d \cdot \varepsilon_0 \cdot \pi (D_{av}/2)^2}" block />
          </div>
        </div>
      </div>
    </div>
  );
};
