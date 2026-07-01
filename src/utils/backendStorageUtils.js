

import { createRoomApi, getRoomApi, updateRoomApi } from './api';

export async function getRoom(roomCode) {
  if (!roomCode) return null;
  return await getRoomApi(roomCode.toUpperCase());
}

export async function createRoomInStorage(roomCode) {
  if (!roomCode) return null;
  return await createRoomApi(roomCode.toUpperCase());
}

export async function saveRoom(roomCode, roomData) {
  if (!roomCode || !roomData) return null;
  return await updateRoomApi(roomCode.toUpperCase(), roomData);
}

/**
 * Saves updated room state AND appends a log entry in ONE API call.
 * This replaces the previous two-step pattern that caused race conditions
 * when multiple users were editing simultaneously.
 */
export async function saveRoomWithLog(roomCode, updatedRoom, userName, action, itemName) {
  if (!roomCode || !updatedRoom) return null;

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userName,
    action,
    itemName,
    timestamp: new Date().toISOString()
  };

  const finalRoom = {
    ...updatedRoom,
    activityLog: [logEntry, ...(updatedRoom.activityLog || [])]
  };

  return await updateRoomApi(roomCode.toUpperCase(), finalRoom);
}



export function getCurrentUser() {
  const data = localStorage.getItem('cartshare_user_session');
  return data ? JSON.parse(data) : null;
}

export function saveCurrentUser(user) {
  localStorage.setItem('cartshare_user_session', JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem('cartshare_user_session');
}
