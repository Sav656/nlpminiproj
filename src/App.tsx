import React, { useState, useEffect, useMemo } from 'react';
import { Brain, MessageSquare, Layers } from 'lucide-react';
import { CommentInput } from './components/CommentInput';
import { ApiCommentsFetcher } from './components/ApiCommentsFetcher';
import { AnalysisResults } from './components/AnalysisResults';
import { AnalysisReport } from './components/AnalysisReport';
import { AnalysisHistory } from './components/AnalysisHistory';
import { WordFrequencyAnalysis } from './components/WordFrequencyAnalysis';
import { KeywordInsights } from './components/KeywordInsights';
import { analyzeComment } from './utils/nlpAnalyzer';
import { analyzeWordFrequency, analyzeKeywordSentiment } from './utils/wordFrequency';
import { CommentAnalysis } from './types';

function App() {
  const [analyses, setAnalyses] = useState<CommentAnalysis[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<CommentAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [batchAnalyses, setBatchAnalyses] = useState<CommentAnalysis[]>([]);
  const [currentApiUrl, setCurrentApiUrl] = useState<string>();

  useEffect(() => {
    const saved = localStorage.getItem('commentAnalyses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnalyses(parsed.map((a: CommentAnalysis) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        })));
      } catch (error) {
        console.error('Error loading saved analyses:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (analyses.length > 0) {
      localStorage.setItem('commentAnalyses', JSON.stringify(analyses));
    }
  }, [analyses]);

  const handleAnalyze = (text: string) => {
    setIsAnalyzing(true);
    setBatchAnalyses([]);
    setCurrentApiUrl(undefined);

    setTimeout(() => {
      try {
        const result = analyzeComment(text);

        const newAnalysis: CommentAnalysis = {
          id: crypto.randomUUID(),
          originalText: text,
          source: 'user',
          timestamp: new Date(),
          sentiment: result.sentiment,
          summary: result.summary,
          statistics: result.statistics,
          keyPhrases: result.keyPhrases
        };

        setAnalyses(prev => [newAnalysis, ...prev]);
        setCurrentAnalysis(newAnalysis);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to analyze comment');
      } finally {
        setIsAnalyzing(false);
      }
    }, 800);
  };

  const handleCommentsFetched = (comments: string[], apiUrl: string) => {
    setIsAnalyzing(true);
    setCurrentAnalysis(null);
    setCurrentApiUrl(apiUrl);

    setTimeout(() => {
      try {
        const newAnalyses: CommentAnalysis[] = comments.map(comment => {
          const result = analyzeComment(comment);
          return {
            id: crypto.randomUUID(),
            originalText: comment,
            source: 'api' as const,
            apiUrl,
            timestamp: new Date(),
            sentiment: result.sentiment,
            summary: result.summary,
            statistics: result.statistics,
            keyPhrases: result.keyPhrases
          };
        });

        setAnalyses(prev => [...newAnalyses, ...prev]);
        setBatchAnalyses(newAnalyses);

        if (newAnalyses.length > 0) {
          setCurrentAnalysis(newAnalyses[0]);
        }
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to analyze comments');
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  };

  const handleDeleteAnalysis = (id: string) => {
    setAnalyses(prev => prev.filter(a => a.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
    setBatchAnalyses(prev => prev.filter(a => a.id !== id));
  };

  const handleSelectAnalysis = (analysis: CommentAnalysis) => {
    setCurrentAnalysis(analysis);
    if (analysis.source === 'api' && analysis.apiUrl) {
      const relatedAnalyses = analyses.filter(
        a => a.source === 'api' && a.apiUrl === analysis.apiUrl
      );
      setBatchAnalyses(relatedAnalyses);
      setCurrentApiUrl(analysis.apiUrl);
    } else {
      setBatchAnalyses([]);
      setCurrentApiUrl(undefined);
    }
  };

  const wordFrequencies = useMemo(() => {
    const analysesToUse = batchAnalyses.length > 0 ? batchAnalyses : analyses;
    if (analysesToUse.length < 2) return [];
    return analyzeWordFrequency(analysesToUse);
  }, [analyses, batchAnalyses]);

  const keywordSentiments = useMemo(() => {
    const analysesToUse = batchAnalyses.length > 0 ? batchAnalyses : analyses;
    if (analysesToUse.length < 2) return [];
    return analyzeKeywordSentiment(analysesToUse);
  }, [analyses, batchAnalyses]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-violet-600 to-purple-600 rounded-2xl shadow-xl shadow-violet-500/30">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-1">
                  CommentIQ
                </h1>
                <p className="text-gray-600">
                  AI-powered comment analysis with voice, sentiment, and summarization
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <Layers className="w-5 h-5 text-violet-500" />
                <div className="text-left">
                  <div className="text-xs text-gray-500">Total Analyses</div>
                  <div className="font-bold text-gray-900">{analyses.length}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Voice-to-Text</div>
                  <div className="text-xs text-gray-500">Speak your comments</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Sentiment Analysis</div>
                  <div className="text-xs text-gray-500">Detect emotions</div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Layers className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700">Summarization</div>
                  <div className="text-xs text-gray-500">Extract key points</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ApiCommentsFetcher onCommentsFetched={handleCommentsFetched} />

            <CommentInput onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />

            {batchAnalyses.length > 0 && (
              <div className="animate-fadeIn">
                <AnalysisReport analyses={batchAnalyses} apiUrl={currentApiUrl} />
              </div>
            )}

            {currentAnalysis && (
              <div className="animate-fadeIn">
                <AnalysisResults analysis={currentAnalysis} />
              </div>
            )}

            {wordFrequencies.length > 0 && (
              <div className="animate-fadeIn">
                <WordFrequencyAnalysis
                  wordFrequencies={wordFrequencies}
                  keywordSentiments={keywordSentiments}
                />
              </div>
            )}

            {keywordSentiments.length > 0 && (
              <div className="animate-fadeIn">
                <KeywordInsights keywordSentiments={keywordSentiments} />
              </div>
            )}

            {!currentAnalysis && analyses.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Brain className="w-10 h-10 text-violet-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Welcome to CommentIQ
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Analyze comments with three powerful NLP features: audio-to-text conversion,
                    sentiment analysis, and intelligent summarization. Perfect for understanding
                    customer feedback, social media comments, and user reviews.
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="font-bold text-blue-700">Voice Input</div>
                      <div className="text-blue-600 text-xs">Speak Naturally</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="font-bold text-green-700">Sentiment</div>
                      <div className="text-green-600 text-xs">Detect Emotions</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="font-bold text-purple-700">Summary</div>
                      <div className="text-purple-600 text-xs">Key Insights</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <AnalysisHistory
              analyses={analyses}
              onSelectAnalysis={handleSelectAnalysis}
              onDeleteAnalysis={handleDeleteAnalysis}
              selectedAnalysisId={currentAnalysis?.id}
            />
          </div>
        </div>

        <footer className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <p>
              Built with React, TypeScript, and advanced NLP algorithms
            </p>
            <p className="text-center md:text-right">
              Features: Speech Recognition • Sentiment Analysis • Text Summarization
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
