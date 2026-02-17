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
    };
  }
}

interface UsePuterAIReturn {
  response: string;
  loading: boolean;
  isStreaming: boolean;
  search: (query: string) => Promise<void>;
  clearResponse: () => void;
}

export const usePuterAI = (): UsePuterAIReturn => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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
      
      // Use Puter AI to get the streaming response - exactly like the HTML example
      const stream = await window.puter.ai.chat(query, { 
        model: "claude-opus-4-5",
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

  return {
    response,
    loading,
    isStreaming,
    search,
    clearResponse
  };
};