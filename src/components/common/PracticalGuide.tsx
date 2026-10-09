import React, { useEffect } from 'react';
import { BookOpen, Check, X } from 'lucide-react';
import { EXPERIMENTS } from '../../lib/constants';

interface PracticalGuideProps {
  experimentId: number;
  onClose: () => void;
}

interface GuideContent {
  steps: string[];
  precautions: string[];
  readingTip: string;
}

const guideContent: Record<number, GuideContent> = {
  1: {
    steps: [
      'Place the laser and screen in line on the optical bench. Keep the beam level and pointed at the screen.',
      'Choose a laser colour, then set the beam waist and screen distance with the controls.',
      'Move the detector to several distances and record the corresponding spot diameter in the table.',
      'Compare spot diameter with distance, then use the calculated divergence angle and fit as your result.',
    ],
    precautions: [
      'Never look into the laser or point it at anyone. Keep the beam below eye level and use a screen to stop it.',
      'Keep the laser, ruler and screen aligned; measure from the same reference point each time.',
      'Use the same method to estimate the spot edges for every reading.',
    ],
    readingTip: 'Record the full spot diameter, not the radius. Use consistent units for all distances.',
  },
  2: {
    steps: [
      'Choose a dielectric material and set the source and detector voltages with the controls.',
      'Place the sample flat between the capacitor plates. Adjust the insertion fraction to match the practical setup.',
      'Measure and enter the sample diameter and thickness for repeated trials; the table calculates their averages.',
      'Review the calculated empty and sample capacitances, then compare the dielectric constant with the reference for that material.',
    ],
    precautions: [
      'Switch off or isolate the supply before changing the sample or touching the capacitor plates.',
      'Keep the plates parallel and the sample clean, dry and centred; avoid air gaps where possible.',
      'Do not overtighten the plates, as this can damage the sample or alter its thickness.',
    ],
    readingTip: 'Use the same plate spacing and instrument settings for reference and sample readings.',
  },
  3: {
    steps: [
      'Set up the laser, diffraction grating and screen in a straight line. Measure the grating-to-screen distance.',
      'Select the wavelength and grating setting in the controls, then observe the central and side maxima.',
      'Measure the distance from the central maximum to matching left and right diffraction orders.',
      'Enter the order, screen distance and fringe positions. Use the calculated grating element as the result.',
    ],
    precautions: [
      'Do not look directly into the laser beam; keep it pointed at the screen.',
      'Keep the grating upright and avoid touching its ruled surface.',
      'Measure symmetric orders from the centre and avoid mixing centimetres and metres.',
    ],
    readingTip: 'Use the same diffraction order on both sides; averaging left and right positions reduces alignment error.',
  },
  4: {
    steps: [
      'Choose the cathode metal and a monochromatic light wavelength. Set the light intensity to a suitable level.',
      'Adjust the retarding voltage until the photocurrent falls to zero; record the stopping potential.',
      'Repeat with several wavelengths, recording frequency and stopping potential for each spectral line.',
      'Use the graph or calculated fit to obtain Planck’s constant from the slope and the work function from the intercept.',
    ],
    precautions: [
      'Use only the specified lamp and filter settings; avoid staring at bright or ultraviolet sources.',
      'Change electrical connections only with the supply off, and do not exceed the apparatus voltage limits.',
      'Wait for readings to settle and use the same zero-current criterion each time.',
    ],
    readingTip: 'Keep frequency units consistent (Hz) and record the stopping potential with its sign convention.',
  },
  5: {
    steps: [
      'Set the core and cladding refractive indices in the controls, making sure the core index is larger.',
      'Aim the fibre output at a screen and set the distance from the fibre tip to the screen.',
      'Record the spot diameter at several distances in the table.',
      'Compare the measured acceptance angle and numerical aperture with the theoretical values calculated from the indices.',
    ],
    precautions: [
      'Do not look directly into the fibre end when the source is on.',
      'Avoid sharp bends, crushing or pulling the fibre; handle connectors by their housings.',
      'Keep the screen perpendicular to the fibre axis and measure the spot across its full width.',
    ],
    readingTip: 'Use the full spot diameter as W; the calculation uses half-width as the radius.',
  },
  6: {
    steps: [
      'Choose a transmission wavelength window and note the received voltage at the first fibre length.',
      'Record the received voltage for the second, longer length without changing source or receiver settings.',
      'Enter both lengths and voltages. Check that the longer fibre gives a lower signal.',
      'Use the calculated attenuation in dB/km and km⁻¹, then compare it with the typical loss for the chosen window.',
    ],
    precautions: [
      'Keep the transmitter pointed into the fibre; never look into an active optical connector.',
      'Do not bend the fibre tightly. Clean connectors only with the approved method.',
      'Keep detector range and source settings unchanged between readings.',
    ],
    readingTip: 'Check that both measurements use the same unit and that the longer fibre gives a lower received signal.',
  },
  7: {
    steps: [
      'Choose the magnetic material and set the sample and coil dimensions to match the specimen.',
      'Adjust the CRO X- and Y-gains and the drive current until the B–H loop is clear and centred.',
      'Record the loop width and intercepts using the calibrated gain settings.',
      'Review the calculated coercivity, retentivity, saturation and hysteresis-loss estimate.',
    ],
    precautions: [
      'Use the low-voltage trainer and supervised connections; never touch exposed terminals while powered.',
      'Begin with low signal levels and stay within the CRO and tracer limits.',
      'Do not change leads or probe connections while the equipment is energised.',
    ],
    readingTip: 'Record CRO divisions together with volts/div and time/div or instrument scale factors; divisions alone are not physical units.',
  },
  8: {
    steps: [
      'Choose the test liquid and set the RF frequency. Keep the interferometer cell filled, aligned and free of bubbles.',
      'Move the reflector gently with the micrometer and record the successive resonance positions in the table.',
      'Use several successive positions to find the average spacing, then calculate wavelength and sound speed.',
      'Enter or confirm the liquid density and review the calculated adiabatic compressibility.',
    ],
    precautions: [
      'Keep the cell upright and prevent liquid from reaching electrical connections.',
      'Do not run the transducer dry; use only the specified frequency and power settings.',
      'Move the micrometer gently and take readings without parallax; clean spills promptly.',
    ],
    readingTip: 'Use several successive resonance positions; the spacing between them corresponds to half a wavelength.',
  },
};

