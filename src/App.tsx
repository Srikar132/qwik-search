// src/App.tsx
import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import './App.css';
import 'highlight.js/styles/atom-one-dark.css';
import { usePuterAI } from './hooks/usePuterAI';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use the custom hook for Puter AI
  const { response, loading, isStreaming, search, clearResponse } = usePuterAI();

  const handleSearch = async () => {
    if (!query.trim()) return;
    await search(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClear = () => {
    clearResponse();
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className="command-palette">
      <div className="search-container">
        {loading || isStreaming ? (
          <span className="search-icon loading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round"/>
            </svg>
          </span>
        ) : response ? (
          <button 
            className="clear-button" 
            onClick={handleClear}
            title="Clear response"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        ) : (
          <span className="search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
        )}
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Qwik Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          disabled={isStreaming}
        />
      </div>
      
      <div className="response-container">
        {response && (
          <div className="response-box">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
            >
              {response}
            </ReactMarkdown>
            {isStreaming && <span className="cursor">|</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;