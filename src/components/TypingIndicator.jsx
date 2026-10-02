import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 max-w-3xl my-3 px-4 animate-fade-in">
      {/* Bot Avatar */}
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2F81F7] to-[#7C3AED] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#2F81F7]/10 mt-1">
        <Bot className="w-4 h-4 text-white animate-pulse" />
      </div>

      {/* Bubble with animated dots */}
      <div className="bg-[#161B22] border border-[#30363D] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#7C3AED] typing-dot-1" />
        <span className="w-2 h-2 rounded-full bg-[#2F81F7] typing-dot-2" />
        <span className="w-2 h-2 rounded-full bg-[#58A6FF] typing-dot-3" />
        <span className="text-xs text-[#8B949E] ml-2 font-mono flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-[#7C3AED]" /> Thinking...
        </span>
      </div>
    </div>
  );
}
