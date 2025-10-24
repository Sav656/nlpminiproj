import { AnalysisResult } from '../types';

const POSITIVE_WORDS = [
  'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'best',
  'perfect', 'beautiful', 'awesome', 'brilliant', 'outstanding', 'superb', 'nice',
  'happy', 'joy', 'pleased', 'delighted', 'satisfied', 'impressive', 'remarkable',
  'exceptional', 'fabulous', 'terrific', 'magnificent', 'marvelous', 'splendid',
  'recommend', 'helpful', 'quality', 'enjoyed', 'thank', 'thanks', 'appreciate'
];

const NEGATIVE_WORDS = [
  'bad', 'terrible', 'horrible', 'awful', 'poor', 'worst', 'hate', 'disappointing',
  'sad', 'angry', 'upset', 'frustrated', 'annoyed', 'inferior', 'inadequate',
  'unsatisfactory', 'deficient', 'lacking', 'subpar', 'mediocre', 'dreadful',
  'atrocious', 'abysmal', 'pathetic', 'useless', 'worthless', 'waste', 'broken',
  'failed', 'issue', 'problem', 'difficult', 'never', 'unfortunately'
];

function calculateSentiment(text: string) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach(word => {
    if (POSITIVE_WORDS.includes(word)) positiveCount++;
    if (NEGATIVE_WORDS.includes(word)) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  const score = totalSentimentWords === 0
    ? 0
    : (positiveCount - negativeCount) / Math.max(totalSentimentWords, words.length * 0.1);

  const normalizedScore = Math.max(-1, Math.min(1, score));

  let label: 'positive' | 'negative' | 'neutral';
  if (normalizedScore > 0.1) label = 'positive';
  else if (normalizedScore < -0.1) label = 'negative';
  else label = 'neutral';

  const confidence = Math.min(0.95, Math.abs(normalizedScore) * 0.7 + (totalSentimentWords / words.length) * 0.3);

  return { score: normalizedScore, label, confidence };
}

function extractKeyPhrases(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
    'i', 'you', 'we', 'they', 'this', 'but', 'or', 'not', 'have', 'had', 'do', 'does'
  ]);

  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const wordFreq = new Map<string, number>();

  words.forEach(word => {
    if (!stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    }
  });

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word]) => word);
}

function summarizeText(text: string): { text: string; compressionRatio: number; wordCount: number } {
  const sentences = text.match(/[^.!?]+[.!?]+/g)?.map(s => s.trim()) || [text];
  const words = text.match(/\b\w+\b/g) || [];

  if (sentences.length <= 2 || words.length < 30) {
    return {
      text: text,
      compressionRatio: 100,
      wordCount: words.length
    };
  }

  const wordFrequency = new Map<string, number>();
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with'
  ]);

  words.forEach(word => {
    const lower = word.toLowerCase();
    if (!stopWords.has(lower) && lower.length > 3) {
      wordFrequency.set(lower, (wordFrequency.get(lower) || 0) + 1);
    }
  });

  const sentenceScores = sentences.map((sentence, index) => {
    const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
    let score = 0;

    sentenceWords.forEach(word => {
      score += wordFrequency.get(word) || 0;
    });

    return {
      sentence,
      score: score / Math.max(sentenceWords.length, 1),
      position: index
    };
  });

  sentenceScores.sort((a, b) => b.score - a.score);

  const targetCount = Math.max(2, Math.ceil(sentences.length * 0.4));
  const topSentences = sentenceScores
    .slice(0, targetCount)
    .sort((a, b) => a.position - b.position);

  const summaryText = topSentences.map(s => s.sentence).join(' ');
  const summaryWords = summaryText.match(/\b\w+\b/g) || [];

  return {
    text: summaryText,
    compressionRatio: Math.round((summaryWords.length / words.length) * 100),
    wordCount: summaryWords.length
  };
}

function calculateStatistics(text: string) {
  const words = text.match(/\b\w+\b/g) || [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

  const wordCount = words.length;
  const sentenceCount = sentences.length || 1;
  const avgWordLength = words.reduce((sum, word) => sum + word.length, 0) / (wordCount || 1);

  const avgWordsPerSentence = wordCount / sentenceCount;
  const readabilityScore = Math.max(0, Math.min(100,
    206.835 - 1.015 * avgWordsPerSentence - 84.6 * (avgWordLength / 5)
  ));

  return {
    originalWordCount: wordCount,
    sentenceCount,
    avgWordLength: Math.round(avgWordLength * 10) / 10,
    readabilityScore: Math.round(readabilityScore)
  };
}

export function analyzeComment(text: string): AnalysisResult {
  if (!text.trim()) {
    throw new Error('Text cannot be empty');
  }

  const sentiment = calculateSentiment(text);
  const summary = summarizeText(text);
  const statistics = calculateStatistics(text);
  const keyPhrases = extractKeyPhrases(text);

  return {
    sentiment,
    summary,
    statistics,
    keyPhrases
  };
}
