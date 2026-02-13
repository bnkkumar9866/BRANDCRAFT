
export enum View {
  DASHBOARD = 'DASHBOARD',
  IDENTITY = 'IDENTITY',
  CONTENT = 'CONTENT',
  SENTIMENT = 'SENTIMENT',
  ASSISTANT = 'ASSISTANT'
}

export interface BrandIdentity {
  name: string;
  industry: string;
  values: string[];
  targetAudience: string;
  tagline?: string;
  logoUrl?: string;
}

export interface SentimentResult {
  score: number;
  label: string;
  explanation: string;
  breakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
