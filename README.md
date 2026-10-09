# OmniLab Studio — Virtual Physics Laboratory & Scientific Simulation Suite

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![KaTeX Math](https://img.shields.io/badge/KaTeX-LaTeX_Rendering-00d084)](https://katex.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **An interactive, browser-based scientific computing and simulation workbench transforming undergraduate physics experiments into 60 FPS hardware-accelerated laboratory instruments with automated academic report generation.**

---

## 🌟 Overview & Evolution

Originally created during **1st Year B.Tech Computer Science Engineering**, this project began as console-based terminal programs in C++ (`cin`/`cout`) to automate manual lab calculations. 

**OmniLab Studio** evolves that foundation into a full-scale **Modern Scientific Web Application (SPA)** designed for engineering students, researchers, and EdTech applications. It combines:
1. **Interactive 60 FPS HTML5 Canvas Simulations**: Real-time visual instruments (Virtual Oscilloscope, Phototube Chamber, Laser Bench, Fiber Optic Ray Tracer).
2. **Computational Rigor**: Ordinary Least Squares (OLS) linear regression ($R^2$ fit scores), standard error analysis, and NIST CODATA physical constant validation.
3. **Automated Academic Lab Record Export**: One-click generation of university-standard laboratory records with LaTeX-typeset equations, apparatus lists, telemetry tables, and printable A4 formatting.
4. **Interactive Viva Voce Tutor**: Comprehensive theoretical question bank categorized by difficulty with flashcard self-assessment mode.

---

## 🔬 The 8 Laboratory Experiments

| # | Experiment Name | Domain | Interactive Simulation & Metrology | Key Governing Equation |
|---|---|---|---|---|
| **1** | **Laser Beam Divergence** | Wave Optics | Optical bench rail, Gaussian beam profile heatmap, spot diameter broadening detector. | $\theta = \frac{w_2 - w_1}{2(D_2 - D_1)} \quad \text{or} \quad \theta = \frac{\lambda}{\pi w_0}$ |
| **2** | **Dielectric Constant of Solid** | Electromagnetism | Parallel-plate capacitor cross-section, draggable dielectric slab (Mica, Glass, Teflon), bound electric field vectors. | $K = \frac{C_d}{C_0} = \frac{V_s \cdot C_s \cdot d_{av}}{V_d \cdot \varepsilon_0 \cdot \pi (D_{av}/2)^2}$ |
| **3** | **Diffraction Grating Element** | Physical Optics | Fraunhofer diffraction screen, multi-order interference spots ($m = 0, \pm 1, \pm 2, \pm 3$), spectral intensity profile $I(\theta)$. | $d = (a + b) = \frac{n \cdot \lambda}{\sin \theta_n}$ |
| **4** | **Photoelectric Effect (Planck's Constant)** | Quantum Mechanics | Vacuum phototube apparatus, photon-electron emission, retarding potential knob, live $V_0$ vs. $\nu$ linear regression chart. | $V_0 = \left(\frac{h}{e}\right)\nu - \frac{\Phi}{e} \implies h = e \cdot \frac{dV_0}{d\nu}$ |
| **5** | **Fiber Numerical Aperture (NA)** | Fiber Optics | Step-index fiber ray tracing, Total Internal Reflection (TIR), critical angle boundary, 3D acceptance cone projection. | $\text{NA} = \sin \theta_a = \frac{W/2}{\sqrt{(W/2)^2 + L^2}} = \sqrt{n_1^2 - n_2^2}$ |
| **6** | **Optical Fiber Attenuation & Losses** | Photonics & Telecom | Fiber spool link, traveling light pulse, logarithmic power decay curve ($P(z)$), cutback voltage ratio ($V_1 / V_2$). | $\alpha\,(\text{dB/km}) = \frac{20}{L_2 - L_1} \log_{10}\left(\frac{V_1}{V_2}\right)$ |
| **7** | **Magnetic Hysteresis Loop on CRO** | Magnetism | Vintage CRT oscilloscope display with green phosphor grid, Lissajous X-Y mode, soft iron vs. hard steel, loop energy loss area. | $H_c = \frac{G_0 \cdot e_x}{\frac{A_s}{A_c} - N}, \quad \text{Loss} = \oint H\,dB$ |
| **8** | **Ultrasonic Interferometer** | Acoustics | Piezoelectric quartz crystal transducer cell, acoustic standing waves, resonance current microammeter, adiabatic compressibility. | $v = 2f \cdot \left(\frac{x_{11} - x_1}{10}\right), \quad \beta_s = \frac{1}{\rho v^2}$ |

---

## 🏗️ Architecture & Technology Stack

```
physics-lab-studio/
├── docs/manuals/           # Preserved university PDF practical file manuals
├── legacy/                 # Preserved 1st-year C++ CLI programs (Exp 1 to Exp 8)
├── public/                 # Static assets & web manifest
├── src/
│   ├── components/
│   │   ├── common/         # KaTeX LaTeX formula rendering
│   │   ├── experiments/    # 8 Interactive 60 FPS laboratory workbenches
│   │   │   ├── Exp1Divergence.tsx
│   │   │   ├── Exp2Dielectric.tsx
│   │   │   ├── Exp3Diffraction.tsx
│   │   │   ├── Exp4Photoelectric.tsx
│   │   │   ├── Exp5NumericalAperture.tsx
│   │   │   ├── Exp6Attenuation.tsx
│   │   │   ├── Exp7Hysteresis.tsx
│   │   │   └── Exp8Ultrasonic.tsx
│   │   ├── layout/         # Responsive Navbar & category-grouped Sidebar
│   │   ├── report/         # Printable A4 Laboratory Practical Record Sheet
│   │   └── viva/           # Interactive AI Viva Voce Examiner & Study Tutor
│   ├── lib/
│   │   ├── constants.ts    # NIST CODATA constants, materials presets & viva DB
│   │   └── math/           # OLS linear regression, uncertainty propagation
│   ├── types/              # Comprehensive TypeScript interfaces
│   ├── App.tsx             # Root application orchestrator
│   ├── index.css           # Tailwind CSS v4 & KaTeX styling
│   └── main.tsx            # Application entrypoint
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Core Technologies
- **Frontend Framework:** React 19 + TypeScript (Strict mode enabled)
- **Bundler:** Vite 8 (Hot Module Replacement, blazing-fast production builds)
- **Styling:** Tailwind CSS v4 (Zero runtime overhead, modern CSS imports)
- **Graphics & Rendering:** HTML5 2D Canvas (60 FPS rendering loops, DPI auto-scaling)
- **Mathematical Typography:** KaTeX (Sub-millisecond LaTeX rendering for all physical derivations)
- **Icons:** Lucide React

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0 or newer)
- npm or pnpm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Shehzadchouhan/Physics-Practical-File.git

# Navigate into project directory
cd Physics-Practical-File

# Install dependencies
npm install
```

### Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
```
Generates an optimized production bundle in the `dist/` directory ready for deployment on **Vercel**, **Cloudflare Pages**, or **GitHub Pages**.

---

## 📄 Automated Report Generation

Clicking **"Generate Lab Report"** on any experiment compiles an academic laboratory record including:
- Candidate Name, Registration No., and Evaluation Date
- Experiment Aim and Required Apparatus
- LaTeX-typeset governing equations
- Live observation tables populated with measured data
- Calculated numerical parameters and percentage discrepancy against reference values
- Faculty and Candidate signature block for academic submissions
- Integrated **Print / Save as PDF** support optimized for standard A4 paper

---

## 💼 Portfolio & Resume Highlights

When presenting this project to recruiters, interviewers, or clients:
- **Demonstrates Complex State Management & Graphics:** Implements 8 customized 60 FPS Canvas visualizers rather than static CRUD interfaces.
- **Scientific Computing Competence:** Incorporates Ordinary Least Squares (OLS) linear regression, error propagation, and physical modeling.
- **Architectural Maturity:** Demonstrates how legacy academic software can be modernized into a scalable, production-grade web application.

---

## 👨‍💻 Author & Acknowledgements

- **Developer:** [Shehzad Chouhan](mailto:shehzadchouhan260@gmail.com)
- **GitHub:** [@Shehzadchouhan](https://github.com/Shehzadchouhan)

*Developed with passion for applied physics, computer science, and modern web engineering.*
