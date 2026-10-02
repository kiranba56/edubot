import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  LogOut, 
  Search
} from 'lucide-react';
import { formatSessionTime } from '../utils/formatDate';

export default function Sidebar({
  sessions = [],
  activeSessionId = null,
  onSelectSession,
  onNewChat,
  onRenameSession,
  onDeleteSession,
  user,
  onLogout,
  isOpen = false,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStartRename = (session, e) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditingTitle(session.title || 'Untitled Chat');
  };

  const handleSaveRename = (sessionId, e) => {
    if (e) e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameSession(sessionId, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e) => {
    if (e) e.stopPropagation();
    setEditingId(null);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
      setSessionToDelete(null);
    }
  };

  const filteredSessions = sessions.filter(s => 
    (s.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-[270px] bg-[#161B22] border-r border-[#30363D] flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & New Chat */}
        <div className="p-4 border-b border-[#30363D] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2F81F7] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-[#2F81F7]/20">
                <span className="text-lg select-none">🧠</span>
              </div>
              <div>
                <span className="font-bold text-[#E6EDF3] text-base tracking-tight flex items-center gap-1.5">
                  EduBot
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/40 font-mono">
                    AI
                  </span>
                </span>
                <p className="text-[11px] text-[#8B949E]">College AI Assistant</p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="p-1 rounded-md text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#21262D] md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            type="button"
            onClick={() => {
              onNewChat();
              if (onClose) onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#2F81F7] hover:bg-[#256cd1] text-white text-sm font-semibold transition-all duration-200 shadow-md shadow-[#2F81F7]/20 active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Chat</span>
          </button>

          {/* Search sessions if more than 4 */}
          {sessions.length > 4 && (
            <div className="relative mt-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8B949E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-[#21262D] border border-[#30363D] text-[#E6EDF3] placeholder-[#8B949E] rounded-lg pl-8 pr-2.5 py-1 text-xs focus:outline-none focus:border-[#2F81F7]"
              />
            </div>
          )}
        </div>

        {/* Scrollable Sessions List */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          <div className="px-2 pb-1 text-[11px] font-medium text-[#8B949E] uppercase tracking-wider">
            Recent Chats
          </div>

          {filteredSessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-[#8B949E]">
              {searchQuery ? 'No matching conversations' : 'No past conversations yet. Start a new chat!'}
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    if (!isEditing) {
                      onSelectSession(session.id);
                      if (onClose) onClose();
                    }
                  }}
                  onDoubleClick={(e) => handleStartRename(session, e)}
                  className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#21262D] text-[#58A6FF] font-medium border border-[#30363D]'
                      : 'text-[#E6EDF3] hover:bg-[#1C2128] hover:text-white border border-transparent'
                  }`}
                  title="Double-click to rename"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-1">
                    <MessageSquare className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[#58A6FF]' : 'text-[#8B949E]'}`} />

                    {isEditing ? (
                      <div className="flex items-center gap-1 w-full" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRename(session.id, e);
                            if (e.key === 'Escape') handleCancelRename(e);
                          }}
                          autoFocus
                          className="w-full bg-[#0D1117] border border-[#2F81F7] rounded px-1.5 py-0.5 text-xs text-white focus:outline-none"
                        />
                        <button
                          onClick={(e) => handleSaveRename(session.id, e)}
                          className="p-1 hover:text-[#3FB950] text-[#8B949E]"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={handleCancelRename}
                          className="p-1 hover:text-[#F85149] text-[#8B949E]"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col min-w-0">
                        <span className="truncate leading-snug">
                          {session.title || 'Untitled Chat'}
                        </span>
                        <span className="text-[10px] text-[#8B949E] font-normal">
                          {formatSessionTime(session.updatedAt || session.createdAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action buttons (Rename & Delete) */}
                  {!isEditing && (
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => handleStartRename(session, e)}
                        className="p-1 text-[#8B949E] hover:text-white rounded hover:bg-[#30363D]"
                        title="Rename chat (or double click)"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSessionToDelete(session);
                        }}
                        className="p-1 text-[#8B949E] hover:text-[#F85149] rounded hover:bg-[#30363D]"
                        title="Delete chat"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* User Profile & Logout Bottom Bar */}
        <div className="p-3 border-t border-[#30363D] bg-[#161B22]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#21262D]/60 border border-[#30363D]/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={
                  user?.photoURL ||
                  `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user?.displayName || 'Student')}`
                }
                alt={user?.displayName || 'User Avatar'}
                className="w-8 h-8 rounded-full border border-[#30363D] object-cover flex-shrink-0 bg-[#0D1117]"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-[#E6EDF3] truncate">
                  {user?.displayName || 'College Student'}
                </span>
                <span className="text-[10px] text-[#8B949E] truncate">
                  {user?.isGuest ? 'Guest Session' : (user?.email || 'Logged In')}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-[#8B949E] hover:text-[#F85149] hover:bg-[#30363D]/60 transition-colors"
              title="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Delete Confirmation Modal */}
      {sessionToDelete && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-[#161B22] border border-[#30363D] rounded-2xl max-w-sm w-full p-5 shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-2">Delete chat session?</h3>
            <p className="text-xs text-[#8B949E] leading-relaxed mb-5">
              Are you sure you want to delete <span className="text-white font-medium">"{sessionToDelete.title}"</span>? This will permanently remove all messages in this conversation.
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSessionToDelete(null)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#E6EDF3] hover:bg-[#21262D] border border-[#30363D]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-[#DA3633] hover:bg-[#b92c2a] text-white shadow-md shadow-[#DA3633]/20"
              >
                Delete Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
