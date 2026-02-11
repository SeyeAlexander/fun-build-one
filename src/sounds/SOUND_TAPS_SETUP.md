# Sound Taps System — Setup Instructions

## 1. Install Dependencies

```bash
pnpm add howler
pnpm add -D @types/howler
```

## 2. Add Sound Files

Create a `src/sounds/` directory and place these 3 files in it:

| File          | Format | Used For                         |
| ------------- | ------ | -------------------------------- |
| `tap.wav`     | WAV    | General button/link clicks       |
| `switch.wav`  | WAV    | Sound toggle on/off              |
| `handgun.mp3` | MP3    | Special CTA / accent interaction |

I will provide these files manually.

## 3. Add TypeScript Declarations for Audio Imports

Create `src/types/audio.d.ts`:

```typescript
declare module '*.mp3' {
  const src: string
  export default src
}
declare module '*.wav' {
  const src: string
  export default src
}
```

## 4. Create the `useSounds` Hook

Create `src/hooks/useSounds.ts`:

```typescript
import { Howl } from 'howler'
import { useCallback, useEffect, useState } from 'react'

// Import sound files
import handgunSound from '../sounds/handgun.mp3'
import switchSound from '../sounds/switch.wav'
import tapSound from '../sounds/tap.wav'

type SoundType = 'handgun' | 'switch' | 'tap'

const VOLUME_MAP: Record<SoundType, number> = {
  handgun: 0.12,
  switch: 0.15,
  tap: 0.18,
}

const STORAGE_KEY = 'portfolio-sound-enabled'

// Global state to share across all hook instances
let globalEnabled = true
let globalInitialized = false
let audioUnlocked = false
const listeners = new Set<(enabled: boolean) => void>()

// Howl instances for each sound
const sounds: Record<SoundType, Howl> = {
  handgun: new Howl({
    src: [handgunSound],
    volume: VOLUME_MAP.handgun,
    preload: true,
  }),
  switch: new Howl({
    src: [switchSound],
    volume: VOLUME_MAP.switch,
    preload: true,
  }),
  tap: new Howl({
    src: [tapSound],
    volume: VOLUME_MAP.tap,
    preload: true,
  }),
}

// Unlock audio on first user interaction for instant playback
function unlockAudio() {
  if (audioUnlocked) return
  audioUnlocked = true

  // Play each sound at 0 volume to unlock audio context
  Object.entries(sounds).forEach(([key, sound]) => {
    const originalVolume = VOLUME_MAP[key as SoundType]
    sound.volume(0)
    sound.play()
    sound.stop()
    sound.volume(originalVolume)
  })
}

function initializeFromStorage() {
  if (globalInitialized) return
  globalInitialized = true

  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      globalEnabled = stored === 'true'
    }
  }
}

function setGlobalEnabled(enabled: boolean) {
  globalEnabled = enabled
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, String(enabled))
  }
  listeners.forEach((listener) => listener(enabled))
}

export function useSounds() {
  const [enabled, setEnabled] = useState(globalEnabled)

  // Initialize from storage on mount
  useEffect(() => {
    initializeFromStorage()
    setEnabled(globalEnabled)
  }, [])

  // Subscribe to global state changes
  useEffect(() => {
    const listener = (newEnabled: boolean) => {
      setEnabled(newEnabled)
    }
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  }, [])

  const playSound = useCallback((type: SoundType) => {
    // Unlock audio on first interaction
    unlockAudio()

    // Don't play if disabled
    if (!globalEnabled) return

    try {
      const sound = sounds[type]
      // Stop any current playback to prevent overlap
      sound.stop()
      // Play immediately
      sound.play()
    } catch {
      // Silently fail - never block interaction
    }
  }, [])

  const toggleSound = useCallback(() => {
    setGlobalEnabled(!globalEnabled)
  }, [])

  return {
    enabled,
    playSound,
    toggleSound,
  }
}
```

## 5. Usage in Components

### Playing a tap on any clickable element

```tsx
import { useSounds } from '../hooks/useSounds'

function MyComponent() {
  const { playSound } = useSounds()

  return <button onClick={() => playSound('tap')}>Click me</button>
}
```

### Sound mapping convention

- **`'tap'`** — all regular buttons, nav links, social links, section navigation
- **`'switch'`** — the sound toggle button itself (mute/unmute)
- **`'handgun'`** — one special CTA button (accent action)

### Sound toggle button pattern

```tsx
const { enabled, toggleSound, playSound } = useSounds()

const handleClick = () => {
  playSound('switch')
  toggleSound()
}
```

## Key Design Details

- **Global singleton** — Howl instances and enabled state live outside the hook at module level. A `listeners` Set syncs all mounted instances, so toggling in one component updates all others.
- **Audio unlock** — Mobile browsers block audio until user interaction. `unlockAudio()` plays every sound at volume 0 then stops on first `playSound()` call to prime the audio context.
- **localStorage persistence** — Preference stored under `'portfolio-sound-enabled'`. Change this key per project.
- **Volumes are intentionally low** — tap: 0.18, switch: 0.15, handgun: 0.12. Subtle tactile feedback, not music.
- **Vite handles `.mp3`/`.wav` imports natively** — no extra loader config needed if using Vite.
