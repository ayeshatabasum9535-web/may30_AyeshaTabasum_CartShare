import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, PlusCircle, ArrowRight, Loader2 } from 'lucide-react';
import { getRoom } from '../utils/backendStorageUtils';

export default function Home({ onJoinRoom, onCreateRoom, presetRoomCode = '' }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (presetRoomCode) {
      setRoomCode(presetRoomCode.toUpperCase());
      setIsJoining(true);
    }
  }, [presetRoomCode]);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter a username first.');
      return;
    }
    setIsLoading(true);
    try {
  
      await onCreateRoom(username.trim());
    } catch (err) {
      setError(
        err.message?.includes('Failed to fetch')
          ? 'Cannot reach server. Make sure the backend is running on port 4000.'
          : err.message || 'Could not create room. Is the server running?'
      );
      setIsLoading(false);
    }

  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    setError('');
    const cleanUsername = username.trim();
    const cleanRoomCode = roomCode.trim().toUpperCase();

    if (!cleanUsername) {
      setError('Please enter a username first.');
      return;
    }
    if (cleanRoomCode.length !== 6) {
      setError('Room code must be exactly 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await getRoom(cleanRoomCode);
    } catch (err) {
      setError('Room not found. Double-check the code or create a new room.');
      setIsLoading(false);
      return;
    }

    try {
      await onJoinRoom(cleanUsername, cleanRoomCode);
    } catch (err) {
      setError(err.message || 'Could not join room. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Welcome to CartShare</h2>
          <p className="mt-1.5 text-xs text-blue-100 uppercase tracking-widest font-semibold">
            Real-Time Shared Shopping List
          </p>
        </div>

        {/* Form Panel */}
        <div className="p-8">

          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Username */}
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                1. Your Username
              </label>
              <input
                id="username"
                type="text"
                maxLength="20"
                placeholder="e.g., Ayesha, Rahul"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 disabled:opacity-60"
              />
            </div>

            {/* Mode switcher */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                2. Select Session Action
              </label>

              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-200 p-1 dark:bg-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsJoining(false); setError(''); }}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    !isJoining
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100'
                  }`}
                >
                  Create New Room
                </button>
                <button
                  type="button"
                  onClick={() => { setIsJoining(true); setError(''); }}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    isJoining
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100'
                  }`}
                >
                  Join Room
                </button>
              </div>

              {!isJoining ? (
                <form onSubmit={handleCreateRoom}>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg dark:shadow-none transition-all duration-200 disabled:opacity-60"
                  >
                    {isLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <PlusCircle className="h-4 w-4" />
                    }
                    <span>{isLoading ? 'Creating...' : 'Create Session Room'}</span>
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <p className="mt-2.5 text-center text-[10px] text-slate-600 dark:text-slate-400">
                    A unique 6-character code will be generated for your friends to join.
                  </p>
                </form>
              ) : (
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-char Room Code (e.g. ABC123)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    disabled={isLoading}
                    className="w-full text-center font-mono font-bold tracking-widest rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-black outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:border-blue-500 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg dark:shadow-none transition-all duration-200 disabled:opacity-60"
                  >
                    {isLoading
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <LogIn className="h-4 w-4" />
                    }
                    <span>{isLoading ? 'Joining...' : 'Join Shared Room'}</span>
                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
