// src/hooks/usePuterAI.ts
import { useState, useRef, useEffect } from 'react';

// Define the response structure based on the console output
interface PuterAIResponse {
  index: number;
  message: {
    annotations: any[];
    content: string;
    refusal: null | string;
    role: string;
    toString: () => string;
  };
  finish_reason: string;
  usage: {
    cached_tokens: number;
    completion_tokens: number;
    prompt_tokens: number;
  };
  via_ai_chat_service: boolean;
}

// Define streaming chunk structure - Puter AI can send chunks in various formats
interface PuterAIStreamChunk {
  text?: string;
  delta?: {
    text?: string;
    content?: string;
  };
  message?: {
    content?: Array<{
      text?: string;
    }>;
  };
  finish_reason?: string;
  done?: boolean;
}

// Declare puter on window object for TypeScript
declare global {
  interface Window {
    puter: {
      ai: {
        chat: (query: string, options: { 
          model: string; 
          stream?: boolean;
        }) => Promise<AsyncGenerator<PuterAIStreamChunk, void, unknown> | PuterAIResponse>;
      };
      auth: {
        authenticate: () => Promise<any>;
        isSignedIn: () => boolean;
      };
      kv: any;
    };
  }
}

interface UsePuterAIReturn {
  response: string;
  loading: boolean;
  isStreaming: boolean;
  isAuthenticated: boolean;
  search: (query: string) => Promise<void>;
  clearResponse: () => void;
  authenticate: () => Promise<void>;
}

export const usePuterAI = (): UsePuterAIReturn => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Check if Puter SDK is loaded and authenticate
  useEffect(() => {
    const checkSDK = async () => {
      if (window.puter && window.puter.ai) {
        console.log('Puter SDK is ready');
        
        // Check if already authenticated
        try {
          if (window.puter.auth && window.puter.auth.isSignedIn()) {
            console.log('✅ Already authenticated with Puter');
            setIsAuthenticated(true);
          } else {
            console.log('⚠️ Not authenticated, attempting auto-authentication...');
            // Try to authenticate
            if (window.puter.auth && window.puter.auth.authenticate) {
              await window.puter.auth.authenticate();
              setIsAuthenticated(true);
              console.log('✅ Authentication successful');
            }
          }
        } catch (error) {
          console.error('Authentication failed:', error);
          setIsAuthenticated(false);
        }
        
        return true;
      }
      return false;
    };

    // Check immediately
    checkSDK();

    // If not ready, poll for SDK availability
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds max wait
    const interval = setInterval(() => {
      attempts++;
      checkSDK().then(ready => {
        if (ready) {
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          console.error('Puter SDK failed to load after 5 seconds');
          clearInterval(interval);
        }
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const clearResponse = () => {
    setResponse('');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
  };

  const search = async (query: string) => {
    if (!query.trim()) return;
    
    // Check if SDK is available
    if (!window.puter || !window.puter.ai) {
      console.error('Puter SDK not available');
      setResponse('Error: Puter AI SDK is not loaded. Please check your internet connection and restart the application.');
      return;
    }
    
    // Abort any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setIsStreaming(true);
    setResponse('');
    
    try {
      console.log('Starting streaming chat with query:', query);
      console.log('Puter SDK status:', { hasPuter: !!window.puter, hasAI: !!(window.puter?.ai) });
      console.log('Authentication status:', window.puter.auth?.isSignedIn());
      
      // Use Puter AI with a free model that works
      // Try gpt-4o-mini (free tier) instead of claude-opus-4-5
      const stream = await window.puter.ai.chat(query, { 
        model: "gpt-4o-mini",  // Changed to a free model
        stream: true 
      }) as AsyncGenerator<PuterAIStreamChunk, void, unknown>;
      
      setLoading(false); // Loading done, streaming starts
      
      let accumulatedText = '';
      
      // Stream the response chunk by chunk - matching the HTML example logic
      for await (const chunk of stream) {
        // Check if aborted
        if (abortControllerRef.current?.signal.aborted) {
          console.log('Stream aborted by user');
          break;
        }
        
        // Extract chunk text using the same priority order as the HTML example
        let chunkText = '';
        
        if (chunk.text) {
          chunkText = chunk.text;
        } else if (chunk.delta?.text) {
          chunkText = chunk.delta.text;
        } else if (chunk.message?.content?.[0]?.text) {
          chunkText = chunk.message.content[0].text;
        }
        
        // Append chunk to accumulated response
        if (chunkText) {
          accumulatedText += chunkText;
          setResponse(accumulatedText);
        }
      }
      
      setIsStreaming(false);
      console.log('Streaming complete. Total length:', accumulatedText.length);
      
    } catch (error) {
      console.error('Search error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to get response';
      setResponse('Error: ' + errorMessage);
      setIsStreaming(false);
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  const authenticate = async () => {
    try {
      if (window.puter && window.puter.auth) {
        await window.puter.auth.authenticate();
        setIsAuthenticated(true);
        console.log('✅ Manual authentication successful');
      }
    } catch (error) {
      console.error('Manual authentication failed:', error);
      throw error;
    }
  };

  return {
    response,
    loading,
    isStreaming,
    isAuthenticated,
    search,
    clearResponse,
    authenticate
  };
};