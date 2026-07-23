"use client";

import * as React from "react";
import { DEFAULT_WIDGET_ORDER } from "@/lib/constants";

export type WidgetId = (typeof DEFAULT_WIDGET_ORDER)[number];

interface WidgetsState {
  order: WidgetId[];
  hidden: WidgetId[];
}

const STORAGE_KEY = "campustracker-dashboard-widgets";

/**
 * Manages dashboard widget order + visibility. Persists to localStorage for
 * now; swap the load/save calls for a `user_preferences.dashboard_layout`
 * read/write once attendance/assignment data is wired up.
 */
export function useWidgets() {
  const [state, setState] = React.useState<WidgetsState>({ order: [...DEFAULT_WIDGET_ORDER], hidden: [] });
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as WidgetsState;
        // Drop ids that no longer exist (renamed/removed widgets) and append
        // any new default ids the stored layout predates.
        const known = new Set<string>(DEFAULT_WIDGET_ORDER);
        const order = stored.order.filter((id) => known.has(id));
        DEFAULT_WIDGET_ORDER.forEach((id) => {
          if (!order.includes(id)) order.push(id);
        });
        setState({ order, hidden: stored.hidden.filter((id) => known.has(id)) });
      }
    } finally {
      setIsReady(true);
    }
  }, []);

  const persist = React.useCallback((next: WidgetsState) => {
    setState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const moveWidget = React.useCallback(
    (from: number, to: number) => {
      const next = [...state.order];
      const [removed] = next.splice(from, 1);
      if (!removed) return;
      next.splice(to, 0, removed);
      persist({ ...state, order: next });
    },
    [state, persist]
  );

  const toggleHidden = React.useCallback(
    (id: WidgetId) => {
      const hidden = state.hidden.includes(id) ? state.hidden.filter((h) => h !== id) : [...state.hidden, id];
      persist({ ...state, hidden });
    },
    [state, persist]
  );

  const resetLayout = React.useCallback(() => persist({ order: [...DEFAULT_WIDGET_ORDER], hidden: [] }), [persist]);

  return { ...state, isReady, moveWidget, toggleHidden, resetLayout };
}
