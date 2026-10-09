import React from 'react';

interface ExperimentBackdropProps {
  activeExperimentId: number | 'index';
}

export const ExperimentBackdrop: React.FC<ExperimentBackdropProps> = ({ activeExperimentId }) => {
  // Color themes and metadata per experiment
  const themeConfig = {
    index: {
      primary: '#0284c7', // Sky / Blueprint
      secondary: '#06b6d4',
      bgGlow1: 'radial-gradient(circle at 15% 15%, rgba(6, 182, 212, 0.15), transparent 45%)',
      bgGlow2: 'radial-gradient(circle at 85% 85%, rgba(2, 132, 199, 0.12), transparent 50%)',
    },
    1: { // Laser Divergence
      primary: '#ef4444', // Ruby Red
      secondary: '#f43f5e',
      bgGlow1: 'radial-gradient(circle at 20% 20%, rgba(239, 68, 68, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 80% 60%, rgba(244, 63, 94, 0.12), transparent 55%)',
    },
    2: { // Dielectric Constant
      primary: '#f59e0b', // Amber / Gold
      secondary: '#d97706',
      bgGlow1: 'radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 25% 75%, rgba(217, 119, 6, 0.10), transparent 55%)',
    },
    3: { // Diffraction Grating
      primary: '#8b5cf6', // Violet
      secondary: '#a855f7',
      bgGlow1: 'radial-gradient(circle at 30% 30%, rgba(139, 92, 246, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 70% 80%, rgba(168, 85, 247, 0.12), transparent 55%)',
    },
    4: { // Photoelectric Effect
      primary: '#06b6d4', // Cyan / Quantum
      secondary: '#0284c7',
      bgGlow1: 'radial-gradient(circle at 15% 40%, rgba(6, 182, 212, 0.15), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 85% 20%, rgba(2, 132, 199, 0.12), transparent 50%)',
    },
    5: { // Fiber Numerical Aperture
      primary: '#f43f5e', // Rose
      secondary: '#fb7185',
      bgGlow1: 'radial-gradient(circle at 70% 30%, rgba(244, 63, 94, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 20% 70%, rgba(251, 113, 133, 0.10), transparent 55%)',
    },
    6: { // Fiber Attenuation
      primary: '#2563eb', // Royal Blue
      secondary: '#3b82f6',
      bgGlow1: 'radial-gradient(circle at 25% 25%, rgba(37, 99, 235, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.12), transparent 55%)',
    },
    7: { // Hysteresis Loop CRO
      primary: '#10b981', // Phosphor Emerald Green
      secondary: '#059669',
      bgGlow1: 'radial-gradient(circle at 80% 25%, rgba(16, 185, 129, 0.15), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 20% 80%, rgba(5, 150, 105, 0.12), transparent 55%)',
    },
    8: { // Ultrasonic Interferometer
      primary: '#0ea5e9', // Sonar Sky Blue
      secondary: '#0284c7',
      bgGlow1: 'radial-gradient(circle at 35% 20%, rgba(14, 165, 233, 0.14), transparent 50%)',
      bgGlow2: 'radial-gradient(circle at 65% 85%, rgba(2, 132, 199, 0.12), transparent 55%)',
    },
  };

  const currentTheme = typeof activeExperimentId === 'number'
    ? (themeConfig[activeExperimentId as keyof typeof themeConfig] || themeConfig.index)
    : themeConfig.index;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000 ease-in-out print:hidden"
    >
      {/* Dynamic Ambient Glow Layer 1 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ background: currentTheme.bgGlow1 }}
      />

      {/* Dynamic Ambient Glow Layer 2 */}
      <div
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
        style={{ background: currentTheme.bgGlow2 }}
      />

      {/* Subtle Engineering Grid Backdrop */}
      <div
        className="absolute inset-0 opacity-[0.035] transition-opacity duration-700"
        style={{
          backgroundImage: `linear-gradient(${currentTheme.primary} 1px, transparent 1px), linear-gradient(90deg, ${currentTheme.primary} 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Vector Watermarks Specific to Current Experiment */}
      <div className="absolute inset-0 flex items-center justify-center opacity-70 transition-all duration-700">
        {/* INDEX PAGE: Architectural Compass & Physics Constellation */}
        {activeExperimentId === 'index' && (
          <svg className="w-full h-full text-cyan-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Coordinate Grid & Circles */}
            <circle cx="600" cy="400" r="340" strokeWidth="1" strokeDasharray="6 6" />
            <circle cx="600" cy="400" r="220" strokeWidth="1.2" />
            <circle cx="600" cy="400" r="100" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="100" y1="400" x2="1100" y2="400" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="600" y1="50" x2="600" y2="750" strokeWidth="1" strokeDasharray="4 4" />

            {/* Orbiting Atomic Rings */}
            <ellipse cx="600" cy="400" rx="380" ry="120" strokeWidth="1" transform="rotate(30 600 400)" />
            <ellipse cx="600" cy="400" rx="380" ry="120" strokeWidth="1" transform="rotate(-30 600 400)" />
            <ellipse cx="600" cy="400" rx="380" ry="120" strokeWidth="1" transform="rotate(90 600 400)" />

            {/* Formula Watermark Text */}
            <text x="850" y="240" fill="currentColor" fontSize="24" fontFamily="monospace" opacity="0.6">
              ∇ × E = -∂B/∂t
            </text>
            <text x="180" y="620" fill="currentColor" fontSize="24" fontFamily="monospace" opacity="0.6">
              E = hν = hc/λ
            </text>
            <text x="880" y="650" fill="currentColor" fontSize="24" fontFamily="monospace" opacity="0.6">
              NA = √(n₁² - n₂²)
            </text>
          </svg>
        )}

        {/* EXP 1: Laser Divergence & Gaussian Beam Profile */}
        {activeExperimentId === 1 && (
          <svg className="w-full h-full text-red-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Laser Aperture & Diverging Beam Rays */}
            <circle cx="160" cy="400" r="32" strokeWidth="2" />
            <circle cx="160" cy="400" r="12" strokeWidth="1.5" />
            <path d="M 160 380 Q 500 320 1100 180" strokeWidth="2" strokeDasharray="8 6" />
            <path d="M 160 420 Q 500 480 1100 620" strokeWidth="2" strokeDasharray="8 6" />
            <line x1="160" y1="400" x2="1100" y2="400" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Expanding Gaussian Spot Circles */}
            <ellipse cx="450" cy="400" rx="35" ry="70" strokeWidth="1.2" />
            <ellipse cx="750" cy="400" rx="60" ry="130" strokeWidth="1.5" />
            <ellipse cx="1050" cy="400" rx="95" ry="210" strokeWidth="2" />

            {/* Formula Watermark */}
            <text x="750" y="220" fill="currentColor" fontSize="28" fontFamily="monospace" opacity="0.7">
              θ = (w₂ - w₁) / 2(D₂ - D₁)
            </text>
            <text x="750" y="260" fill="currentColor" fontSize="20" fontFamily="monospace" opacity="0.6">
              w(z) = w₀√(1 + (z/z_R)²)
            </text>
            <text x="220" y="360" fill="currentColor" fontSize="20" fontFamily="monospace" opacity="0.5">
              He-Ne λ = 632.8 nm
            </text>
          </svg>
        )}

        {/* EXP 2: Dielectric Constant & Parallel Plate Capacitor */}
        {activeExperimentId === 2 && (
          <svg className="w-full h-full text-amber-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Parallel Capacitor Plates */}
            <rect x="250" y="160" width="700" height="40" rx="8" strokeWidth="2" />
            <rect x="250" y="600" width="700" height="40" rx="8" strokeWidth="2" />

            {/* Dielectric Slab inserted */}
            <rect x="420" y="240" width="380" height="320" rx="12" strokeWidth="2.5" strokeDasharray="6 6" />

            {/* Electric Field Flux Lines */}
            {[320, 420, 520, 600, 680, 780, 880].map((x, i) => (
              <g key={i}>
                <line x1={x} y1="200" x2={x} y2="600" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d={`M ${x-6} 410 L ${x} 425 L ${x+6} 410`} strokeWidth="1.5" fill="none" />
              </g>
            ))}

            {/* Charge Dipoles (+ and -) */}
            <text x="320" y="185" fill="currentColor" fontSize="22" fontWeight="bold">++++++++++++++</text>
            <text x="320" y="628" fill="currentColor" fontSize="22" fontWeight="bold">--------------</text>

            {/* Formula Watermark */}
            <text x="750" y="290" fill="currentColor" fontSize="28" fontFamily="monospace" opacity="0.7">
              K = C_d / C₀ = ε_r
            </text>
            <text x="750" y="330" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              C₀ = (ε₀ · A) / d
            </text>
          </svg>
        )}

        {/* EXP 3: Diffraction Grating & Fraunhofer Fringes */}
        {activeExperimentId === 3 && (
          <svg className="w-full h-full text-purple-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Transmission Grating Slits */}
            <rect x="220" y="250" width="30" height="300" rx="4" strokeWidth="2" />
            {[270, 310, 350, 390, 430, 470, 510].map((y, i) => (
              <line key={i} x1="220" y1={y} x2="250" y2={y} strokeWidth="2" />
            ))}

            {/* Diffracted Beams (m = 0, +1, -1, +2, -2) */}
            <line x1="250" y1="400" x2="1050" y2="400" strokeWidth="2" />
            <line x1="250" y1="400" x2="1050" y2="220" strokeWidth="1.5" />
            <line x1="250" y1="400" x2="1050" y2="580" strokeWidth="1.5" />
            <line x1="250" y1="400" x2="1050" y2="90" strokeWidth="1.2" strokeDasharray="5 5" />
            <line x1="250" y1="400" x2="1050" y2="710" strokeWidth="1.2" strokeDasharray="5 5" />

            {/* Observation Screen & Intensity Profile Peak curve */}
            <line x1="1050" y1="60" x2="1050" y2="740" strokeWidth="3" />
            <path
              d="M 1050 400 C 950 400 950 380 900 400 C 950 420 950 400 1050 400"
              strokeWidth="2"
            />

            {/* Formula Watermark */}
            <text x="600" y="160" fill="currentColor" fontSize="30" fontFamily="monospace" opacity="0.7">
              d · sin(θ) = n · λ
            </text>
            <text x="600" y="200" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              d = 1 / N  (lines/cm)
            </text>
          </svg>
        )}

        {/* EXP 4: Photoelectric Effect & Vacuum Phototube */}
        {activeExperimentId === 4 && (
          <svg className="w-full h-full text-cyan-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Vacuum Glass Envelope Bulb */}
            <circle cx="500" cy="400" r="260" strokeWidth="2" />

            {/* Cathode & Anode */}
            <path d="M 360 260 Q 340 400 360 540" strokeWidth="4" />
            <line x1="640" y1="300" x2="640" y2="500" strokeWidth="3" />

            {/* Photon Wave-packet sine waves hitting cathode */}
            <path
              d="M 120 280 Q 150 250 180 280 T 240 280 T 300 280 L 350 320"
              strokeWidth="2.5"
            />
            <path
              d="M 120 400 Q 150 370 180 400 T 240 400 T 300 400 L 350 400"
              strokeWidth="2.5"
            />

            {/* Ejected Electron trails */}
            {[340, 390, 440, 480].map((y, i) => (
              <circle key={i} cx={420 + i * 50} cy={y} r="5" fill="currentColor" />
            ))}

            {/* Linear Regression Plot Watermark on Right */}
            <line x1="820" y1="580" x2="1120" y2="580" strokeWidth="2" />
            <line x1="820" y1="580" x2="820" y2="220" strokeWidth="2" />
            <line x1="820" y1="520" x2="1100" y2="250" strokeWidth="2.5" strokeDasharray="6 4" />

            {/* Formula Watermark */}
            <text x="780" y="160" fill="currentColor" fontSize="30" fontFamily="monospace" opacity="0.7">
              eV₀ = hν - Φ
            </text>
            <text x="780" y="200" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              h = 6.626 × 10⁻³⁴ J·s
            </text>
          </svg>
        )}

        {/* EXP 5: Optical Fiber Numerical Aperture */}
        {activeExperimentId === 5 && (
          <svg className="w-full h-full text-rose-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Fiber Core & Cladding */}
            <rect x="150" y="260" width="500" height="280" rx="8" strokeWidth="1.5" />
            <rect x="150" y="320" width="500" height="160" strokeWidth="2" />

            {/* Total Internal Reflection (TIR) Zigzag Rays */}
            <path
              d="M 150 400 L 250 320 L 370 480 L 490 320 L 610 480 L 650 400"
              strokeWidth="2.5"
            />

            {/* Acceptance Cone Projection */}
            <polygon points="650,400 1080,180 1080,620" strokeWidth="1.5" strokeDasharray="6 6" />
            <ellipse cx="1080" cy="400" rx="35" ry="220" strokeWidth="2" />

            {/* Formula Watermark */}
            <text x="720" y="230" fill="currentColor" fontSize="30" fontFamily="monospace" opacity="0.7">
              NA = sin(θ_a) = √(n₁² - n₂²)
            </text>
            <text x="720" y="270" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              θ_c = arcsin(n₂ / n₁)
            </text>
          </svg>
        )}

        {/* EXP 6: Fiber Attenuation & Losses */}
        {activeExperimentId === 6 && (
          <svg className="w-full h-full text-blue-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Concentric Fiber Spool Windings */}
            <circle cx="320" cy="400" r="220" strokeWidth="2" />
            <circle cx="320" cy="400" r="180" strokeWidth="1.5" />
            <circle cx="320" cy="400" r="140" strokeWidth="1.2" />
            <circle cx="320" cy="400" r="100" strokeWidth="1.5" />
            <circle cx="320" cy="400" r="60" strokeWidth="2" />

            {/* Logarithmic Power Decay Curve on Right */}
            <line x1="620" y1="580" x2="1100" y2="580" strokeWidth="2" />
            <line x1="620" y1="580" x2="620" y2="200" strokeWidth="2" />
            <path
              d="M 620 240 Q 750 480 1080 560"
              strokeWidth="3"
            />

            {/* Formula Watermark */}
            <text x="680" y="160" fill="currentColor" fontSize="30" fontFamily="monospace" opacity="0.7">
              α = (20 / ΔL) · log₁₀(V₁ / V₂)
            </text>
            <text x="680" y="200" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              α (dB/km) = 4.343 · α (km⁻¹)
            </text>
          </svg>
        )}

        {/* EXP 7: Hysteresis Loop on CRO */}
        {activeExperimentId === 7 && (
          <svg className="w-full h-full text-emerald-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* CRT Screen Circular Bezel */}
            <circle cx="600" cy="400" r="320" strokeWidth="2" />
            <circle cx="600" cy="400" r="300" strokeWidth="1" strokeDasharray="8 6" />

            {/* CRO 8x10 Graticule Grid */}
            <line x1="300" y1="400" x2="900" y2="400" strokeWidth="1.8" />
            <line x1="600" y1="100" x2="600" y2="700" strokeWidth="1.8" />
            {[-200, -100, 100, 200].map((delta) => (
              <React.Fragment key={delta}>
                <line x1={300} y1={400 + delta} x2={900} y2={400 + delta} strokeWidth="0.8" strokeDasharray="3 3" />
                <line x1={600 + delta} y1={100} x2={600 + delta} y2={700} strokeWidth="0.8" strokeDasharray="3 3" />
              </React.Fragment>
            ))}

            {/* Classic B-H Hysteresis Loop Curve */}
            <path
              d="M 400 520 C 420 540 500 560 620 400 C 720 260 780 260 800 280 C 780 260 700 240 580 400 C 480 540 420 540 400 520 Z"
              strokeWidth="3.5"
            />

            {/* Formula Watermark */}
            <text x="860" y="160" fill="currentColor" fontSize="28" fontFamily="monospace" opacity="0.7">
              Loss = ∮ H · dB
            </text>
            <text x="860" y="200" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              H_c (Coercivity)
            </text>
            <text x="860" y="235" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              B_r (Retentivity)
            </text>
          </svg>
        )}

        {/* EXP 8: Ultrasonic Interferometer */}
        {activeExperimentId === 8 && (
          <svg className="w-full h-full text-sky-600/10" viewBox="0 0 1200 800" fill="none" stroke="currentColor">
            {/* Concentric Acoustic Sonar Wavefronts */}
            <circle cx="280" cy="400" r="100" strokeWidth="1.2" />
            <circle cx="280" cy="400" r="170" strokeWidth="1.5" />
            <circle cx="280" cy="400" r="240" strokeWidth="1.8" />
            <circle cx="280" cy="400" r="310" strokeWidth="2" strokeDasharray="6 4" />

            {/* Acoustic Stationary Standing Wave Nodes (Sine envelope) */}
            <path
              d="M 540 400 Q 600 280 660 400 Q 720 520 780 400 Q 840 280 900 400 Q 960 520 1020 400 Q 1080 280 1140 400"
              strokeWidth="2.5"
            />
            <path
              d="M 540 400 Q 600 520 660 400 Q 720 280 780 400 Q 840 520 900 400 Q 960 280 1020 400 Q 1080 520 1140 400"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />

            {/* Formula Watermark */}
            <text x="680" y="160" fill="currentColor" fontSize="30" fontFamily="monospace" opacity="0.7">
              v = f · λ = 2f · Δd
            </text>
            <text x="680" y="200" fill="currentColor" fontSize="22" fontFamily="monospace" opacity="0.6">
              β_s = 1 / (ρ · v²)
            </text>
            <text x="680" y="240" fill="currentColor" fontSize="20" fontFamily="monospace" opacity="0.5">
              Quartz f = 2.0 MHz
            </text>
          </svg>
        )}
      </div>
    </div>
  );
};
