import { 
  collection, 
  doc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const LOCAL_STORAGE_SESSIONS_KEY = 'edubot_local_sessions';
const LOCAL_STORAGE_MESSAGES_KEY = 'edubot_local_messages';

// Local Event Listeners for seamless reactivity in Guest/Offline mode
const sessionSubscribers = new Set();
const messageSubscribers = new Map(); // sessionId -> Set(callbacks)

function notifySessionSubscribers(userId) {
  const sessions = getLocalSessions(userId);
  sessionSubscribers.forEach(cb => {
    try { cb(sessions); } catch (e) { console.error(e); }
  });
}

function notifyMessageSubscribers(userId, sessionId) {
  const messages = getLocalMessages(userId, sessionId);
  const set = messageSubscribers.get(sessionId);
  if (set) {
    set.forEach(cb => {
      try { cb(messages); } catch (e) { console.error(e); }
    });
  }
}

// Helper for local mock fallback
function getLocalSessions(userId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SESSIONS_KEY}_${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSessions(userId, sessions) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_SESSIONS_KEY}_${userId}`, JSON.stringify(sessions));
    notifySessionSubscribers(userId);
  } catch (e) {
    console.error('Local storage save error:', e);
  }
}

function getLocalMessages(userId, sessionId) {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_MESSAGES_KEY}_${userId}_${sessionId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalMessages(userId, sessionId, messages) {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_MESSAGES_KEY}_${userId}_${sessionId}`, JSON.stringify(messages));
    notifyMessageSubscribers(userId, sessionId);
  } catch (e) {
    console.error('Local storage save error:', e);
  }
}

/**
 * Create a new chat session for a user.
 */
export async function createChatSession(userId, initialTitle = 'New Chat') {
  if (isFirebaseConfigured && db && userId && !userId.startsWith('guest_')) {
    try {
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const docRef = await addDoc(sessionsRef, {
        title: initialTitle.slice(0, 40),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        messageCount: 0,
      });
      return docRef.id;
    } catch (err) {
      console.warn('Firestore createChatSession failed, falling back to local storage:', err);
    }
  }

  // Local storage fallback
  const sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const sessions = getLocalSessions(userId);
  const newSession = {
    id: sessionId,
    title: initialTitle.slice(0, 40),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    messageCount: 0,
  };
  saveLocalSessions(userId, [newSession, ...sessions]);
  return sessionId;
}

/**
 * Subscribe to a user's chat sessions in real-time.
 */
export function subscribeToSessions(userId, callback) {
  if (isFirebaseConfigured && db && userId && !userId.startsWith('guest_')) {
    try {
      const sessionsRef = collection(db, 'users', userId, 'sessions');
      const q = query(sessionsRef, orderBy('updatedAt', 'desc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const sessions = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(sessions);
      }, (error) => {
        console.warn('Firestore session snapshot listener error:', error);
        callback(getLocalSessions(userId));
      });

      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscribeToSessions error:', err);
    }
  }

  // Local storage fallback with reactive subscription
  sessionSubscribers.add(callback);
  callback(getLocalSessions(userId));
  return () => {
    sessionSubscribers.delete(callback);
  };
}

/**
 * Rename a chat session.
 */
export async function renameChatSession(userId, sessionId, newTitle) {
  const sanitizedTitle = (newTitle || 'Untitled Chat').trim().slice(0, 40);

  if (isFirebaseConfigured && db && userId && !userId.startsWith('guest_')) {
    try {
      const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
      await updateDoc(sessionRef, {
        title: sanitizedTitle,
        updatedAt: serverTimestamp(),
      });
      return;
    } catch (err) {
      console.warn('Firestore renameChatSession failed, using local storage fallback:', err);
    }
  }

  // Local fallback
  const sessions = getLocalSessions(userId);
  const updated = sessions.map(s => s.id === sessionId ? { ...s, title: sanitizedTitle, updatedAt: new Date().toISOString() } : s);
  saveLocalSessions(userId, updated);
}

