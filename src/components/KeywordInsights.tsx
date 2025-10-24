import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { KeywordSentiment, getTopKeywordsBySentiment } from '../utils/wordFrequency';

interface KeywordInsightsProps {
  keywordSentiments: KeywordSentiment[];
}

export function KeywordInsights({ keywordSentiments }: KeywordInsightsProps) {
  if (keywordSentiments.length === 0) {
    return null;
  }

  const positiveKeywords = getTopKeywordsBySentiment(keywordSentiments, 'positive', 10);
  const negativeKeywords = getTopKeywordsBySentiment(keywordSentiments, 'negative', 10);
  const neutralKeywords = getTopKeywordsBySentiment(keywordSentiments, 'neutral', 10);

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl">
          <Lightbulb className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Keyword Insights</h3>
          <p className="text-gray-600">Words that indicate sentiment in comments</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6 text-green-600" />
            <h4 className="font-bold text-gray-900">Positive Keywords</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Words that commonly appear in positive comments
          </p>
          {positiveKeywords.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No positive keywords found</p>
          ) : (
            <div className="space-y-2">
              {positiveKeywords.map((keyword, index) => (
                <div
                  key={keyword.word}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-green-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-semibold text-gray-900">{keyword.word}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-green-600">
                      {keyword.sentiments.positive}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((keyword.sentiments.positive / keyword.totalOccurrences) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Minus className="w-6 h-6 text-gray-600" />
            <h4 className="font-bold text-gray-900">Neutral Keywords</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Words that commonly appear in neutral comments
          </p>
          {neutralKeywords.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No neutral keywords found</p>
          ) : (
            <div className="space-y-2">
              {neutralKeywords.map((keyword, index) => (
                <div
                  key={keyword.word}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-semibold text-gray-900">{keyword.word}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-600">
                      {keyword.sentiments.neutral}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((keyword.sentiments.neutral / keyword.totalOccurrences) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown className="w-6 h-6 text-red-600" />
            <h4 className="font-bold text-gray-900">Negative Keywords</h4>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Words that commonly appear in negative comments
          </p>
          {negativeKeywords.length === 0 ? (
            <p className="text-sm text-gray-500 italic">No negative keywords found</p>
          ) : (
            <div className="space-y-2">
              {negativeKeywords.map((keyword, index) => (
                <div
                  key={keyword.word}
                  className="flex items-center justify-between bg-white rounded-lg p-3 border border-red-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">#{index + 1}</span>
                    <span className="font-semibold text-gray-900">{keyword.word}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-red-600">
                      {keyword.sentiments.negative}
                    </div>
                    <div className="text-xs text-gray-500">
                      {((keyword.sentiments.negative / keyword.totalOccurrences) * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-gray-900 mb-1">Understanding Keyword Insights</h5>
            <p className="text-sm text-gray-600">
              These keywords appear frequently in comments with specific sentiment labels. For example,
              if "excellent" appears mostly in positive comments, it's a strong indicator of positive sentiment.
              Use these insights to understand which words drive sentiment in your feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
