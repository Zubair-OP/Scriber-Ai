"use client";

import { useEffect, useMemo } from "react";

/**
 * Backfills a stable `_dndId` onto array entries that don't have one yet
 * (freshly added entries, entries just loaded from the server, or entries
 * replaced wholesale by an AI action) so drag-and-drop reordering has a
 * stable identity to track. Once an entry has `_dndId`, every existing
 * `{...entry, ...patch}` update already preserves it — no further syncing
 * is needed until the array is replaced wholesale again.
 */
export function useEntryIds<T extends { _dndId?: string }>(
  entries: T[],
  onBackfill: (next: (T & { _dndId: string })[]) => void
): (T & { _dndId: string })[] {
  const withIds = useMemo(
    () =>
      entries.map((entry) =>
        entry._dndId ? (entry as T & { _dndId: string }) : { ...entry, _dndId: crypto.randomUUID() }
      ),
    [entries]
  );

  useEffect(() => {
    if (entries.some((entry) => !entry._dndId)) {
      onBackfill(withIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entries]);

  return withIds;
}
