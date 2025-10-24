import React, { useState } from 'react';
import { Globe, Download, AlertCircle } from 'lucide-react';

interface ApiCommentsFetcherProps {
  onCommentsFetched: (comments: string[], apiUrl: string) => void;
}

export function ApiCommentsFetcher({ onCommentsFetched }: ApiCommentsFetcherProps) {
  const [apiUrl, setApiUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exampleApis = [
    {
      name: 'JSONPlaceholder Comments',
      url: 'https://jsonplaceholder.typicode.com/comments?postId=1',
      description: 'Sample comment data'
    }
  ];

  const handleFetch = async () => {
    if (!apiUrl.trim()) {
      setError('Please enter an API URL');
      return;
    }

    setIsFetching(true);
    setError(null);

    try {
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      let comments: string[] = [];

      if (Array.isArray(data)) {
        comments = data.map((item: any) => {
          if (typeof item === 'string') return item;
          if (item.body) return item.body;
          if (item.comment) return item.comment;
          if (item.text) return item.text;
          if (item.content) return item.content;
          if (item.message) return item.message;
          return JSON.stringify(item);
        }).filter((comment: string) => comment && comment.length > 10);
      } else if (typeof data === 'object' && data !== null) {
        if (data.comments && Array.isArray(data.comments)) {
          comments = data.comments.map((item: any) => {
            if (typeof item === 'string') return item;
            return item.body || item.text || item.comment || item.content || item.message;
          }).filter((comment: string) => comment && comment.length > 10);
        } else if (data.data && Array.isArray(data.data)) {
          comments = data.data.map((item: any) => {
            if (typeof item === 'string') return item;
            return item.body || item.text || item.comment || item.content || item.message;
          }).filter((comment: string) => comment && comment.length > 10);
        }
      }

      if (comments.length === 0) {
        throw new Error('No valid comments found in the API response. Expected an array of comments or objects with text fields.');
      }

      onCommentsFetched(comments, apiUrl);
      setApiUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments from API');
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
          <Globe className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fetch Comments from API</h2>
          <p className="text-gray-600">Analyze comments from any public API</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="apiUrl" className="block text-sm font-semibold text-gray-700 mb-2">
            API URL
          </label>
          <input
            id="apiUrl"
            type="url"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.example.com/comments"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all outline-none"
            onKeyPress={(e) => e.key === 'Enter' && handleFetch()}
          />
          <p className="text-xs text-gray-500 mt-2">
            The API should return an array of comments or an object with a comments/data array
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <button
          onClick={handleFetch}
          disabled={isFetching || !apiUrl.trim()}
          className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30"
        >
          <Download className="w-5 h-5" />
          {isFetching ? 'Fetching Comments...' : 'Fetch & Analyze Comments'}
        </button>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3">Try an example API:</p>
          <div className="space-y-2">
            {exampleApis.map((api, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setApiUrl(api.url)}
                className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-cyan-400 hover:bg-cyan-50 transition-all"
              >
                <div className="font-medium text-gray-900 mb-1">{api.name}</div>
                <div className="text-xs text-gray-600 mb-2">{api.description}</div>
                <div className="text-xs text-gray-500 font-mono truncate">{api.url}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
