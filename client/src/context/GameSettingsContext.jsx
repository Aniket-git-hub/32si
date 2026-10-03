import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Per-device preferences (not tied to an account), so they also work before signing in.
const STORAGE_KEY = "32beads.settings";

export const DEFAULT_GAME_SETTINGS = {
  soundEffects: true,
  musicVolume: 0.05,
  moveHints: true, // ring the beads that can move and show where the selected bead can go
  captureHints: true, // highlight beads that can capture
  confirmMoves: false, // tap a destination twice to move (avoids mis-taps on small screens)
};

const load = () => {
  try {
    return { ...DEFAULT_GAME_SETTINGS, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return DEFAULT_GAME_SETTINGS;
  }
};

const GameSettingsContext = createContext({ settings: DEFAULT_GAME_SETTINGS, updateSettings: () => {} });

export const GameSettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(load);

  const updateSettings = useCallback((changes) => {
    setSettings((prev) => {
      const next = { ...prev, ...changes };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable: settings last for this visit only.
      }
      return next;
    });
  }, []);

  const value = useMemo(() => ({ settings, updateSettings }), [settings, updateSettings]);
  return <GameSettingsContext.Provider value={value}>{children}</GameSettingsContext.Provider>;
};

export const useGameSettings = () => useContext(GameSettingsContext);
