export type NotificationKind = 'contact' | 'consultation' | 'generic'

const STORAGE_KEY = 'eh_last_notification'
const CHANNEL_NAME = 'eh_notifications'

export interface NotificationEvent {
  kind: NotificationKind
  at: number
}

// Publish a notification event (cross-tab via BroadcastChannel + storage)
export function publishNewNotification(kind: NotificationKind = 'generic') {
  const evt: NotificationEvent = { kind, at: Date.now() }
  try {
    // BroadcastChannel if supported
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const ch = new BroadcastChannel(CHANNEL_NAME)
      ch.postMessage(evt)
      ch.close()
    }
  } catch {
    // ignore
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(evt))
  } catch {
    // ignore
  }
}

// Subscribe to notification events. Returns an unsubscribe function.
export function subscribeToNotifications(onEvent: (e: NotificationEvent) => void) {
  let ch: BroadcastChannel | null = null
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    ch = new BroadcastChannel(CHANNEL_NAME)
    ch.onmessage = (msg) => {
      const data = msg.data as NotificationEvent
      if (data && data.at) onEvent(data)
    }
  }
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue) as NotificationEvent
        if (data && data.at) onEvent(data)
      } catch {
        // ignore
      }
    }
  }
  window.addEventListener('storage', onStorage)

  return () => {
    window.removeEventListener('storage', onStorage)
    if (ch) ch.close()
  }
}

// Simple beep using WebAudio API
export async function playBeep(durationMs = 220) {
  const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'sine'
  o.frequency.value = 880 // A5
  o.connect(g)
  g.connect(ctx.destination)
  g.gain.setValueAtTime(0.0001, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000)
  o.start()
  o.stop(ctx.currentTime + durationMs / 1000)
  // close context after sound
  setTimeout(() => ctx.close(), durationMs + 50)
}
