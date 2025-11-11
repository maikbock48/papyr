// Firebase Configuration and Initialization
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

// Firebase configuration
// TODO: Replace with your Firebase project configuration
// Get these from: Firebase Console > Project Settings > General > Your apps > Web app
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "papyr-app",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

let app: FirebaseApp | undefined;
let messaging: Messaging | undefined;

// Initialize Firebase
export function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    // Check if already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
      console.log('[Firebase] App initialized');
    } else {
      app = getApps()[0];
    }

    return app;
  } catch (error) {
    console.error('[Firebase] Initialization error:', error);
    return null;
  }
}

// Get Firebase Messaging instance
export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    if (!app) {
      initializeFirebase();
    }

    if (!messaging && app) {
      messaging = getMessaging(app);
      console.log('[Firebase] Messaging initialized');
    }

    return messaging || null;
  } catch (error) {
    console.error('[Firebase] Messaging error:', error);
    return null;
  }
}

// Request FCM token
export async function requestFCMToken(): Promise<string | null> {
  try {
    const messaging = getFirebaseMessaging();
    if (!messaging) {
      console.log('[Firebase] Messaging not available');
      return null;
    }

    // Register service worker first
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    console.log('[Firebase] Service Worker registered');

    // VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || 'YOUR_VAPID_KEY';

    const token = await getToken(messaging, {
      vapidKey,
      serviceWorkerRegistration: registration
    });

    if (token) {
      console.log('[Firebase] FCM Token:', token);
      // TODO: Send this token to your backend to store it
      // await sendTokenToBackend(token);
      return token;
    } else {
      console.log('[Firebase] No registration token available');
      return null;
    }
  } catch (error) {
    console.error('[Firebase] Error getting token:', error);
    return null;
  }
}

// Listen for foreground messages
export function onForegroundMessage(callback: (payload: any) => void) {
  const messaging = getFirebaseMessaging();
  if (!messaging) {
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('[Firebase] Foreground message received:', payload);
    callback(payload);
  });
}

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  return (
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId !== "papyr-app" &&
    firebaseConfig.messagingSenderId !== "YOUR_SENDER_ID"
  );
}

export { app, messaging };