export const PracticalGuide: React.FC<PracticalGuideProps> = ({ experimentId, onClose }) => {
  const experiment = EXPERIMENTS.find((item) => item.id === experimentId);
  const guide = guideContent[experimentId];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!experiment || !guide) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-end bg-slate-950/25 p-3 pt-20 backdrop-blur-[2px] sm:p-5 sm:pt-24"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="practical-guide-title"
        className="flex max-h-[calc(100vh-7rem)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-800 px-5 py-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
              <BookOpen className="h-4 w-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                Experiment {experiment.id} · {experiment.category}
              </p>
              <h2 id="practical-guide-title" className="mt-1 text-base font-bold text-white">
                {experiment.shortTitle} guide
              </h2>
              <p className="mt-1 text-xs leading-5 text-slate-400">{experiment.aim}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close practical guide"
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </header>

        <div className="space-y-5 overflow-y-auto px-5 py-4">
          <section>
            <h3 className="text-sm font-semibold text-white">Equipment</h3>
            <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
              {experiment.apparatus.map((item) => (
                <li key={item} className="flex items-start gap-2 text-xs leading-5 text-slate-300">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold text-white">How to perform the practical</h3>
            <ol className="mt-2 space-y-2.5">
              {guide.steps.map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-sm leading-5 text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-semibold text-cyan-300">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-3.5">
            <h3 className="text-sm font-semibold text-amber-200">Precautions</h3>
            <ul className="mt-2 space-y-2">
              {guide.precautions.map((precaution) => (
                <li key={precaution} className="flex items-start gap-2 text-xs leading-5 text-slate-300">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-300" aria-hidden="true" />
                  {precaution}
                </li>
              ))}
            </ul>
          </section>

          <p className="rounded-lg bg-slate-900 px-3.5 py-3 text-xs leading-5 text-slate-300">
            <span className="font-semibold text-cyan-200">Reading tip: </span>
            {guide.readingTip}
          </p>
          <p className="text-[11px] leading-4 text-slate-500">
            For physical equipment, follow your laboratory manual and instructor’s directions. This guide complements the on-screen simulation.
          </p>
        </div>
      </section>
    </div>
  );
};
