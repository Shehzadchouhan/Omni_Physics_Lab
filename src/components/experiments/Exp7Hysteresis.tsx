import React, { useState, useRef, useEffect, useMemo } from 'react';
import { RotateCcw, Sliders, Table, Sparkles, Magnet, Info } from 'lucide-react';
import { KatexMath } from '../common/KatexMath';
import type { LabReportData } from '../../types/physics';

interface Exp7Props {
  onGenerateReport: (data: LabReportData) => void;
}

const FERROMAGNETIC_MATERIALS = [
  {
    name: 'Soft Iron',
    type: 'soft',
    hc_Am: 120,       // Low coercivity
    br_Tesla: 1.15,   // High retentivity
    bs_Tesla: 1.65,   // Saturation
    loopAreaJm3: 320, // Low hysteresis loss
    desc: 'Electromagnet and transformer cores',
  },
  {
    name: 'Hard Carbon Steel',
    type: 'hard',
    hc_Am: 650,       // High coercivity
    br_Tesla: 0.85,
    bs_Tesla: 1.45,
    loopAreaJm3: 1450, // High hysteresis loss
    desc: 'Permanent magnets',
  },
  {
    name: 'Silicon Steel (CRGO)',
    type: 'soft',
    hc_Am: 45,        // Extremely low coercivity
    br_Tesla: 1.30,
    bs_Tesla: 1.95,
    loopAreaJm3: 120, // Minimal core loss
    desc: 'High efficiency power transformers',
  },
  {
    name: 'Alnico Alloy',
    type: 'hard',
    hc_Am: 850,
    br_Tesla: 1.10,
    bs_Tesla: 1.35,
    loopAreaJm3: 2100,
    desc: 'Loudspeakers and pickup sensors',
  },
];

