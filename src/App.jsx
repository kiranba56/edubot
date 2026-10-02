import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useChat } from './hooks/useChat';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { Toaster } from 'react-hot-toast';
import { Sparkles } from 'lucide-react';

export default function App() {
  const { user, loading, loginWithGoogle, loginAsGuest, logout, isFirebaseConfigured } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Hook into chat operations for current authenticated user
  const {
    sessions,
    activeSessionId,
    activeSession,
    messages,
    isGenerating,
    streamingContent,
    createNewSession,
    selectSession,
    editSessionTitle,
    removeSession,
    sendMessage,
  } = useChat(user?.uid);

  // Loading Screen
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#0D1117] flex flex-col items-center justify-center gap-4 text-white">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#2F81F7] to-[#7C3AED] flex items-center justify-center text-2xl shadow-xl animate-pulse">
            🧠
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#8B949E] font-medium">
          <Sparkles className="w-4 h-4 text-[#7C3AED] animate-spin" />
          <span>Starting EduBot workspace...</span>
        </div>
      </div>
    );
  }

  // Login Screen if not logged in
  if (!user) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#161B22',
              color: '#E6EDF3',
              border: '1px solid #30363D',
              fontSize: '13px',
            },
          }}
        />
        <LoginPage
          onGoogleLogin={loginWithGoogle}
          onGuestLogin={loginAsGuest}
          isConfigured={isFirebaseConfigured}
        />
      </>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#0D1117] text-[#E6EDF3] flex overflow-hidden font-sans">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#161B22',
            color: '#E6EDF3',
            border: '1px solid #30363D',
            fontSize: '13px',
          },
          success: {
            iconTheme: {
              primary: '#3FB950',
              secondary: '#161B22',
            },
          },
        }}
      />

      {/* Sidebar with Chat History & New Chat */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewChat={() => createNewSession('New Chat')}
        onRenameSession={editSessionTitle}
        onDeleteSession={removeSession}
        user={user}
        onLogout={logout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0 bg-[#0D1117] relative">
        <Header
          sessionTitle={activeSession?.title || 'New Conversation'}
          user={user}
          onLogout={logout}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          isGenerating={isGenerating}
        />

        <ChatWindow
          messages={messages}
          isGenerating={isGenerating}
          streamingContent={streamingContent}
          onSelectSuggestion={(prompt) => sendMessage(prompt)}
          sessionTitle={activeSession?.title}
        />

        <MessageInput
          onSendMessage={sendMessage}
          disabled={isGenerating}
        />
      </main>
    </div>
  );
}
