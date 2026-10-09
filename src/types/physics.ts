export interface ExperimentMeta {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  category: 'Optics' | 'Electromagnetism' | 'Quantum' | 'Acoustics';
  aim: string;
  apparatus: string[];
  formulaSummary: string;
  standardFormulaLatex: string;
  acceptedValueText?: string;
  iconName: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
  difficulty: 'Basic' | 'Conceptual' | 'Advanced';
}

export interface LabReportData {
  experimentId: number;
  experimentTitle: string;
  studentName: string;
  rollNumber: string;
  date: string;
  aim: string;
  apparatus: string[];
  formulaLatex: string;
  parameters: Record<string, string | number>;
  readings: Array<Record<string, string | number>>;
  calculatedResults: Record<string, string | number>;
  percentageError?: number;
  conclusion: string;
}