export const Exp7Hysteresis: React.FC<Exp7Props> = ({ onGenerateReport }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Material & Apparatus setup
  const [materialIndex, setMaterialIndex] = useState<number>(0);
  const activeMat = FERROMAGNETIC_MATERIALS[materialIndex];

  // CRO adjustments
  const [croGainX, setCroGainX] = useState<number>(1.0); // gx (Volts/div)
  const [croGainY, setCroGainY] = useState<number>(1.0); // gy (Volts/div)
  const [driveCurrentAmps, setDriveCurrentAmps] = useState<number>(2.5); // magnetizing current

  // Specimen & Coil Dimensions (from lab manual)
  const [sampleDiameterMm, setSampleDiameterMm] = useState<number>(4.2);
  const [sampleLengthMm, setSampleLengthMm] = useState<number>(35.0);
  const [coilDiameterMm, setCoilDiameterMm] = useState<number>(8.0);
  const [demagnetizationN, setDemagnetizationN] = useState<number>(0.005);

  // Calibration factors (G0, U0 from original C++ code)
  const [g0Factor, setG0Factor] = useState<number>(1.25);
  const [u0Factor, setU0Factor] = useState<number>(1.00);

  // Cross section areas
  const areas = useMemo(() => {
    const As = Math.PI * Math.pow(sampleDiameterMm / 2, 2);
    const Ac = Math.PI * Math.pow(coilDiameterMm / 2, 2);
    const areaRatio = Ac > 0 ? As / Ac : 0.25;
    return { As, Ac, areaRatio };
  }, [sampleDiameterMm, coilDiameterMm]);

  // Evaluated magnetic parameters based on lab manual formula
  const computedParams = useMemo(() => {
    const denom = Math.max(0.01, areas.areaRatio - demagnetizationN);
    // Loop width ex in mm
    const ex_mm = activeMat.type === 'soft' ? 1.4 : 4.8;
    // Intercept Eyr in mm
    const Eyr_mm = activeMat.type === 'soft' ? 3.8 : 2.6;
    // Tip height Eys in mm
    const Eys_mm = activeMat.type === 'soft' ? 6.2 : 5.4;

    const Hc = (g0Factor * ex_mm * 100) / denom; // A/m
    const Br = (g0Factor * u0Factor * croGainX * Eyr_mm) / (croGainY * denom * 4 * Math.PI * 0.1); // Tesla
    const Ms = (g0Factor * u0Factor * croGainX * Eys_mm) / (croGainY * denom * 4 * Math.PI * 0.1); // Tesla

    return {
      ex_mm,
      Eyr_mm,
      Eys_mm,
      Hc: Number(Hc.toFixed(1)),
      Br: Number(Br.toFixed(3)),
      Ms: Number(Ms.toFixed(3)),
      lossJm3: activeMat.loopAreaJm3,
    };
  }, [areas, demagnetizationN, g0Factor, u0Factor, croGainX, croGainY, activeMat]);

  // 60 FPS CRO Oscilloscope Canvas Simulator
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      phase += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Vintage phosphor CRT face
      ctx.fillStyle = '#02120a';
      ctx.fillRect(0, 0, width, height);

      // CRT Graticule Grid (8x10 Divisions)
      const gridCols = 10;
      const gridRows = 8;
      const stepX = width / gridCols;
      const stepY = height / gridRows;

      ctx.strokeStyle = '#05331a';
      ctx.lineWidth = 1;

      for (let x = 0; x <= width; x += stepX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += stepY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center Major Axes with subdivision tick marks
      ctx.strokeStyle = '#0b5930';
      ctx.lineWidth = 1.5;
      const midX = width / 2;
      const midY = height / 2;

      ctx.beginPath();
      ctx.moveTo(midX, 0);
      ctx.lineTo(midX, height);
      ctx.moveTo(0, midY);
      ctx.lineTo(width, midY);
      ctx.stroke();

      // Sub-ticks
      for (let px = 0; px <= width; px += stepX / 5) {
        ctx.beginPath();
        ctx.moveTo(px, midY - 3);
        ctx.lineTo(px, midY + 3);
        ctx.stroke();
      }
      for (let py = 0; py <= height; py += stepY / 5) {
        ctx.beginPath();
        ctx.moveTo(midX - 3, py);
        ctx.lineTo(midX + 3, py);
        ctx.stroke();
      }

      // Dynamic Parametric B-H Hysteresis Curve Rendering
      // Using dual hyperbolic branches: B(H) = Bs * tanh((H ± Hc)/a)
      ctx.save();
      ctx.strokeStyle = '#22c55e';
      ctx.shadowColor = '#4ade80';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 2.5;

      const scaleX = (width / 2 - 40) * (croGainX / 1.0) * (driveCurrentAmps / 2.5);
      const scaleY = (height / 2 - 30) * (croGainY / 1.0);

      // Material loop constants
      const hcNorm = activeMat.type === 'soft' ? 0.22 : 0.52;
      const aParam = activeMat.type === 'soft' ? 0.40 : 0.65;

      // Draw Lower Ascending Branch (from -1 to +1)
      ctx.beginPath();
      for (let t = -1; t <= 1; t += 0.02) {
        const H = t;
        const B = Math.tanh((H - hcNorm) / aParam);
        const scrX = midX + H * scaleX;
        const scrY = midY - B * scaleY;
        if (t === -1) ctx.moveTo(scrX, scrY);
        else ctx.lineTo(scrX, scrY);
      }

      // Draw Upper Descending Branch (from +1 to -1)
      for (let t = 1; t >= -1; t -= 0.02) {
        const H = t;
        const B = Math.tanh((H + hcNorm) / aParam);
        const scrX = midX + H * scaleX;
        const scrY = midY - B * scaleY;
        ctx.lineTo(scrX, scrY);
      }
      ctx.closePath();
      ctx.stroke();

      // Fill Loop Area with faint phosphor glow
      ctx.fillStyle = 'rgba(34, 197, 94, 0.08)';
      ctx.fill();

      // Oscilloscope Sweep Trace Spot Animation
      const sweepT = Math.sin(phase);
      const sweepSign = Math.cos(phase) > 0 ? -1 : 1;
      const sweepB = Math.tanh((sweepT + sweepSign * hcNorm) / aParam);
      const spotX = midX + sweepT * scaleX;
      const spotY = midY - sweepB * scaleY;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(spotX, spotY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // CRT Status text HUD
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`CH1 (H-drive): ${(croGainX).toFixed(1)} V/div`, 20, 24);
      ctx.fillText(`CH2 (B-pickup): ${(croGainY).toFixed(1)} V/div`, 20, 40);
      ctx.fillText(`CORE: ${activeMat.name.toUpperCase()}`, width - 190, 24);
      ctx.fillText(`MODE: X-Y LISSAJOUS`, width - 190, 40);

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [croGainX, croGainY, driveCurrentAmps, activeMat]);

  const handleTriggerReport = () => {
    onGenerateReport({
      experimentId: 7,
      experimentTitle: 'Magnetic Hysteresis Loop (B-H Curve) on CRO',
      studentName: 'Shehzad',
      rollNumber: 'ENG-2024-PHYS01',
      date: new Date().toLocaleDateString(),
      aim: 'To trace the magnetic hysteresis loop of ferromagnetic materials on a CRO and evaluate coercivity (Hc), retentivity (Br), saturation magnetization (Ms), and energy loss.',
      apparatus: ['Hysteresis Loop Tracer', 'Magnetizing Solenoid', 'Pickup Coil Cell', 'Cathode Ray Oscilloscope (CRO)', 'Ferromagnetic Samples (Soft Iron / Carbon Steel)'],
      formulaLatex: 'H_c = \\frac{G_0 \\cdot e_x}{\\frac{A_s}{A_c} - N}, \\quad B_r = \\frac{G_0 \\cdot U_0 \\cdot g_x \\cdot E_{yr}}{g_y \\left(\\frac{A_s}{A_c} - N\\right) 4\\pi}, \\quad \\text{Loss} = \\oint H\\,dB',
      parameters: {
        'Tested Specimen': activeMat.name,
        'Sample Diameter': `${sampleDiameterMm} mm`,
        'Pickup Coil Diameter': `${coilDiameterMm} mm`,
        'Area Ratio (As/Ac)': `${areas.areaRatio.toFixed(3)}`,
        'Demagnetization N': `${demagnetizationN}`,
        'CRO Gain X / Y': `${croGainX} / ${croGainY}`,
      },
      readings: [
        {
          'Specimen': activeMat.name,
          'Loop Width (2ex)': `${computedParams.ex_mm * 2} mm`,
          'Intercept (Eyr)': `${computedParams.Eyr_mm} mm`,
          'Tip Height (2Eys)': `${computedParams.Eys_mm * 2} mm`,
        },
      ],
      calculatedResults: {
        'Coercivity (Hc)': `${computedParams.Hc} A/m`,
        'Retentivity (Br)': `${computedParams.Br} Tesla`,
        'Saturation (Ms)': `${computedParams.Ms} Tesla`,
        'Hysteresis Loss': `${computedParams.lossJm3} J/m³·cycle`,
      },
      conclusion: `The B-H hysteresis curve of ${activeMat.name} was successfully traced on the CRO in X-Y mode. The material exhibited coercivity Hc = ${computedParams.Hc} A/m and retentivity Br = ${computedParams.Br} T. Its hysteresis loss per cycle was evaluated as ${computedParams.lossJm3} J/m³.`,
    });
  };

  return (
    <div className="relative isolate space-y-6">
      <svg aria-hidden="true" className="pointer-events-none absolute right-2 top-1 z-10 h-24 w-24 text-emerald-500 opacity-[0.08]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 16v68h72" />
        <path d="M20 50c0-27 13-34 29-25s11 37 27 38 12-32 5-39S61 20 59 49s8 35 18 26" />
        <path d="M14 50h72M50 16v68" strokeDasharray="3 5" />
      </svg>
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Magnetism & Oscilloscope Metrology
          </div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            Ferromagnetic Hysteresis Loop (CRO) Bench
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Trace dynamic <KatexMath math="B-H" /> loops on a virtual cathode ray oscilloscope and evaluate coercivity <KatexMath math="H_c" />, retentivity <KatexMath math="B_r" />, and energy dissipation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setCroGainX(1.0);
              setCroGainY(1.0);
              setDriveCurrentAmps(2.5);
              setMaterialIndex(0);
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

      {/* 60 FPS CRO Display Canvas */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Magnet className="w-3.5 h-3.5 text-emerald-700" />
            Dual-Trace CRT Oscilloscope Screen (X-Y Mode @ 60 FPS)
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-600">
            <span className="text-emerald-700">Core: {activeMat.name}</span>
            <span className="text-cyan-700">Hc = {computedParams.Hc} A/m</span>
            <span className="text-amber-700">Br = {computedParams.Br} T</span>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          width={840}
          height={280}
          className="w-full h-[280px] block"
        />
      </div>

      {/* Controls & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Specimen & CRO Controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sliders className="w-4 h-4 text-emerald-700" />
            Core Material & CRO Knobs
          </div>

          <div>
            <label className="text-xs text-slate-600 mb-1.5 block">Select Core Material</label>
            <div className="grid grid-cols-2 gap-2">
              {FERROMAGNETIC_MATERIALS.map((m, idx) => (
                <button
                  key={m.name}
                  onClick={() => setMaterialIndex(idx)}
                  className={`p-2 rounded-xl text-left border text-xs transition-all ${
                    materialIndex === idx
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                      : 'bg-slate-50 border-slate-300 text-slate-600 hover:text-slate-700'
                  }`}
                >
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-[10px] text-slate-600">{m.type === 'soft' ? 'Narrow Loop' : 'Wide Loop'}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>X-Gain (gx)</span>
                <span className="text-slate-900 font-mono">{croGainX.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={croGainX}
                onChange={(e) => setCroGainX(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                <span>Y-Gain (gy)</span>
                <span className="text-slate-900 font-mono">{croGainY.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={2.0}
                step={0.1}
                value={croGainY}
                onChange={(e) => setCroGainY(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-600 mb-1">
              <span>Solenoid Drive Current (H-field)</span>
              <span className="text-slate-900 font-mono">{driveCurrentAmps.toFixed(1)} A</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={5.0}
              step={0.2}
              value={driveCurrentAmps}
              onChange={(e) => setDriveCurrentAmps(Number(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>

        {/* Observation & Calculations */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 md:col-span-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Table className="w-4 h-4 text-emerald-700" />
              Metrology Parameters & Solenoid Telemetry
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">Sample Diam (mm)</label>
              <input
                type="number"
                step={0.1}
                value={sampleDiameterMm}
                onChange={(e) => setSampleDiameterMm(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">Coil Diam (mm)</label>
              <input
                type="number"
                step={0.1}
                value={coilDiameterMm}
                onChange={(e) => setCoilDiameterMm(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">Demag Factor (N)</label>
              <input
                type="number"
                step={0.001}
                value={demagnetizationN}
                onChange={(e) => setDemagnetizationN(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">Area Ratio As/Ac</label>
              <div className="text-xs font-bold text-cyan-700 mt-2 font-mono">
                {areas.areaRatio.toFixed(3)}
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">Sample Length (mm)</label>
              <input
                type="number"
                step={1}
                value={sampleLengthMm}
                onChange={(e) => setSampleLengthMm(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">G0 Factor</label>
              <input
                type="number"
                step={0.05}
                value={g0Factor}
                onChange={(e) => setG0Factor(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[10px] text-slate-600 block mb-1">U0 Factor</label>
              <input
                type="number"
                step={0.05}
                value={u0Factor}
                onChange={(e) => setU0Factor(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs text-slate-900 font-mono"
              />
            </div>
          </div>

          {/* Results Metric Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Coercivity (Hc)</div>
              <div className="text-base font-bold text-emerald-700 mt-1 font-mono">
                {computedParams.Hc} <span className="text-xs text-slate-600">A/m</span>
              </div>
              <div className="text-[10px] text-slate-600">Demagnetizing Force</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Retentivity (Br)</div>
              <div className="text-base font-bold text-cyan-700 mt-1 font-mono">
                {computedParams.Br} <span className="text-xs text-slate-600">Tesla</span>
              </div>
              <div className="text-[10px] text-slate-600">Remanence @ H=0</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Saturation (Ms)</div>
              <div className="text-base font-bold text-amber-700 mt-1 font-mono">
                {computedParams.Ms} <span className="text-xs text-slate-600">Tesla</span>
              </div>
              <div className="text-[10px] text-slate-600">Peak Magnetization</div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-[11px] text-slate-600">Loop Energy Loss</div>
              <div className="text-base font-bold text-purple-700 mt-1 font-mono">
                {computedParams.lossJm3} <span className="text-xs text-slate-600">J/m³</span>
              </div>
              <div className="text-[10px] text-slate-600">∮ H·dB per Cycle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Theory & Formulation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
          <Info className="w-4 h-4 text-emerald-700" />
          Theory & Mathematical Formulation
        </h3>
        <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
          <p>
            When a ferromagnetic specimen is subjected to alternating magnetizing field in a solenoid, the magnetic flux density <KatexMath math="B" /> lags behind <KatexMath math="H" />. Connected to the CRO horizontal (X) and vertical (Y) channels, the loop displays:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="H_c = \frac{G_0 \cdot e_x}{\frac{A_s}{A_c} - N}, \quad B_r = \frac{G_0 \cdot U_0 \cdot g_x \cdot E_{yr}}{g_y \left(\frac{A_s}{A_c} - N\right) 4\pi}" block />
          </div>
          <p>
            The area of the hysteresis loop represents the thermal energy loss per unit volume of the specimen per magnetization cycle:
          </p>
          <div className="p-3 bg-slate-50 rounded-xl my-2 border border-slate-200 text-center">
            <KatexMath math="W_{\text{loss}} = \oint H\,dB \quad (\text{J/m}^3\cdot\text{cycle})" block />
          </div>
        </div>
      </div>
    </div>
  );
};
