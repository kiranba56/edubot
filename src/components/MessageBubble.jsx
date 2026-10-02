import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bot, User, Check, Copy } from 'lucide-react';
import { formatMessageTime } from '../utils/formatDate';

export default function MessageBubble({ message, isStreaming = false }) {
  const isBot = message.role === 'assistant';
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, index) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className={`flex w-full px-4 py-2 ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex items-start gap-3 max-w-[90%] md:max-w-[78%] lg:max-w-[72%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md mt-1 ${
            isBot
              ? 'bg-gradient-to-br from-[#2F81F7] to-[#7C3AED] text-white shadow-[#2F81F7]/10'
              : 'bg-[#21262D] border border-[#30363D] text-[#58A6FF]'
          }`}
        >
          {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
        </div>

        {/* Bubble Content */}
        <div className="flex flex-col flex-1 min-w-0">
          <div
            className={`rounded-2xl px-4 py-3 border transition-colors ${
              isBot
                ? 'bg-[#161B22] border-[#30363D] text-[#E6EDF3] rounded-tl-sm shadow-sm'
                : 'bg-[#1C2128] border-[#30363D] text-[#E6EDF3] rounded-tr-sm'
            }`}
          >
            {isBot ? (
              <div className="markdown-body">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      const codeContent = String(children).replace(/\n$/, '');
                      const codeKey = match ? match[1] + codeContent.slice(0, 10) : codeContent.slice(0, 10);

                      return !inline ? (
                        <div className="my-3 rounded-lg overflow-hidden border border-[#30363D] bg-[#0D1117]">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-[#161B22] border-b border-[#30363D] text-xs font-mono text-[#8B949E]">
                            <span className="text-[#58A6FF] font-medium uppercase tracking-wider">
                              {match ? match[1] : 'code'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyCode(codeContent, codeKey)}
                              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-[#21262D] hover:text-[#E6EDF3] transition-colors"
                              title="Copy code to clipboard"
                            >
                              {copiedIndex === codeKey ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-[#3FB950]" />
                                  <span className="text-[#3FB950]">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={vscDarkPlus}
                            language={match ? match[1] : 'text'}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              padding: '12px 16px',
                              background: '#0D1117',
                              fontSize: '13px',
                              lineHeight: '1.5',
                            }}
                            {...props}
                          >
                            {codeContent}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>

                {isStreaming && (
                  <span className="inline-block w-2 h-4 ml-1 bg-[#58A6FF] animate-pulse align-middle" />
                )}
              </div>
            ) : (
              <div className="whitespace-pre-wrap break-words text-[14.5px] leading-relaxed">
                {message.content}
              </div>
            )}
          </div>

          {/* Timestamp and label */}
          <div
            className={`flex items-center gap-1.5 mt-1 text-[11px] text-[#8B949E] px-1 ${
              isBot ? 'justify-start' : 'justify-end'
            }`}
          >
            <span>{isBot ? 'EduBot' : 'You'}</span>
            <span>•</span>
            <span>{formatMessageTime(message.timestamp) || (isStreaming ? 'Streaming...' : 'Just now')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
