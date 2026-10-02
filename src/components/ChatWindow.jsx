import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { Sparkles, Brain, Cpu, Terminal, Compass, ArrowRight } from 'lucide-react';

const SUGGESTIONS = [
  {
    title: 'Explain neural networks',
    desc: 'Foundations, layers, forward pass & backprop',
    icon: Brain,
    prompt: 'Can you explain how neural networks work step-by-step with an intuitive diagram and Python example?',
  },
  {
    title: 'Help with Python code',
    desc: 'Scikit-learn, PyTorch, data preprocessing',
    icon: Terminal,
    prompt: 'Give me a clean Python template for training a machine learning classifier with cross-validation and evaluation metrics.',
  },
  {
    title: 'What is gradient descent?',
    desc: 'Intuition, loss minimization & Adam optimizer',
    icon: Cpu,
    prompt: 'Explain gradient descent, learning rate, and how the Adam optimizer improves convergence.',
  },
  {
    title: 'Review my project idea',
    desc: 'College AI capstone ideas & architecture',
    icon: Compass,
    prompt: 'What are some standout AI project ideas for my college semester project that include computer vision or NLP?',
  },
];

export default function ChatWindow({
  messages = [],
  isGenerating = false,
  streamingContent = '',
  onSelectSuggestion,
  sessionTitle = '',
}) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to bottom whenever messages change or streaming updates
  const scrollToBottom = (behavior = 'smooth') => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, streamingContent, isGenerating]);

  // Initial scroll when session opens
  useEffect(() => {
    scrollToBottom('auto');
  }, [sessionTitle]);

  const isEmpty = messages.length === 0 && !isGenerating && !streamingContent;

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto bg-[#0D1117] relative flex flex-col justify-between"
    >
      {isEmpty ? (
        /* Welcome Screen with Suggestion Chips */
        <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-3xl mx-auto w-full text-center">
          {/* Animated Glow Logo */}
          <div className="relative mb-6">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#2F81F7] via-[#7C3AED] to-[#58A6FF] opacity-40 blur-xl animate-pulse" />
            <div className="relative w-16 h-16 rounded-2xl bg-[#161B22] border border-[#30363D] flex items-center justify-center shadow-2xl">
              <span className="text-3xl select-none">🧠</span>
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
            EduBot AI Study Companion
          </h1>
          <p className="text-sm md:text-base text-[#8B949E] max-w-md mx-auto mb-8">
            Your personal AI tutor for Artificial Intelligence, Machine Learning algorithms, Python debugging, and college class projects.
          </p>

          {/* 4 Suggestion Chips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
            {SUGGESTIONS.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => onSelectSuggestion && onSelectSuggestion(item.prompt)}
                  className="group relative p-4 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#2F81F7] hover:bg-[#1C2128] transition-all duration-200 text-left flex items-start gap-3 shadow-sm hover:shadow-md hover:shadow-[#2F81F7]/5"
                >
                  <div className="p-2 rounded-lg bg-[#21262D] border border-[#30363D] text-[#58A6FF] group-hover:text-white group-hover:bg-[#2F81F7] transition-colors flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-[#E6EDF3] group-hover:text-white flex items-center justify-between">
                      <span>{item.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-[#58A6FF]" />
                    </div>
                    <div className="text-xs text-[#8B949E] mt-0.5 line-clamp-1">
                      {item.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feature highlights bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-8 text-xs text-[#8B949E]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" /> Multi-turn memory
            </span>
            <span>•</span>
            <span>Anthropic Claude streaming</span>
            <span>•</span>
            <span>Firestore saved sessions</span>
          </div>
        </div>
      ) : (
        /* Messages Stream */
        <div className="max-w-4xl mx-auto w-full py-4 space-y-3">
          {messages.map((msg) => (
            <MessageBubble key={msg.id || msg.timestamp} message={msg} />
          ))}

          {/* Active Streaming Bot Message */}
          {isGenerating && streamingContent && (
            <MessageBubble
              message={{
                role: 'assistant',
                content: streamingContent,
                timestamp: null,
              }}
              isStreaming={true}
            />
          )}

          {/* Loading Indicator while waiting for first token */}
          {isGenerating && !streamingContent && (
            <TypingIndicator />
          )}

          <div ref={bottomRef} className="h-4" />
        </div>
      )}
    </div>
  );
}
