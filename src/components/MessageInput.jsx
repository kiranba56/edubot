import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

export default function MessageInput({ onSendMessage, disabled = false, placeholder = "Ask EduBot about AI/ML, Python, algorithms, or project ideas..." }) {
  const [text, setText] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea up to 4 rows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 4 * 24 + 16; // Approx 4 rows
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!text.trim() || disabled) return;

    onSendMessage(text);
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const charCount = text.length;
  const isSendDisabled = disabled || !text.trim();

  return (
    <div className="w-full bg-[#161B22] border-t border-[#30363D] p-3 md:p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex flex-col gap-2">
        <div className="relative flex items-end gap-2 bg-[#21262D] border border-[#30363D] focus-within:border-[#2F81F7] focus-within:ring-1 focus-within:ring-[#2F81F7]/30 rounded-xl px-3 py-2 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={disabled ? "EduBot is generating a response..." : placeholder}
            className="w-full bg-transparent text-[#E6EDF3] placeholder-[#8B949E] text-sm resize-none focus:outline-none leading-relaxed py-1.5 min-h-[38px] max-h-[120px] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isSendDisabled}
            className={`p-2 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
              isSendDisabled
                ? 'bg-[#30363D]/50 text-[#8B949E]/50 cursor-not-allowed'
                : 'bg-[#2F81F7] text-white hover:bg-[#2368c4] active:scale-95 shadow-md shadow-[#2F81F7]/20'
            }`}
            title="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Footer info: Hint + Character Counter */}
        <div className="flex items-center justify-between text-[11px] text-[#8B949E] px-1">
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline">Press</span>
            <kbd className="px-1.5 py-0.5 bg-[#21262D] border border-[#30363D] rounded text-[10px] text-[#E6EDF3] font-mono flex items-center gap-0.5">
              Enter <CornerDownLeft className="w-2.5 h-2.5" />
            </kbd>
            <span className="hidden sm:inline">to send,</span>
            <kbd className="hidden sm:inline px-1.5 py-0.5 bg-[#21262D] border border-[#30363D] rounded text-[10px] text-[#E6EDF3] font-mono">
              Shift + Enter
            </kbd>
            <span className="hidden sm:inline">for newline</span>
          </div>

          {charCount > 500 && (
            <span className={`font-mono ${charCount > 2000 ? 'text-[#F85149]' : 'text-[#8B949E]'}`}>
              {charCount} characters
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
