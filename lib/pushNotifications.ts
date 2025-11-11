// Web Push Notifications Management

// Check if browser supports push notifications
export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'serviceWorker' in navigator && 'PushManager' in window;
}

// Register service worker
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushSupported()) {
    console.log('Push notifications are not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
    console.log('Service Worker registered:', registration);
    return registration;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return null;
  }
}

// Request notification permission
export async function requestPushPermission(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Subscribe to push notifications
export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }

  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    let subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
      // VAPID public key (you would normally get this from your server)
      // For now, we'll use a demo key - in production, generate your own!
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrysLswo3xKJxYmDXQKqKDRvHmQFgF8ZTPAZYJIgvM_D5l-Nv4U';

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });

      console.log('Push subscription created:', subscription);

      // In a real app, you would send this subscription to your server
      // await sendSubscriptionToServer(subscription);
    }

    return subscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      console.log('Unsubscribed from push');
      // In a real app, notify your server
      // await removeSubscriptionFromServer(subscription);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
}

// Check if currently subscribed to push
export async function isPushSubscribed(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking push subscription:', error);
    return false;
  }
}

// Send a test push notification (simulates server-side push)
export async function sendTestPush(): Promise<boolean> {
  if (!isPushSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Simulate a push event (in production, this would come from your server)
    // We'll use the Notification API directly as a fallback
    if (Notification.permission === 'granted') {
      const messages = [
        'Zeit für dein Bekenntnis! 📝',
        'Dein PAPYR wartet auf dich. ✨',
        'Was wird heute dein Ziel sein? 🎯',
        'Schreib deinen Zettel und siegle ihn. 🔥',
        'Die Stunde des Wolfs naht. Bist du bereit? 🌙',
        'Dein Erfolg beginnt mit einem Zettel. 💪',
      ];

      const randomMessage = messages[Math.floor(Math.random() * messages.length)];

      await registration.showNotification('PAPYR Test', {
        body: randomMessage,
        icon: '/assets/PAPYR.png',
        badge: '/assets/PAPYR.png',
        tag: 'papyr-test',
        requireInteraction: false,
        vibrate: [200, 100, 200],
        data: {
          url: '/',
          timestamp: Date.now()
        }
      });

      return true;
    }

    return false;
  } catch (error) {
    console.error('Error sending test push:', error);
    return false;
  }
}

// Schedule notifications for specific times
export async function scheduleNotification(hour: number, minute: number, message: string): Promise<void> {
  if (!isPushSupported()) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    // If the time has already passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();

    // Use setTimeout to schedule notification
    // Note: This only works while the app is open
    // For true background notifications, you'd need a backend service
    setTimeout(async () => {
      if (Notification.permission === 'granted') {
        await registration.showNotification('PAPYR', {
          body: message,
          icon: '/assets/PAPYR.png',
          badge: '/assets/PAPYR.png',
          tag: 'papyr-scheduled',
          requireInteraction: false,
          vibrate: [200, 100, 200]
        });

        // Reschedule for next day
        scheduleNotification(hour, minute, message);
      }
    }, delay);

  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
}

// Setup all scheduled notifications
export async function setupScheduledNotifications(
  morning: boolean,
  afternoon: boolean,
  evening: boolean
): Promise<void> {
  const messages = [
    'Zeit für dein Bekenntnis! 📝',
    'Dein PAPYR wartet auf dich. ✨',
    'Was wird heute dein Ziel sein? 🎯',
  ];

  if (morning) {
    await scheduleNotification(9, 30, messages[0]);
  }
  if (afternoon) {
    await scheduleNotification(15, 0, messages[1]);
  }
  if (evening) {
    await scheduleNotification(19, 0, messages[2]);
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

// Initialize push notifications system
export async function initializePushNotifications(): Promise<boolean> {
  if (!isPushSupported()) {
    console.log('Push notifications not supported');
    return false;
  }

  try {
    // Register service worker
    const registration = await registerServiceWorker();
    if (!registration) {
      return false;
    }

    // Check current permission
    if (Notification.permission === 'granted') {
      // Check if subscribed
      const isSubscribed = await isPushSubscribed();
      if (!isSubscribed) {
        await subscribeToPush();
      }
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error initializing push notifications:', error);
    return false;
  }
}
