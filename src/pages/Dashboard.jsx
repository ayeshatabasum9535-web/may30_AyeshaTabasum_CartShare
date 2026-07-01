import React, { useState, useEffect, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Participants from '../components/Participants';
import Cart from '../components/Cart';
import ActivityLog from '../components/ActivityLog';
import Receipt from '../components/Receipt';
import { getRoom, saveRoom, saveRoomWithLog } from '../utils/backendStorageUtils';

const POLL_INTERVAL_MS = 3000; 
export default function Dashboard({ username, roomCode, onLeaveRoom, isDarkMode, toggleDarkMode }) {
  const [roomData, setRoomData] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [mutationError, setMutationError] = useState('');
  const pollingRef = useRef(null);

  const fetchRoom = useCallback(async () => {
    if (!roomCode || !username) return;
    try {
      const room = await getRoom(roomCode);
      if (!room) return;
      setRoomData(room);
    } catch {

    }
  }, [roomCode, username]);

  useEffect(() => {
    if (!roomCode || !username) return;


    const initialLoad = async () => {
      try {
        const room = await getRoom(roomCode);
        if (!room) return;

        const userExists = room.participants.some(
          (p) => p.name.toLowerCase() === username.toLowerCase()
        );

        if (!userExists) {
          const newParticipant = {
            id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: username,
            joinedAt: new Date().toISOString()
          };
          const updatedRoom = {
            ...room,
            participants: [...room.participants, newParticipant]
          };
        
          const finalRoom = await saveRoomWithLog(roomCode, updatedRoom, username, 'joined', 'the room');
          setRoomData(finalRoom || updatedRoom);
        } else {
          setRoomData(room);
        }
      } catch (err) {
        console.error('Failed to load room:', err);
      }
    };

    initialLoad();

  
    pollingRef.current = setInterval(fetchRoom, POLL_INTERVAL_MS);
    return () => clearInterval(pollingRef.current);
  }, [roomCode, username, fetchRoom]);



  const clearError = () => setMutationError('');


  const triggerStateUpdate = async (updatedRoom, action, itemName) => {
    try {
      const finalRoom = await saveRoomWithLog(roomCode, updatedRoom, username, action, itemName);
      setRoomData(finalRoom || updatedRoom);
      clearError();
      return finalRoom || updatedRoom;
    } catch (err) {
      setMutationError('Could not save changes — is the server running?');
      return null;
    }
  };



  const handleAddItem = async (itemDetails) => {
    const newItem = {
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      name: itemDetails.name,
      quantity: itemDetails.quantity,
      price: itemDetails.price,
      addedBy: username,
      createdAt: new Date().toISOString()
    };

    const updatedRoom = {
      ...roomData,
      items: [...roomData.items, newItem]
    };

    await triggerStateUpdate(updatedRoom, 'added', itemDetails.name);
  };

  const handleEditItem = async (itemId, updatedDetails) => {
    const targetItem = roomData.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    let actionLabel = 'updated';
    if (targetItem.quantity !== updatedDetails.quantity && targetItem.name === updatedDetails.name) {
      actionLabel = 'updated quantity of';
    } else if (targetItem.price !== updatedDetails.price && targetItem.name === updatedDetails.name) {
      actionLabel = 'updated price of';
    }

    const updatedItems = roomData.items.map((item) =>
      item.id === itemId
        ? { ...item, ...updatedDetails, updatedBy: username }
        : item
    );

    await triggerStateUpdate({ ...roomData, items: updatedItems }, actionLabel, updatedDetails.name);
  };

  const handleDeleteItem = async (itemId) => {
    const targetItem = roomData.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const updatedItems = roomData.items.filter((item) => item.id !== itemId);
    await triggerStateUpdate({ ...roomData, items: updatedItems }, 'removed', targetItem.name);
  };

  const handleClearCart = async () => {
    if (roomData.items.length === 0) return;
    await triggerStateUpdate({ ...roomData, items: [] }, 'cleared', 'the cart');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  if (!roomData) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 text-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-slate-700 dark:text-slate-300">Loading collaborative room session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">

      {/* Navigation Header */}
      <Navbar
        roomCode={roomCode}
        username={username}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        onLeaveRoom={onLeaveRoom}
      />

      {/* Mutation error banner */}
      {mutationError && (
        <div className="mx-auto mt-3 max-w-7xl px-4">
          <div className="flex items-center justify-between rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
            <span>{mutationError}</span>
            <button onClick={clearError} className="ml-4 text-xs underline opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        </div>
      )}

      {/* Main Responsive Grid Layout
          FIX: Added md:grid-cols-3 so the sidebar is visible on tablets too,
          not just on lg (1024px+) screens. */}
      <main className="mx-auto mt-6 max-w-7xl px-4">
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">

          {/* Cart section */}
          <div className="md:col-span-2 lg:col-span-3 flex flex-col gap-6">
            <Cart
              items={roomData.items}
              onAddItem={handleAddItem}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
              onClearCart={handleClearCart}
              onOpenReceipt={() => setIsReceiptOpen(true)}
              currentUsername={username}
            />
          </div>

          {/* Sidebar: Participants & Activity Log */}
          <div className="md:col-span-1 flex flex-col gap-6">
            <Participants
              participants={roomData.participants}
              currentUsername={username}
            />
            <ActivityLog
              logs={roomData.activityLog}
            />
          </div>

        </div>
      </main>

      {/* Receipt Modal */}
      <Receipt
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        roomCode={roomCode}
        items={roomData.items}
        logs={roomData.activityLog}
      />

    </div>
  );
}
