// src/App.tsx
import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import './App.css';
import 'highlight.js/styles/atom-one-dark.css';
import { usePuterAI } from './hooks/usePuterAI';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [sdkStatus, setSdkStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use the custom hook for Puter AI
  const { response, loading, isStreaming, isAuthenticated, search, clearResponse, authenticate } = usePuterAI();

  // Check SDK status
  useEffect(() => {
    console.log('App mounted, checking for Puter SDK...');
    const checkSDK = () => {
      if (window.puter && window.puter.ai) {
        console.log('✅ Puter SDK detected in App component');
        setSdkStatus('ready');
        return true;
      }
      return false;
    };

    if (checkSDK()) return;

    let attempts = 0;
    const maxAttempts = 100; // 10 seconds
    const interval = setInterval(() => {
      attempts++;
      console.log(`Checking for SDK... attempt ${attempts}`);
      if (checkSDK()) {
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        console.error('❌ SDK failed to load after 10 seconds');
        setSdkStatus('error');
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
      {sdkStatus === 'error' && (
        <div style={{
          background: '#ff4444',
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          textAlign: 'center',
          marginBottom: '8px',
          borderRadius: '4px'
        }}>
          ⚠️ SDK Failed to Load. Check internet connection and DevTools console.
        </div>
      )}
      {sdkStatus === 'loading' && (
        <div style={{
          background: '#4444ff',
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          textAlign: 'center',
          marginBottom: '8px',
          borderRadius: '4px'
        }}>
          🔄 Loading SDK...
        </div>
      )}
      {sdkStatus === 'ready' && !isAuthenticated && (
        <div style={{
          background: '#ff8800',
          color: 'white',
          padding: '8px 12px',
          fontSize: '12px',
          textAlign: 'center',
          marginBottom: '8px',
          borderRadius: '4px',
          cursor: 'pointer'
        }} onClick={authenticate}>
          🔐 Click here to login to Puter (Required for AI)
        </div>
      )}
      {isAuthenticated && (
        <div style={{
          background: '#00aa00',
          color: 'white',
          padding: '4px 12px',
          fontSize: '11px',
          textAlign: 'center',
          marginBottom: '4px',
          borderRadius: '4px'
        }}>
          ✅ Authenticated
        </div>
      )}
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
          placeholder={isAuthenticated ? "Qwik Search" : "Login required..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          autoFocus
          disabled={isStreaming || !isAuthenticated}
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