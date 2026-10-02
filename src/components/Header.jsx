import React from 'react';
import { Menu, Sparkles, LogOut } from 'lucide-react';

export default function Header({
  sessionTitle = 'New Chat',
  user,
  onLogout,
  onOpenSidebar,
  isGenerating = false,
}) {
  return (
    <header className="h-14 bg-[#161B22] border-b border-[#30363D] px-4 flex items-center justify-between flex-shrink-0 z-10">
      {/* Left: Mobile hamburger & Active Session Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="md:hidden p-1.5 rounded-lg text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D]"
          title="Open chat history"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <h2 className="text-sm font-semibold text-[#E6EDF3] truncate max-w-[180px] sm:max-w-[320px] md:max-w-[450px]">
            {sessionTitle || 'New Conversation'}
          </h2>
          {isGenerating ? (
            <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30 font-mono animate-pulse">
              <Sparkles className="w-2.5 h-2.5" /> Generating
            </span>
          ) : (
            <span className="hidden sm:flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-[#238636]/15 text-[#3FB950] border border-[#238636]/30 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3FB950]" /> Ready
            </span>
          )}
        </div>
      </div>

      {/* Right: AI Model badge + User Profile / Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-[#8B949E] bg-[#21262D] px-2.5 py-1 rounded-lg border border-[#30363D]">
          <Sparkles className="w-3.5 h-3.5 text-[#2F81F7]" />
          <span>Claude Haiku 4.5</span>
        </div>

        {/* User quick pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#30363D]">
          <img
            src={
              user?.photoURL ||
              `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.displayName || 'Student')}`
            }
            alt={user?.displayName || 'User'}
            className="w-7 h-7 rounded-full border border-[#30363D] object-cover bg-[#0D1117]"
          />
          <button
            onClick={onLogout}
            className="hidden sm:flex items-center gap-1 text-xs text-[#8B949E] hover:text-[#F85149] px-2 py-1 rounded-md hover:bg-[#21262D] transition-colors"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
