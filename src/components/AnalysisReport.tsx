import React from 'react';
import { FileText, Download, Smile, Frown, Meh } from 'lucide-react';
import { CommentAnalysis } from '../types';

interface AnalysisReportProps {
  analyses: CommentAnalysis[];
  apiUrl?: string;
}

export function AnalysisReport({ analyses, apiUrl }: AnalysisReportProps) {
  if (analyses.length === 0) return null;

  const sentimentCounts = {
    positive: analyses.filter(a => a.sentiment.label === 'positive').length,
    negative: analyses.filter(a => a.sentiment.label === 'negative').length,
    neutral: analyses.filter(a => a.sentiment.label === 'neutral').length
  };

  const avgSentimentScore = analyses.reduce((sum, a) => sum + a.sentiment.score, 0) / analyses.length;
  const avgConfidence = analyses.reduce((sum, a) => sum + a.sentiment.confidence, 0) / analyses.length;

  const overallSentiment = avgSentimentScore > 0.1 ? 'positive' : avgSentimentScore < -0.1 ? 'negative' : 'neutral';

  const generateReport = () => {
    const report = `
COMMENT ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}
${apiUrl ? `Source: ${apiUrl}\n` : 'Source: User Input\n'}

OVERVIEW
========
Total Comments Analyzed: ${analyses.length}
Overall Sentiment: ${overallSentiment.toUpperCase()}
Average Sentiment Score: ${avgSentimentScore.toFixed(2)}
Average Confidence: ${(avgConfidence * 100).toFixed(1)}%

SENTIMENT BREAKDOWN
==================
Positive: ${sentimentCounts.positive} (${((sentimentCounts.positive / analyses.length) * 100).toFixed(1)}%)
Neutral: ${sentimentCounts.neutral} (${((sentimentCounts.neutral / analyses.length) * 100).toFixed(1)}%)
Negative: ${sentimentCounts.negative} (${((sentimentCounts.negative / analyses.length) * 100).toFixed(1)}%)

DETAILED ANALYSIS
=================
${analyses.map((analysis, index) => `
Comment #${index + 1}
-----------
Original: ${analysis.originalText}

Summary: ${analysis.summary.text}

Sentiment: ${analysis.sentiment.label.toUpperCase()}
Score: ${analysis.sentiment.score.toFixed(2)}
Confidence: ${(analysis.sentiment.confidence * 100).toFixed(1)}%

Key Phrases: ${analysis.keyPhrases.join(', ')}

Statistics:
- Words: ${analysis.statistics.originalWordCount}
- Sentences: ${analysis.statistics.sentenceCount}
- Readability: ${analysis.statistics.readabilityScore}/100

`).join('\n')}

END OF REPORT
    `.trim();

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comment-analysis-report-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive':
        return <Smile className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <Frown className="w-6 h-6 text-red-500" />;
      default:
        return <Meh className="w-6 h-6 text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Analysis Report</h3>
            <p className="text-gray-600">{analyses.length} comments analyzed</p>
          </div>
        </div>
        <button
          onClick={generateReport}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center gap-3 mb-3">
            <Smile className="w-6 h-6 text-green-600" />
            <h4 className="font-bold text-gray-900">Positive</h4>
          </div>
          <div className="text-3xl font-bold text-green-600 mb-1">
            {sentimentCounts.positive}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentCounts.positive / analyses.length) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <Meh className="w-6 h-6 text-gray-600" />
            <h4 className="font-bold text-gray-900">Neutral</h4>
          </div>
          <div className="text-3xl font-bold text-gray-600 mb-1">
            {sentimentCounts.neutral}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentCounts.neutral / analyses.length) * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-3">
            <Frown className="w-6 h-6 text-red-600" />
            <h4 className="font-bold text-gray-900">Negative</h4>
          </div>
          <div className="text-3xl font-bold text-red-600 mb-1">
            {sentimentCounts.negative}
          </div>
          <div className="text-sm text-gray-600">
            {((sentimentCounts.negative / analyses.length) * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border border-violet-200">
        <h4 className="font-bold text-gray-900 mb-4">Overall Sentiment</h4>
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            {getSentimentIcon(overallSentiment)}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold text-gray-900 capitalize">
                {overallSentiment}
              </span>
              <span className="text-gray-600">
                Score: {avgSentimentScore.toFixed(2)}
              </span>
            </div>
            <div className="relative h-3 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  overallSentiment === 'positive'
                    ? 'bg-green-500'
                    : overallSentiment === 'negative'
                    ? 'bg-red-500'
                    : 'bg-gray-500'
                }`}
                style={{ width: `${(avgConfidence * 100).toFixed(0)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Average Confidence: {(avgConfidence * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
