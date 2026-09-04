import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

export type ActivityItem = {
  id: string;
  tool: string;
  detail: string;
  at: Date;
};

export type Settings = {
  defaultTone: "Formal" | "Friendly" | "Persuasive";
  responseLength: "short" | "medium" | "long";
  writingStyle: string;
};

type AppState = {
  activity: ActivityItem[];
  logActivity: (tool: string, detail: string) => void;
  clearActivity: () => void;
  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;
};

const defaultSettings: Settings = {
  defaultTone: "Formal",
  responseLength: "medium",
  writingStyle: "Clear, concise and professional",
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  const logActivity = useCallback((tool: string, detail: string) => {
    setActivity((prev) =>
      [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          tool,
          detail,
          at: new Date(),
        },
        ...prev,
      ].slice(0, 40),
    );
  }, []);

  const value = useMemo<AppState>(
    () => ({
      activity,
      logActivity,
      clearActivity: () => setActivity([]),
      settings,
      updateSettings: (patch) => setSettings((prev) => ({ ...prev, ...patch })),
    }),
    [activity, logActivity, settings],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState(): AppState {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
