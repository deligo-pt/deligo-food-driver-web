
import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";


export async function getFcmToken(): Promise<string | null> {
  if (!messaging) return null;
  if (!("serviceWorker" in navigator)) return null;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  return await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!,
  });
}

