import React, { useState } from 'react';
import { BarChart3, TrendingUp, Filter } from 'lucide-react';
import { WordFrequency, KeywordSentiment } from '../utils/wordFrequency';

interface WordFrequencyAnalysisProps {
  wordFrequencies: WordFrequency[];
  keywordSentiments: KeywordSentiment[];
}

export function WordFrequencyAnalysis({ wordFrequencies, keywordSentiments }: WordFrequencyAnalysisProps) {
  const [viewMode, setViewMode] = useState<'frequency' | 'sentiment'>('frequency');
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const topWords = wordFrequencies.slice(0, 20);

  const filteredKeywords = sentimentFilter === 'all'
    ? keywordSentiments.slice(0, 20)
    : keywordSentiments.filter(k => k.dominantSentiment === sentimentFilter).slice(0, 20);

  const getMaxCount = () => {
    if (viewMode === 'frequency') {
      return topWords.length > 0 ? topWords[0].count : 1;
    }
    return filteredKeywords.length > 0 ? filteredKeywords[0].totalOccurrences : 1;
  };

  const maxCount = getMaxCount();

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500';
      case 'negative':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (wordFrequencies.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Word Frequency Analysis</h3>
            <p className="text-gray-600">Most common keywords across all comments</p>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('frequency')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'frequency'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Word Frequency
          </button>
          <button
            onClick={() => setViewMode('sentiment')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              viewMode === 'sentiment'
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Keyword Sentiment
          </button>
        </div>

        {viewMode === 'sentiment' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            {['all', 'positive', 'neutral', 'negative'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSentimentFilter(filter as typeof sentimentFilter)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  sentimentFilter === filter
                    ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'frequency' ? (
        <div className="space-y-3">
          {topWords.map((item, index) => (
            <div key={item.word} className="flex items-center gap-3">
              <div className="w-8 text-center font-bold text-gray-500 text-sm">
                #{index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-gray-900">{item.word}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{item.count} times</span>
                    <span className="text-xs text-gray-500">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-500"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredKeywords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No keywords found for this sentiment category
            </div>
          ) : (
            filteredKeywords.map((item, index) => (
              <div
                key={item.word}
                className="border border-gray-200 rounded-xl p-4 hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 text-center font-bold text-gray-500 text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-lg text-gray-900">{item.word}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSentimentBadge(
                            item.dominantSentiment
                          )}`}
                        >
                          {item.dominantSentiment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Appears in {item.totalOccurrences} comments
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {item.sentimentScore >= 0 ? '+' : ''}{item.sentimentScore.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">Sentiment Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-50 rounded-lg p-2 border border-green-200">
                    <div className="text-xs text-green-600 mb-1">Positive</div>
                    <div className="font-bold text-green-700">{item.sentiments.positive}</div>
                    <div className="h-1.5 bg-green-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{
                          width: `${(item.sentiments.positive / item.totalOccurrences) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
                    <div className="text-xs text-gray-600 mb-1">Neutral</div>
                    <div className="font-bold text-gray-700">{item.sentiments.neutral}</div>
                    <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-gray-500"
                        style={{
                          width: `${(item.sentiments.neutral / item.totalOccurrences) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-lg p-2 border border-red-200">
                    <div className="text-xs text-red-600 mb-1">Negative</div>
                    <div className="font-bold text-red-700">{item.sentiments.negative}</div>
                    <div className="h-1.5 bg-red-100 rounded-full mt-1 overflow-hidden">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(item.sentiments.negative / item.totalOccurrences) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
