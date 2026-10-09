import type { ExperimentMeta, VivaQuestion } from '../types/physics';

// Standard Physical Constants (NIST CODATA recommended values)
export const PHYSICAL_CONSTANTS = {
  h: 6.62607015e-34,         // Planck constant (J·s)
  h_eV: 4.135667696e-15,     // Planck constant (eV·s)
  c: 2.99792458e8,           // Speed of light in vacuum (m/s)
  e: 1.602176634e-19,        // Elementary charge (C)
  m_e: 9.1093837015e-31,     // Electron rest mass (kg)
  epsilon_0: 8.8541878128e-12, // Permittivity of free space (F/m)
  mu_0: 1.25663706212e-6,    // Permeability of free space (H/m = 4π × 10^-7)
  pi: Math.PI,
};

export const EXPERIMENTS: ExperimentMeta[] = [
  {
    id: 1,
    slug: 'laser-divergence',
    title: 'Experiment 1: Measurement of Laser Beam Divergence',
    shortTitle: 'Laser Divergence',
    category: 'Optics',
    aim: 'To determine the angle of divergence (θ) of a semiconductor/He-Ne laser beam by measuring spot diameters at varying axial distances.',
    apparatus: ['Semiconductor / He-Ne Laser Source', 'Precision Optical Bench Rail', 'Movable Screen with Graph Scale', 'Vernier Calipers'],
    formulaSummary: 'θ = (w2 - w1) / (2 · (D2 - D1)) or Gaussian far-field relation',
    standardFormulaLatex: '\\theta = \\frac{w_2 - w_1}{2(D_2 - D_1)} \\quad \\text{or} \\quad \\theta = \\frac{\\lambda}{\\pi w_0}',
    acceptedValueText: 'Typically 1.0 - 3.5 mrad for typical diode lasers',
    iconName: 'Laser',
  },
  {
    id: 2,
    slug: 'dielectric-constant',
    title: 'Experiment 2: Determination of Dielectric Constant of a Solid Sample',
    shortTitle: 'Dielectric Constant',
    category: 'Electromagnetism',
    aim: 'To find the dielectric constant (relative permittivity K) of given solid dielectric specimens using the parallel-plate substitution capacitance technique.',
    apparatus: ['Dielectric Test Cell & Parallel Plates', 'Standard Capacitor (Cs)', 'High-Frequency AC Signal Generator', 'Digital AC Millivoltmeter', 'Screw Gauge', 'Vernier Calipers'],
    formulaSummary: 'K = Cd / C0 where C0 = ε0·A / d and Cd = (Vs · Cs) / Vd',
    standardFormulaLatex: 'K = \\frac{C_d}{C_0} = \\frac{V_s \\cdot C_s / V_d}{\\frac{\\varepsilon_0 \\cdot \\pi (D_{av}/2)^2}{d_{av}}}',
    acceptedValueText: 'Glass: 5.5 - 7.5, Mica: 5.4 - 6.0, Bakelite: 4.5 - 5.5',
    iconName: 'Layers',
  },
  {
    id: 3,
    slug: 'diffraction-grating',
    title: 'Experiment 3: Diffraction of Laser Beam & Grating Element Determination',
    shortTitle: 'Diffraction Grating',
    category: 'Optics',
    aim: 'To observe Fraunhofer diffraction of a laser beam through a transmission diffraction grating and evaluate the grating element (d) and lines/cm.',
    apparatus: ['He-Ne / Diode Laser Bench (λ = 632.8 nm)', 'Diffraction Grating (e.g. 500 lines/mm)', 'Screen with Metric Scale', 'Stands & Mounts'],
    formulaSummary: '(a + b) sin(θ) = n · λ => d = n · λ / sin(θ)',
    standardFormulaLatex: 'd = (a + b) = \\frac{n \\cdot \\lambda}{\\sin \\theta_n} \\quad \\text{where} \\quad \\tan \\theta_n = \\frac{y_n}{D}',
    acceptedValueText: 'Grating element d = 1 / N (e.g., 2.0 × 10^-6 m for 500 lines/mm)',
    iconName: 'SunMedium',
  },
  {
    id: 4,
    slug: 'photoelectric-effect',
    title: "Experiment 4: Determination of Planck's Constant & Work Function",
    shortTitle: "Planck's Constant",
    category: 'Quantum',
    aim: "To determine Planck's constant (h) and the work function (Φ) of a photosensitive metal cathode using the photoelectric effect and stopping potential linear regression.",
    apparatus: ['Photoelectric Apparatus with Vacuum Phototube', 'Monochromatic Spectral Filters / Variable Wavelength Source', 'Variable Regulated DC Power Supply', 'High-Sensitivity Digital Pico-ammeter / Voltmeter'],
    formulaSummary: 'eV0 = hν - Φ => V0 = (h/e)ν - (Φ/e)',
    standardFormulaLatex: 'V_0 = \\left(\\frac{h}{e}\\right) \\nu - \\frac{\\Phi}{e} \\implies h = e \\cdot (\\text{Slope}), \\quad \\Phi = e \\cdot (\\text{Y-Intercept})',
    acceptedValueText: 'NIST Standard h = 6.62607 × 10^-34 J·s',
    iconName: 'Atom',
  },
  {
    id: 5,
    slug: 'numerical-aperture',
    title: 'Experiment 5: Numerical Aperture & Acceptance Angle of an Optical Fiber',
    shortTitle: 'Numerical Aperture',
    category: 'Optics',
    aim: 'To measure the numerical aperture (NA) and the acceptance angle (θa) of a step-index multimode optical fiber.',
    apparatus: ['Fiber Optic Trainer Kit with 660nm / 850nm LED / Laser Diode', 'Step-Index Multimode Optical Fiber (1m / 2m)', 'Screen / Target with Concentric Measurement Circles', 'Scale Rail'],
    formulaSummary: 'NA = sin(θa) = (W / 2) / sqrt((W/2)^2 + L^2)',
    standardFormulaLatex: '\\text{NA} = \\sin \\theta_a = \\frac{r}{\\sqrt{r^2 + L^2}} = \\sqrt{n_1^2 - n_2^2}',
    acceptedValueText: 'Typical glass fiber NA: 0.15 - 0.25; Plastic fiber: 0.45 - 0.50',
    iconName: 'Cable',
  },
  {
    id: 6,
    slug: 'fiber-attenuation',
    title: 'Experiment 6: Attenuation and Propagation Losses in Optical Fiber',
    shortTitle: 'Fiber Attenuation',
    category: 'Optics',
    aim: 'To measure the attenuation coefficient (α) and propagation losses in optical fibers using the two-length transmission (cutback) method.',
    apparatus: ['Fiber Optic Transmission Transmitter (Tx) & Receiver (Rx)', 'Optical Power Meter / Digital Multimeter', 'Calibrated Optical Fibers (Length L1 and L2)', 'Optical Connectors'],
    formulaSummary: 'α (dB/km) = (10 / (L2 - L1)) · log10(P1 / P2)',
    standardFormulaLatex: '\\alpha\\,(\\text{dB/km}) = \\frac{10}{L_2 - L_1} \\log_{10}\\left(\\frac{P_1}{P_2}\\right) = \\frac{20}{L_2 - L_1} \\log_{10}\\left(\\frac{V_1}{V_2}\\right)',
    acceptedValueText: 'Single-mode silica: 0.2 - 0.4 dB/km @ 1550nm; Multimode plastic: 50 - 150 dB/km',
    iconName: 'Activity',
  },
  {
    id: 7,
    slug: 'hysteresis-loop',
    title: 'Experiment 7: Magnetic Hysteresis Loop (B-H Curve) on CRO',
    shortTitle: 'Hysteresis Loop (CRO)',
    category: 'Electromagnetism',
    aim: 'To trace the magnetic hysteresis loop (B-H curve) of ferromagnetic specimens on a Cathode Ray Oscilloscope (CRO) and calculate coercivity (Hc), retentivity (Br), and hysteresis energy loss.',
    apparatus: ['Hysteresis Loop Tracer Unit', 'Magnetizing Solenoid with Pickup Coil', 'Dual-Trace Cathode Ray Oscilloscope (CRO)', 'Specimens (Soft Iron, Hard Steel, Ferrite)'],
    formulaSummary: 'Hc = Go · ex / (Area_Ratio - N), Br = (Go · Uo · gx · Eyr) / [gy(Area_Ratio - N) · 4π]',
    standardFormulaLatex: 'H_c = \\frac{G_0 \\cdot e_x}{\\frac{A_s}{A_c} - N}, \\quad B_r = \\frac{G_0 \\cdot U_0 \\cdot g_x \\cdot E_{yr}}{g_y \\left(\\frac{A_s}{A_c} - N\\right) 4\\pi}, \\quad \\text{Loss} = \\oint H\\,dB',
    acceptedValueText: 'Soft Iron: Low Hc (~100 A/m), High Br (~1.2 T), Small Loop Area',
    iconName: 'Magnet',
  },
  {
    id: 8,
    slug: 'ultrasonic-interferometer',
    title: 'Experiment 8: Velocity of Ultrasonic Waves in Liquids via Interferometer',
    shortTitle: 'Ultrasonic Interferometer',
    category: 'Acoustics',
    aim: 'To determine the velocity of ultrasonic waves in a given liquid medium using an ultrasonic interferometer and evaluate its adiabatic compressibility (βs).',
    apparatus: ['High-Frequency Ultrasonic Interferometer Cell (2 MHz)', 'Piezoelectric Quartz Crystal Transducer', 'RF High-Frequency Oscillator', 'Sensitive Microammeter', 'Micrometer Screw Gauge (0.01 mm)', 'Test Liquids'],
    formulaSummary: 'λ = 2·d => v = f · λ and βs = 1 / (ρ · v^2)',
    standardFormulaLatex: '\\lambda = 2 \\cdot \\Delta d, \\quad v = f \\cdot \\lambda = 2 f \\cdot \\Delta d, \\quad \\beta_s = \\frac{1}{\\rho v^2}',
    acceptedValueText: 'Distilled Water @ 25°C: ~1498 m/s, Castor Oil: ~1490 m/s, Ethanol: ~1160 m/s',
    iconName: 'Radio',
  },
];

