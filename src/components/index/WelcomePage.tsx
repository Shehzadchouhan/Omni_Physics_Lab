import React from 'react';
import {
  Activity,
  ArrowRight,
  Atom,
  Cable,
  Layers,
  Magnet,
  Radio,
  SunMedium,
  Zap,
} from 'lucide-react';
import { EXPERIMENTS } from '../../lib/constants';

interface WelcomePageProps {
  onSelectExperiment: (id: number) => void;
}

const experimentIcons: Record<string, typeof Atom> = {
  Laser: Zap,
  Layers,
  SunMedium,
  Atom,
  Cable,
  Activity,
  Magnet,
  Radio,
};

const iconStyles: Record<string, string> = {
  Laser: 'bg-rose-50 text-rose-600',
  Layers: 'bg-amber-50 text-amber-600',
  SunMedium: 'bg-violet-50 text-violet-600',
  Atom: 'bg-cyan-50 text-cyan-700',
  Cable: 'bg-pink-50 text-pink-600',
  Activity: 'bg-blue-50 text-blue-600',
  Magnet: 'bg-emerald-50 text-emerald-700',
  Radio: 'bg-indigo-50 text-indigo-600',
};

const cardAccents: Record<string, string> = {
  Laser: 'hover:border-rose-200 focus-visible:outline-rose-600',
  Layers: 'hover:border-amber-200 focus-visible:outline-amber-600',
  SunMedium: 'hover:border-violet-200 focus-visible:outline-violet-600',
  Atom: 'hover:border-cyan-200 focus-visible:outline-cyan-700',
  Cable: 'hover:border-pink-200 focus-visible:outline-pink-600',
  Activity: 'hover:border-blue-200 focus-visible:outline-blue-600',
  Magnet: 'hover:border-emerald-200 focus-visible:outline-emerald-700',
  Radio: 'hover:border-indigo-200 focus-visible:outline-indigo-600',
};

const titleAccents: Record<string, string> = {
  Laser: 'group-hover:text-rose-700',
  Layers: 'group-hover:text-amber-700',
  SunMedium: 'group-hover:text-violet-700',
  Atom: 'group-hover:text-cyan-800',
  Cable: 'group-hover:text-pink-700',
  Activity: 'group-hover:text-blue-700',
  Magnet: 'group-hover:text-emerald-800',
  Radio: 'group-hover:text-indigo-700',
};

const experimentDescriptions: Record<number, string> = {
  1: 'Measure how a laser beam spreads as it travels.',
  2: "Find the dielectric constant of a solid sample.",
  3: 'Use laser diffraction to measure a grating.',
  4: "Explore the photoelectric effect and Planck's constant.",
  5: 'Measure the light cone of an optical fibre.',
  6: 'Measure signal loss through an optical fibre.',
  7: 'Explore magnetic hysteresis and the B–H curve.',
  8: 'Measure the speed of ultrasound in a liquid.',
};

export const WelcomePage: React.FC<WelcomePageProps> = ({ onSelectExperiment }) => {
  return (
    <div className="mx-auto max-w-5xl space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white px-6 py-9 shadow-sm sm:px-10 sm:py-12">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-cyan-50 px-3 py-1 text-xs font-semibold tracking-wide text-cyan-800">
            GNDEC · 2018 syllabus
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Physics practicals, made easier to explore.
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
            Choose an experiment to understand the setup, try the simulation, and work through the results at your own pace.
          </p>
          <a
            href="#experiments"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-700"
          >
            Browse experiments
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </section>

      <section id="experiments" className="scroll-mt-24">
        <div className="mb-4">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Choose an experiment</h2>
          <p className="mt-1 text-sm text-slate-600">Select a practical to open its interactive lab.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {EXPERIMENTS.map((experiment) => {
            const Icon = experimentIcons[experiment.iconName] ?? Atom;
            const iconStyle = iconStyles[experiment.iconName] ?? 'bg-slate-100 text-slate-600';
            const cardAccent = cardAccents[experiment.iconName] ?? 'hover:border-cyan-300 focus-visible:outline-cyan-700';
            const titleAccent = titleAccents[experiment.iconName] ?? 'group-hover:text-cyan-800';

            return (
              <button
                key={experiment.id}
                type="button"
                onClick={() => onSelectExperiment(experiment.id)}
                className={`group flex min-h-28 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${cardAccent}`}
                aria-label={`Open experiment ${experiment.id}: ${experiment.shortTitle}`}
              >
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconStyle}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-medium text-slate-500">
                    Experiment {experiment.id} · {experiment.category}
                  </span>
                  <span className={`mt-1 block font-semibold text-slate-900 ${titleAccent}`}>
                    {experiment.shortTitle}
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">
                    {experimentDescriptions[experiment.id]}
                  </span>
                </span>
                <ArrowRight className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 ${titleAccent.replace('group-hover:text-', 'group-hover:text-')}`} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};
