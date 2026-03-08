import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';
import { publishAppEvent } from '@/microfrontends/shared/bus';
import type { RecentSearchesState } from '@/microfrontends/shared/contracts';
import { useObservableState } from '@/microfrontends/shared/react';

const STORAGE_KEY = 'todayshop_recent_searches';
const MAX_ITEMS = 10;

const initialState: RecentSearchesState = {
  items: [],
  hydrated: false,
};

export const recentSearches$ = new BehaviorSubject<RecentSearchesState>(initialState);

let hasInitialized = false;

function persist(items: string[]) {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function setRecentSearches(items: string[], hydrated = true) {
  const nextState = { items, hydrated };
  if (hydrated) {
    persist(items);
  }
  recentSearches$.next(nextState);
  publishAppEvent({ type: 'search/historyChanged', items });
}

export function ensureRecentSearchesReady() {
  if (hasInitialized || typeof window === 'undefined') {
    return;
  }

  hasInitialized = true;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      recentSearches$.next({ ...initialState, hydrated: true });
      return;
    }

    recentSearches$.next({
      items: JSON.parse(stored) as string[],
      hydrated: true,
    });
  } catch (error) {
    console.error('Failed to load recent searches:', error);
    recentSearches$.next({ ...initialState, hydrated: true });
  }
}

export function useRecentSearchesState() {
  const state = useObservableState(recentSearches$);

  useEffect(() => {
    ensureRecentSearchesReady();
  }, []);

  return state;
}

export function submitSearch(term: string) {
  ensureRecentSearchesReady();

  const normalized = term.trim();
  if (!normalized) {
    return;
  }

  const current = recentSearches$.getValue().items;
  const nextItems = [normalized, ...current.filter((item) => item !== normalized)].slice(0, MAX_ITEMS);

  setRecentSearches(nextItems);
  publishAppEvent({ type: 'search/submit', term: normalized });
}

export function removeRecentSearch(term: string) {
  ensureRecentSearchesReady();
  const nextItems = recentSearches$.getValue().items.filter((item) => item !== term);
  setRecentSearches(nextItems);
}

export function clearRecentSearches() {
  ensureRecentSearchesReady();

  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }

  recentSearches$.next({ items: [], hydrated: true });
  publishAppEvent({ type: 'search/historyChanged', items: [] });
}
