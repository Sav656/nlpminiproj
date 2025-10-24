import React from 'react';
import { Smile, Frown, Meh, FileText, TrendingUp, Tag, BarChart3 } from 'lucide-react';
import { CommentAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: CommentAnalysis;
}

export function AnalysisResults({ analysis }: AnalysisResultsProps) {
  const getSentimentIcon = () => {
    switch (analysis.sentiment.label) {
      case 'positive':
        return <Smile className="w-8 h-8 text-green-500" />;
      case 'negative':
        return <Frown className="w-8 h-8 text-red-500" />;
      default:
        return <Meh className="w-8 h-8 text-gray-500" />;
    }
  };

  const getSentimentColor = () => {
    switch (analysis.sentiment.label) {
      case 'positive':
        return 'from-green-500 to-emerald-600';
      case 'negative':
        return 'from-red-500 to-rose-600';
      default:
        return 'from-gray-500 to-slate-600';
    }
  };

  const getSentimentBg = () => {
    switch (analysis.sentiment.label) {
      case 'positive':
        return 'bg-green-50 border-green-200';
      case 'negative':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const normalizedScore = ((analysis.sentiment.score + 1) / 2) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Analysis Report</h3>
            <p className="text-gray-600">
              Source: {analysis.source === 'api' ? 'API' : 'User Input'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${getSentimentBg()} border-2 rounded-xl p-6`}>
            <div className="flex items-center justify-center mb-4">
              {getSentimentIcon()}
            </div>
            <h4 className="text-center text-2xl font-bold text-gray-900 capitalize mb-2">
              {analysis.sentiment.label}
            </h4>
            <p className="text-center text-gray-600 mb-4">
              Confidence: {(analysis.sentiment.confidence * 100).toFixed(1)}%
            </p>

            <div className="relative h-4 bg-white rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-gradient-to-r from-red-200 to-gray-100"></div>
                <div className="w-1/2 bg-gradient-to-r from-gray-100 to-green-200"></div>
              </div>
              <div
                className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-r ${getSentimentColor()} transition-all duration-500`}
                style={{ left: `${normalizedScore}%`, transform: 'translateX(-50%)' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-600 mt-2">
              <span>Negative</span>
              <span>Neutral</span>
              <span>Positive</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-gray-900">Summary</h4>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              {analysis.summary.text}
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Compression:</span>
              <span className="font-bold text-blue-600">
                {analysis.summary.compressionRatio}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Tag className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">Key Phrases</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis.keyPhrases.map((phrase, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-purple-50 rounded-lg text-sm font-medium text-purple-700 border border-purple-200"
              >
                {phrase}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-500 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-gray-900">Statistics</h4>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Words</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.statistics.originalWordCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Sentences</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.statistics.sentenceCount}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Word Length</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.statistics.avgWordLength}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Readability</span>
              <span className="text-lg font-bold text-gray-900">
                {analysis.statistics.readabilityScore}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h4 className="font-bold text-gray-900 mb-4">Original Comment</h4>
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {analysis.originalText}
          </p>
        </div>
      </div>
    </div>
  );
}