/**
 * Delete a chat session and all its messages.
 */
export async function deleteChatSession(userId, sessionId) {
  if (isFirebaseConfigured && db && userId && !userId.startsWith('guest_')) {
    try {
      const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
      const msgSnap = await getDocs(messagesRef);
      const batch = writeBatch(db);
      
      msgSnap.forEach((docItem) => {
        batch.delete(docItem.ref);
      });
      
      const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
      batch.delete(sessionRef);
      await batch.commit();
      return;
    } catch (err) {
      console.warn('Firestore deleteChatSession failed, using local storage fallback:', err);
    }
  }

  // Local fallback
  const sessions = getLocalSessions(userId).filter(s => s.id !== sessionId);
  saveLocalSessions(userId, sessions);
  localStorage.removeItem(`${LOCAL_STORAGE_MESSAGES_KEY}_${userId}_${sessionId}`);
  messageSubscribers.delete(sessionId);
}

/**
 * Subscribe to messages in a specific session in real-time.
 */
export function subscribeToMessages(userId, sessionId, callback) {
  if (!sessionId) {
    callback([]);
    return () => {};
  }

  if (isFirebaseConfigured && db && userId && !userId.startsWith('guest_')) {
    try {
      const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(messages);
      }, (error) => {
        console.warn('Firestore messages listener error:', error);
        callback(getLocalMessages(userId, sessionId));
      });

      return unsubscribe;
    } catch (err) {
      console.warn('Firestore subscribeToMessages error:', err);
    }
  }

  // Local storage fallback with reactive subscription
  if (!messageSubscribers.has(sessionId)) {
    messageSubscribers.set(sessionId, new Set());
  }
  const set = messageSubscribers.get(sessionId);
  set.add(callback);
  callback(getLocalMessages(userId, sessionId));

  return () => {
    set.delete(callback);
    if (set.size === 0) {
      messageSubscribers.delete(sessionId);
    }
  };
}

/**
 * Save a message (user or assistant) to Firestore or local storage.
 * Automatically updates session's updatedAt, messageCount, and generates title from 1st message.
 */
export async function saveMessage(userId, sessionId, role, content, updateTitleIfFirst = false) {
  if (!userId || !sessionId || !content) return null;

  if (isFirebaseConfigured && db && !userId.startsWith('guest_')) {
    try {
      const messagesRef = collection(db, 'users', userId, 'sessions', sessionId, 'messages');
      const docRef = await addDoc(messagesRef, {
        role,
        content,
        timestamp: serverTimestamp(),
      });

      const sessionRef = doc(db, 'users', userId, 'sessions', sessionId);
      const updates = {
        updatedAt: serverTimestamp(),
        messageCount: increment(1),
      };

      if (updateTitleIfFirst) {
        updates.title = content.replace(/\n/g, ' ').trim().slice(0, 40) || 'New Conversation';
      }

      await updateDoc(sessionRef, updates);
      return docRef.id;
    } catch (err) {
      console.warn('Firestore saveMessage failed, falling back to local:', err);
    }
  }

  // Local storage fallback
  const messages = getLocalMessages(userId, sessionId);
  const newMessage = {
    id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    role,
    content,
    timestamp: new Date().toISOString(),
  };
  saveLocalMessages(userId, sessionId, [...messages, newMessage]);

  // Update local session
  const sessions = getLocalSessions(userId);
  const updatedSessions = sessions.map(s => {
    if (s.id === sessionId) {
      const updated = {
        ...s,
        updatedAt: new Date().toISOString(),
        messageCount: (s.messageCount || 0) + 1,
      };
      if (updateTitleIfFirst) {
        updated.title = content.replace(/\n/g, ' ').trim().slice(0, 40) || 'New Conversation';
      }
      return updated;
    }
    return s;
  });
  saveLocalSessions(userId, updatedSessions);

  return newMessage.id;
}
