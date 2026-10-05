export type ExperimentCategory =
  | 'Typography'
  | 'Simulation'
  | 'Retro & Optics'
  | 'Audio & Signals'
  | 'Physics & Geometry';

export interface ExperimentMeta {
  id: string;
  number: string;
  title: string;
  category: ExperimentCategory;
  tags: string[];
  mechanismSignature: string;
  designSignature: string;
  description: string;
  keyTechnologies: string[];
}
