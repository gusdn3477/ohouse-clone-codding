import type { ReactNode } from 'react';

export interface SearchState<T> {
  query: string;
  results: T[];
  isLoading: boolean;
  error: Error | null;
}

export interface SearchControllerProps<T> {
  onSearch: (query: string) => Promise<T[]>;
  children: (
    state: SearchState<T>,
    helpers: {
      setQuery: (query: string) => void;
      reset: () => void;
    }
  ) => ReactNode;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SearchResultListProps<T> {
  results: T[];
  renderResult: (item: T) => ReactNode;
  onSelectResult?: (item: T) => void;
  className?: string;
}
