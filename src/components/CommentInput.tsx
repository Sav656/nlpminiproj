import React, { useState } from 'react';
import { MessageSquare, Sparkles, Keyboard, Mic } from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';

interface CommentInputProps {
  onAnalyze: (text: string) => void;
  isAnalyzing: boolean;
}

export function CommentInput({ onAnalyze, isAnalyzing }: CommentInputProps) {
  const [text, setText] = useState('');
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAnalyze(text);
    }
  };

  const handleTranscription = (transcribedText: string) => {
    setText(prev => {
      const newText = prev ? `${prev} ${transcribedText}` : transcribedText;
      return newText;
    });
  };

  const exampleComments = [
    "This product is absolutely amazing! The quality exceeded my expectations and the customer service was outstanding. I've already recommended it to all my friends and family. Definitely worth every penny!",
    "I'm extremely disappointed with this purchase. The item arrived damaged, and when I contacted support, they were unhelpful and rude. The quality is terrible and nothing like what was advertised. Complete waste of money.",
    "The product is okay. It does what it's supposed to do, nothing more, nothing less. Shipping was on time and packaging was adequate. Not impressed but not disappointed either."
  ];

  const loadExample = (example: string) => {
    setText(example);
    setInputMode('text');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl">
          <MessageSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analyze Comment</h2>
          <p className="text-gray-600">Type or speak your comment for analysis</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            type="button"
            onClick={() => setInputMode('text')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
              inputMode === 'text'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            Text Input
          </button>
          <button
            type="button"
            onClick={() => setInputMode('voice')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-all flex items-center justify-center gap-2 ${
              inputMode === 'voice'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mic className="w-4 h-4" />
            Voice Input
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {inputMode === 'text' ? (
          <div>
            <label htmlFor="comment" className="block text-sm font-semibold text-gray-700 mb-2">
              Your Comment
            </label>
            <textarea
              id="comment"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your comment here..."
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all outline-none resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {text.length} characters • {text.trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 bg-gray-50">
            <AudioRecorder onTranscription={handleTranscription} />

            {text && (
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">Transcribed Text:</p>
                <p className="text-gray-900">{text}</p>
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="mt-2 text-sm text-red-500 hover:text-red-600"
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={!text.trim() || isAnalyzing}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
        >
          <Sparkles className="w-5 h-5" />
          {isAnalyzing ? 'Analyzing...' : 'Analyze Comment'}
        </button>

        {inputMode === 'text' && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Try an example:</p>
            <div className="space-y-2">
              {exampleComments.map((comment, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => loadExample(comment)}
                  className="w-full text-left px-4 py-2 rounded-lg border border-gray-200 hover:border-violet-400 hover:bg-violet-50 transition-all text-sm text-gray-700"
                >
                  {comment.substring(0, 80)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