export const VIVA_QUESTIONS_DB: Record<number, VivaQuestion[]> = {
  1: [
    {
      question: 'What is meant by the divergence of a laser beam?',
      answer: 'Beam divergence is the angular spread of the laser beam as it propagates into the far-field away from the beam waist. It is measured as the angle between the opposite edges of the beam cross-section where intensity drops to 1/e² of its peak.',
      difficulty: 'Basic',
    },
    {
      question: 'Why does a laser beam have such low divergence compared to ordinary light?',
      answer: 'Laser light is spatially coherent and generated within an optical resonator cavity that enforces a single transverse electromagnetic mode (TEM00). Ordinary light sources are incoherent and emit randomly in all directions.',
      difficulty: 'Conceptual',
    },
    {
      question: 'What is the Rayleigh range (zR) of a Gaussian beam?',
      answer: 'The Rayleigh range is the distance along the propagation direction from the beam waist where the beam cross-sectional area doubles, or the beam radius increases by a factor of √2. zR = π · w0² / λ.',
      difficulty: 'Advanced',
    },
  ],
  2: [
    {
      question: 'What is dielectric constant (relative permittivity)?',
      answer: 'It is the ratio of the permittivity of the dielectric material (ε) to the permittivity of free space (ε0), or the ratio of capacitance with the dielectric (Cd) to capacitance in vacuum/air (C0): K = Cd / C0.',
      difficulty: 'Basic',
    },
    {
      question: 'Why does inserting a dielectric increase the capacitance of a capacitor?',
      answer: 'The external electric field polarizes the dielectric, creating bound surface charges of opposite sign. This induces an internal reverse electric field, reducing the net potential difference (V) for a given charge (Q), thus increasing C = Q/V.',
      difficulty: 'Conceptual',
    },
    {
      question: 'What is dielectric loss and dielectric breakdown?',
      answer: 'Dielectric loss is the dissipation of electrical energy as heat in an alternating field due to molecular dipole friction. Dielectric breakdown occurs when the electric field exceeds the dielectric strength, causing permanent electrical conduction.',
      difficulty: 'Advanced',
    },
  ],
  3: [
    {
      question: 'What is a diffraction grating?',
      answer: 'A diffraction grating is an optical component comprising a periodic assembly of many equally spaced transmitting or reflecting slits that disperses incident polychromatic or monochromatic light into discrete diffraction orders.',
      difficulty: 'Basic',
    },
    {
      question: 'What is the grating element and how is it related to lines per inch/cm?',
      answer: 'The grating element d = a + b is the sum of the transparent slit width (a) and opaque space (b). If a grating has N lines per centimeter, the grating element is d = 1 / N cm.',
      difficulty: 'Conceptual',
    },
    {
      question: 'What is the condition for missing / absent orders in a grating spectra?',
      answer: 'When a diffraction maximum condition (a + b) sin θ = nλ coincides with a single-slit diffraction minimum condition a sin θ = mλ, that order n = m(a + b)/a is completely extinguished.',
      difficulty: 'Advanced',
    },
  ],
  4: [
    {
      question: 'What is the stopping potential in the photoelectric effect?',
      answer: 'Stopping potential (V0) is the negative retarding potential applied to the anode relative to the cathode that reduces the photocurrent to zero, corresponding to the maximum kinetic energy of the emitted photoelectrons: eV0 = Kmax.',
      difficulty: 'Basic',
    },
    {
      question: 'Why does stopping potential depend on frequency but not on light intensity?',
      answer: 'Each electron absorbs energy from a single photon (E = hν). Higher frequency means each photon carries more energy, producing faster electrons requiring higher stopping potential. Higher intensity only increases photon flux (current), not individual photon energy.',
      difficulty: 'Conceptual',
    },
    {
      question: 'How do you derive Planck’s constant and work function from the V0 vs ν graph?',
      answer: 'From Einstein’s photoelectric equation V0 = (h/e)ν - (Φ/e), the slope m = h/e, so h = m · e. The y-intercept c = -Φ/e, so work function Φ = -c · e (or -c in eV). The x-intercept gives threshold frequency ν0.',
      difficulty: 'Advanced',
    },
  ],
  5: [
    {
      question: 'What is the Numerical Aperture (NA) of an optical fiber?',
      answer: 'Numerical Aperture is a dimensionless figure of merit that quantifies the light-gathering capability of an optical fiber. It is defined as the sine of the maximum acceptance angle: NA = sin(θa) = √(n1² - n2²).',
      difficulty: 'Basic',
    },
    {
      question: 'What is Total Internal Reflection (TIR) and the critical angle?',
      answer: 'TIR occurs when light propagating in an optically denser medium (core, n1) strikes the interface of a rarer medium (cladding, n2) at an angle of incidence greater than the critical angle θc = arcsin(n2 / n1).',
      difficulty: 'Conceptual',
    },
    {
      question: 'What is the difference between single-mode and multimode optical fibers?',
      answer: 'Single-mode fibers have tiny core diameters (~8-10 µm) allowing only one fundamental propagation mode, eliminating intermodal dispersion. Multimode fibers have larger cores (50-62.5 µm) supporting hundreds of spatial modes but suffering higher dispersion.',
      difficulty: 'Advanced',
    },
  ],
  6: [
    {
      question: 'What causes signal attenuation in an optical fiber?',
      answer: 'Attenuation is caused primarily by Rayleigh scattering (microscopic density fluctuations), intrinsic/extrinsic material absorption (OH- ion impurities, metallic ions), and macro/micro-bending radiation losses.',
      difficulty: 'Basic',
    },
    {
      question: 'Why is fiber attenuation measured in dB/km?',
      answer: 'Signal power decays exponentially with distance: P(z) = P0 · e^(-αz). Expressing loss logarithmically in decibels per kilometer (dB/km) converts multiplicative attenuations of cascaded fiber sections into simple addition.',
      difficulty: 'Conceptual',
    },
    {
      question: 'What are the standard optical communication transmission windows and why?',
      answer: 'The three primary windows are 850 nm (first generation GaAs lasers), 1310 nm (zero-dispersion wavelength in standard silica fiber), and 1550 nm (minimum attenuation window ~0.2 dB/km, compatible with Erbium-Doped Fiber Amplifiers/EDFA).',
      difficulty: 'Advanced',
    },
  ],
  7: [
    {
      question: 'What is magnetic hysteresis and a B-H curve?',
      answer: 'Magnetic hysteresis is the lagging of magnetic flux density (B) behind the applied magnetizing field (H) in a ferromagnetic material due to domain wall friction and pinning during cyclic magnetization.',
      difficulty: 'Basic',
    },
    {
      question: 'Define Retentivity (Br) and Coercivity (Hc).',
      answer: 'Retentivity (Br) is the residual magnetic flux density remaining in the material when the external field H is reduced to zero. Coercivity (Hc) is the reverse magnetic field required to demagnetize the material completely (reduce B to zero).',
      difficulty: 'Conceptual',
    },
    {
      question: 'What is the physical significance of the area enclosed by the B-H loop?',
      answer: 'The area of the hysteresis loop represents the thermal energy dissipated per unit volume of the ferromagnetic core per magnetization cycle (∮ H·dB). Transformer cores require narrow loops (Soft Iron) to minimize eddy and hysteresis heat losses.',
      difficulty: 'Advanced',
    },
  ],
  8: [
    {
      question: 'What is an ultrasonic interferometer and how does it work?',
      answer: 'It is a high-precision acoustic instrument that generates ultrasonic waves in a liquid column using an excited quartz piezoelectric transducer. Reflected waves from a movable metallic reflector form acoustic standing waves.',
      difficulty: 'Basic',
    },
    {
      question: 'Why does the anode current show periodic maxima and minima as the reflector moves?',
      answer: 'When the distance between the quartz crystal and the reflector is an integral multiple of half-wavelengths (n · λ/2), acoustic resonance produces standing wave nodes and antinodes. The mechanical impedance feedback changes electrical impedance across the crystal.',
      difficulty: 'Conceptual',
    },
    {
      question: 'How is adiabatic compressibility (βs) determined from acoustic velocity?',
      answer: 'Sound propagation in liquids is an adiabatic process. According to the Newton-Laplace equation, velocity v = √(1 / (ρ · βs)), which rearranges to βs = 1 / (ρ · v²), where ρ is the liquid density and v is the measured speed.',
      difficulty: 'Advanced',
    },
  ],
};
