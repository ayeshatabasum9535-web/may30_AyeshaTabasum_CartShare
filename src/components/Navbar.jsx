import React, { useState } from 'react';
import { ShoppingCart, Sun, Moon, LogOut, Copy, Check } from 'lucide-react';


export default function Navbar({ roomCode, username, isDarkMode, toggleDarkMode, onLeaveRoom }) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-blue-100 bg-white px-4 py-3 shadow-sm transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
        
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200 dark:shadow-none">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-xl tracking-tight text-blue-900 dark:text-blue-400">CartShare</h1>
            <span className="text-xs text-slate-600 dark:text-slate-300">Collaborative Shopping</span>
          </div>
        </div>

        {/* Room Code Display & Copy (If inside a room) */}
        {roomCode && (
          <div className="flex items-center gap-1.5 rounded-lg bg-blue-50/80 px-3 py-1.5 text-sm font-medium text-blue-800 transition-colors dark:bg-slate-800 dark:text-blue-300">
            <span className="text-slate-600 dark:text-slate-300">Room:</span>
            <span className="font-mono font-bold tracking-wider">{roomCode}</span>
            <button
              onClick={copyRoomCode}
              className="ml-1 rounded p-1 hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
              title="Copy Room Code"
              aria-label="Copy Room Code"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600 dark:text-green-400 animate-pulse" />
              ) : (
                <Copy className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
            </button>
          </div>
        )}

        {/* User profile, theme toggle and exit button */}
        <div className="flex items-center gap-3">
          {username && (
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-slate-600 dark:text-slate-300">Active User</span>
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{username}</span>
            </div>
          )}

          {/* Theme Toggler */}
          <button
            onClick={toggleDarkMode}
            className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-all duration-200"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          {/* Exit / Leave Room */}
          {roomCode && (
            <button
              onClick={onLeaveRoom}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-900/30 transition-all duration-200"
              title="Leave Room"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Leave</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
