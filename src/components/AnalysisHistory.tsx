import React, { useState } from 'react';
import { History, Trash2, Search, Filter, ChevronDown, ChevronUp, MessageSquare, Globe } from 'lucide-react';
import { CommentAnalysis } from '../types';

interface AnalysisHistoryProps {
  analyses: CommentAnalysis[];
  onSelectAnalysis: (analysis: CommentAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
  selectedAnalysisId?: string;
}

export function AnalysisHistory({
  analyses,
  onSelectAnalysis,
  onDeleteAnalysis,
  selectedAnalysisId
}: AnalysisHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSentiment, setFilterSentiment] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [filterSource, setFilterSource] = useState<'all' | 'user' | 'api'>('all');
  const [isExpanded, setIsExpanded] = useState(true);

  const filteredAnalyses = analyses.filter(analysis => {
    const matchesSearch = analysis.originalText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSentiment = filterSentiment === 'all' || analysis.sentiment.label === filterSentiment;
    const matchesSource = filterSource === 'all' || analysis.source === filterSource;
    return matchesSearch && matchesSentiment && matchesSource;
  });

  const getSentimentBadgeColor = (label: string) => {
    switch (label) {
      case 'positive':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'negative':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <History className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Analysis History</h3>
              <p className="text-slate-300 text-sm">{analyses.length} total analyses</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-white" />
            ) : (
              <ChevronDown className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search analyses..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-slate-300">Sentiment:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'positive', 'neutral', 'negative'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterSentiment(filter as typeof filterSentiment)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterSentiment === filter
                        ? 'bg-white text-slate-800'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Filter className="w-4 h-4 text-slate-300" />
                <span className="text-sm text-slate-300">Source:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                {['all', 'user', 'api'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setFilterSource(filter as typeof filterSource)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      filterSource === filter
                        ? 'bg-white text-slate-800'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="max-h-96 overflow-y-auto">
          {filteredAnalyses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {analyses.length === 0 ? (
                <>
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No analyses yet. Start by analyzing a comment above!</p>
                </>
              ) : (
                <p>No analyses match your filters.</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredAnalyses.map((analysis) => (
                <div
                  key={analysis.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedAnalysisId === analysis.id ? 'bg-violet-50' : ''
                  }`}
                  onClick={() => onSelectAnalysis(analysis)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {analysis.source === 'api' ? (
                          <Globe className="w-4 h-4 text-cyan-500" />
                        ) : (
                          <MessageSquare className="w-4 h-4 text-violet-500" />
                        )}
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getSentimentBadgeColor(
                            analysis.sentiment.label
                          )}`}
                        >
                          {analysis.sentiment.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {analysis.source === 'api' ? 'API' : 'User'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {analysis.originalText}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{analysis.statistics.originalWordCount} words</span>
                        <span>•</span>
                        <span>{analysis.summary.compressionRatio}% summary</span>
                        <span>•</span>
                        <span>
                          {new Date(analysis.timestamp).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAnalysis(analysis.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete analysis"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
