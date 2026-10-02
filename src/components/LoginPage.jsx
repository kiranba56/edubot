import React, { useState } from 'react';
import { MessageSquare, History, Brain, ArrowRight, ShieldCheck, School } from 'lucide-react';

export default function LoginPage({ onGoogleLogin, onGuestLogin }) {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [showGuestInput, setShowGuestInput] = useState(false);

  const handleGoogleClick = async () => {
    setIsSigningIn(true);
    try {
      await onGoogleLogin();
    } catch (err) {
      // Toast already shown in context
      console.warn('Google sign-in attempt finished with note:', err?.message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    onGuestLogin(guestName.trim() || 'AI Student');
  };

  return (
    <div className="min-h-screen w-full bg-[#0D1117] flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-[#2F81F7] selection:text-white">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#2F81F7]/15 via-[#7C3AED]/20 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#2F81F7]/10 blur-[100px] pointer-events-none rounded-full" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center">
        {/* Project Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#21262D] border border-[#30363D] text-[11px] font-medium text-[#58A6FF] mb-6">
          <School className="w-3.5 h-3.5 text-[#58A6FF]" />
          <span>College AI Class Project</span>
        </div>

        {/* Logo with pulsating aura */}
        <div className="relative mb-5">
          <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#2F81F7] to-[#7C3AED] opacity-50 blur-lg animate-pulse" />
          <div className="relative w-16 h-16 rounded-2xl bg-[#0D1117] border border-[#30363D] flex items-center justify-center text-3xl shadow-xl">
            <span>🧠</span>
          </div>
        </div>

        {/* Heading & Tagline */}
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
          EduBot
        </h1>
        <p className="text-sm text-[#8B949E] max-w-xs mb-7 leading-relaxed">
          Your AI-Powered Study Companion for Artificial Intelligence, Machine Learning, & Code
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8 w-full">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs text-[#E6EDF3]">
            <MessageSquare className="w-3.5 h-3.5 text-[#2F81F7]" />
            <span>Multi-session chats</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs text-[#E6EDF3]">
            <Brain className="w-3.5 h-3.5 text-[#7C3AED]" />
            <span>AI-powered answers</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#21262D] border border-[#30363D] text-xs text-[#E6EDF3]">
            <History className="w-3.5 h-3.5 text-[#3FB950]" />
            <span>Saves history</span>
          </div>
        </div>

        {/* Official Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleClick}
          disabled={isSigningIn}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#1F2328] font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {/* Google Official SVG G Icon */}
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{isSigningIn ? 'Signing in with Google...' : 'Continue with Google'}</span>
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5 w-full">
          <div className="flex-1 h-[1px] bg-[#30363D]" />
          <span className="text-[11px] text-[#8B949E] uppercase tracking-wider">or</span>
          <div className="flex-1 h-[1px] bg-[#30363D]" />
        </div>

        {/* Guest Demo Login */}
        {!showGuestInput ? (
          <button
            type="button"
            onClick={() => setShowGuestInput(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#21262D] hover:bg-[#30363D] border border-[#30363D] text-xs font-medium text-[#E6EDF3] transition-all flex items-center justify-center gap-2"
          >
            <span>Instant Demo / Guest Student Mode</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#8B949E]" />
          </button>
        ) : (
          <form onSubmit={handleGuestSubmit} className="w-full flex flex-col gap-2 animate-fade-in">
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your student name (e.g. Alex Chen)"
              className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2 text-xs text-white placeholder-[#8B949E] focus:outline-none focus:border-[#2F81F7]"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 py-2 px-3 rounded-lg bg-[#2F81F7] hover:bg-[#256cd1] text-xs font-semibold text-white transition-all shadow-md shadow-[#2F81F7]/20"
              >
                Start Exploring
              </button>
              <button
                type="button"
                onClick={() => setShowGuestInput(false)}
                className="py-2 px-3 rounded-lg bg-[#21262D] hover:bg-[#30363D] text-xs text-[#8B949E] border border-[#30363D]"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Security / Academic note */}
        <p className="text-[11px] text-[#8B949E] mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#3FB950]" />
          Secured with Firebase Auth & Cloud Firestore
        </p>
      </div>

      {/* Footer credits */}
      <footer className="mt-8 text-center text-xs text-[#8B949E] relative z-10">
        Built for College AI Class Project • Anthropic Claude & Firebase
      </footer>
    </div>
  );
}
