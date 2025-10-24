import { CommentAnalysis } from '../types';

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface KeywordSentiment {
  word: string;
  sentiments: {
    positive: number;
    negative: number;
    neutral: number;
  };
  totalOccurrences: number;
  dominantSentiment: 'positive' | 'negative' | 'neutral';
  sentimentScore: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
  'i', 'you', 'we', 'they', 'this', 'but', 'or', 'not', 'have', 'had', 'do', 'does',
  'been', 'being', 'were', 'can', 'could', 'would', 'should', 'may', 'might', 'must',
  'his', 'her', 'their', 'our', 'your', 'my', 'me', 'him', 'them', 'us', 'she',
  'who', 'which', 'what', 'where', 'when', 'why', 'how', 'all', 'each', 'every',
  'some', 'any', 'few', 'more', 'most', 'other', 'such', 'than', 'too', 'very',
  'just', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
  'up', 'down', 'out', 'off', 'over', 'under', 'again', 'further', 'then', 'once'
]);

export function analyzeWordFrequency(analyses: CommentAnalysis[]): WordFrequency[] {
  const wordCounts = new Map<string, number>();
  let totalWords = 0;

  analyses.forEach(analysis => {
    const words = analysis.originalText
      .toLowerCase()
      .match(/\b[a-z]{3,}\b/g) || [];

    words.forEach(word => {
      if (!STOP_WORDS.has(word)) {
        wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        totalWords++;
      }
    });
  });

  const wordFrequencies: WordFrequency[] = Array.from(wordCounts.entries())
    .map(([word, count]) => ({
      word,
      count,
      percentage: (count / totalWords) * 100
    }))
    .sort((a, b) => b.count - a.count);

  return wordFrequencies;
}

export function analyzeKeywordSentiment(analyses: CommentAnalysis[]): KeywordSentiment[] {
  const keywordSentimentMap = new Map<string, {
    positive: number;
    negative: number;
    neutral: number;
  }>();

  analyses.forEach(analysis => {
    const words = analysis.originalText
      .toLowerCase()
      .match(/\b[a-z]{3,}\b/g) || [];

    const uniqueWords = new Set(words.filter(word => !STOP_WORDS.has(word)));

    uniqueWords.forEach(word => {
      if (!keywordSentimentMap.has(word)) {
        keywordSentimentMap.set(word, { positive: 0, negative: 0, neutral: 0 });
      }

      const sentimentData = keywordSentimentMap.get(word)!;

      switch (analysis.sentiment.label) {
        case 'positive':
          sentimentData.positive++;
          break;
        case 'negative':
          sentimentData.negative++;
          break;
        case 'neutral':
          sentimentData.neutral++;
          break;
      }
    });
  });

  const keywordSentiments: KeywordSentiment[] = Array.from(keywordSentimentMap.entries())
    .map(([word, sentiments]) => {
      const totalOccurrences = sentiments.positive + sentiments.negative + sentiments.neutral;

      let dominantSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      let maxCount = sentiments.neutral;

      if (sentiments.positive > maxCount) {
        dominantSentiment = 'positive';
        maxCount = sentiments.positive;
      }
      if (sentiments.negative > maxCount) {
        dominantSentiment = 'negative';
        maxCount = sentiments.negative;
      }

      const sentimentScore = (
        (sentiments.positive - sentiments.negative) / totalOccurrences
      );

      return {
        word,
        sentiments,
        totalOccurrences,
        dominantSentiment,
        sentimentScore
      };
    })
    .filter(item => item.totalOccurrences >= 2)
    .sort((a, b) => b.totalOccurrences - a.totalOccurrences);

  return keywordSentiments;
}

export function getTopKeywordsBySentiment(
  keywordSentiments: KeywordSentiment[],
  sentiment: 'positive' | 'negative' | 'neutral',
  limit: number = 10
): KeywordSentiment[] {
  return keywordSentiments
    .filter(item => item.dominantSentiment === sentiment)
    .slice(0, limit);
}

export function getMostInfluentialKeywords(
  keywordSentiments: KeywordSentiment[],
  limit: number = 20
): KeywordSentiment[] {
  return keywordSentiments
    .sort((a, b) => {
      const aInfluence = Math.abs(a.sentimentScore) * a.totalOccurrences;
      const bInfluence = Math.abs(b.sentimentScore) * b.totalOccurrences;
      return bInfluence - aInfluence;
    })
    .slice(0, limit);
}
