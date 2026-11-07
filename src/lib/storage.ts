import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

function readJson<T>(raw: string | null, parse: (value: unknown) => T, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return parse(JSON.parse(raw));
  } catch {
    return fallback; // corrupted or hand-edited data: start clean rather than crash
  }
}

function readKey(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null; // storage disabled (privacy settings, sandboxed frames)
  }
}

/**
 * useState backed by localStorage.
 *
 * - `parse` validates whatever is stored (it may be old, partial or edited by
 *   hand) and must return a safe value.
 * - Changes made in another tab are picked up through the `storage` event.
 * - The third value is true when the browser refused to save (storage full or
 *   blocked), so the UI can tell the user instead of silently losing data.
 *
 * Client-only: call it from components rendered inside <ClientOnly>.
 */
export function usePersistentState<T>(
  key: string,
  parse: (value: unknown) => T,
  fallback: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const initialRaw = useRef<string | null>(null);
  const [value, setValue] = useState<T>(() => {
    initialRaw.current = readKey(key);
    return readJson(initialRaw.current, parse, fallback);
  });
  // What storage already holds, so unchanged values are never written back.
  const stored = useRef<string>(initialRaw.current ?? JSON.stringify(fallback));
  const [saveFailed, setSaveFailed] = useState(false);

  useEffect(() => {
    const json = JSON.stringify(value);
    if (json === stored.current) return;
    try {
      window.localStorage.setItem(key, json);
      stored.current = json;
      setSaveFailed(false);
    } catch {
      setSaveFailed(true);
    }
  }, [key, value]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      stored.current = event.newValue ?? JSON.stringify(fallback);
      setValue(readJson(event.newValue, parse, fallback));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // parse/fallback are module-level constants in every caller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return [value, setValue, saveFailed];
}

/** Unique id for stored records; falls back where crypto.randomUUID is unavailable (non-HTTPS origins). */
export function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
