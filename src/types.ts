export interface CommentAnalysis {
  id: string;
  originalText: string;
  source: 'user' | 'api';
  apiUrl?: string;
  timestamp: Date;

  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };

  summary: {
    text: string;
    compressionRatio: number;
    wordCount: number;
  };

  statistics: {
    originalWordCount: number;
    sentenceCount: number;
    avgWordLength: number;
    readabilityScore: number;
  };

  keyPhrases: string[];
}

export interface AnalysisResult {
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };

  summary: {
    text: string;
    compressionRatio: number;
    wordCount: number;
  };

  statistics: {
    originalWordCount: number;
    sentenceCount: number;
    avgWordLength: number;
    readabilityScore: number;
  };

  keyPhrases: string[];
}

export interface ApiComment {
  id: string | number;
  text: string;
  author?: string;
  timestamp?: string;
}
