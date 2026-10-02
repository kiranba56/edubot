import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  createChatSession, 
  subscribeToSessions, 
  renameChatSession, 
  deleteChatSession, 
  subscribeToMessages, 
  saveMessage 
} from '../services/chatService';
import { streamChatResponse } from '../services/aiService';
import toast from 'react-hot-toast';

export function useChat(userId) {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [loadingSessions, setLoadingSessions] = useState(true);

  // Keep a reference to current active session ID to prevent race conditions during async calls
  const activeSessionIdRef = useRef(activeSessionId);
  activeSessionIdRef.current = activeSessionId;

  // Subscribe to sessions when user changes
  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setActiveSessionId(null);
      activeSessionIdRef.current = null;
      setMessages([]);
      setLoadingSessions(false);
      return;
    }

    setLoadingSessions(true);
    const unsubscribe = subscribeToSessions(userId, (loadedSessions) => {
      setSessions(loadedSessions);
      setLoadingSessions(false);

      // Auto-select first session if none is selected
      if (loadedSessions.length > 0) {
        setActiveSessionId((current) => {
          if (current && loadedSessions.some(s => s.id === current)) {
            return current;
          }
          activeSessionIdRef.current = loadedSessions[0].id;
          return loadedSessions[0].id;
        });
      } else {
        setActiveSessionId(null);
        activeSessionIdRef.current = null;
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [userId]);

  // Subscribe to messages in active session
  useEffect(() => {
    if (!userId || !activeSessionId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(userId, activeSessionId, (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [userId, activeSessionId]);

  /**
   * Create a new blank session
   */
  const createNewSession = useCallback(async (initialTitle = 'New Chat') => {
    if (!userId) return null;
    try {
      const newSessionId = await createChatSession(userId, initialTitle);
      activeSessionIdRef.current = newSessionId;
      setActiveSessionId(newSessionId);
      setMessages([]);
      return newSessionId;
    } catch (err) {
      console.error('Failed to create new session:', err);
      toast.error('Could not create new session');
      return null;
    }
  }, [userId]);

  /**
   * Select a session
   */
  const selectSession = useCallback((sessionId) => {
    if (isGenerating) {
      toast('Please wait for EduBot to finish answering', { icon: '⏳' });
      return;
    }
    activeSessionIdRef.current = sessionId;
    setActiveSessionId(sessionId);
    setStreamingContent('');
  }, [isGenerating]);

  /**
   * Rename a session
   */
  const editSessionTitle = useCallback(async (sessionId, newTitle) => {
    if (!userId || !sessionId) return;
    try {
      await renameChatSession(userId, sessionId, newTitle);
      toast.success('Session renamed');
    } catch (err) {
      console.error('Failed to rename session:', err);
      toast.error('Could not rename session');
    }
  }, [userId]);

  /**
   * Delete a session
   */
  const removeSession = useCallback(async (sessionId) => {
    if (!userId || !sessionId) return;
    try {
      await deleteChatSession(userId, sessionId);
      toast.success('Chat deleted');
      // If deleted active session, pick next available
      if (activeSessionIdRef.current === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        const nextId = remaining.length > 0 ? remaining[0].id : null;
        activeSessionIdRef.current = nextId;
        setActiveSessionId(nextId);
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
      toast.error('Could not delete session');
    }
  }, [userId, sessions]);

  /**
   * Send a user message and stream bot response
   */
  const sendMessage = useCallback(async (content) => {
    if (!userId || !content.trim() || isGenerating) return;

    let targetSessionId = activeSessionIdRef.current;
    let isFirstMessage = false;

    // Create session if none exists
    if (!targetSessionId) {
      targetSessionId = await createNewSession('New Chat');
      if (!targetSessionId) return;
      isFirstMessage = true;
    } else {
      isFirstMessage = messages.length === 0;
    }

    const trimmedText = content.trim();

    try {
      // 1. Save user message to Firestore or local store
      await saveMessage(userId, targetSessionId, 'user', trimmedText, isFirstMessage);

      // 2. Prepare history for AI context (all previous messages + new user message)
      const currentHistory = [
        ...messages,
        { role: 'user', content: trimmedText }
      ];

      // 3. Initiate Streaming State
      setIsGenerating(true);
      setStreamingContent('');

      let accumulatedAnswer = '';

      await streamChatResponse(currentHistory, (token) => {
        accumulatedAnswer += token;
        setStreamingContent(accumulatedAnswer);
      });

      // 4. Save completed assistant message to storage
      if (accumulatedAnswer.trim()) {
        await saveMessage(userId, targetSessionId, 'assistant', accumulatedAnswer, false);
      }
    } catch (err) {
      console.error('Error during chat completion:', err);
      toast.error('Failed to get answer. Please try again.');
    } finally {
      setIsGenerating(false);
      setStreamingContent('');
    }
  }, [userId, messages, isGenerating, createNewSession]);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  return {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isGenerating,
    streamingContent,
    loadingSessions,
    createNewSession,
    selectSession,
    editSessionTitle,
    removeSession,
    sendMessage,
  };
}
