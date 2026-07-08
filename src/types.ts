export interface InfographicData {
  title: string;
  keyConcept: string;
  mainIdea: string;
  importantFormula?: string;
  visualExplanation: string;
  oneLineSummary: string;
  keyTakeaway: string;
  doYouKnow?: string;
  realLifeExample?: string;
}

export interface GeneratedContent {
  id: string;
  topic: string;
  simulationType: 'dot-product' | 'pendulum' | 'unknown';
  infographic: InfographicData;
}
