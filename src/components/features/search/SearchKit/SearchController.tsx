import { useState, useCallback, useEffect } from 'react';
import { SearchControllerProps, SearchState } from '@/types/search';

export function SearchController<T>({
  onSearch,
  children,
}: SearchControllerProps<T>) {
  const [state, setState] = useState<SearchState<T>>({
    query: '',
    results: [],
    isLoading: false,
    error: null,
  });

  const setQuery = (query: string) => {
    setState((prevState) => ({ ...prevState, query }));
  };

  const reset = () => {
    setState({
      query: '',
      results: [],
      isLoading: false,
      error: null,
    });
  };

  const executeSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim() === '') {
      setState((prev) => ({ ...prev, results: [], isLoading: false }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const results = await onSearch(searchQuery);
      setState((prev) => ({ ...prev, results, isLoading: false }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err : new Error('An unknown error occurred'),
        results: [],
      }));
    }
  }, [onSearch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      executeSearch(state.query);
    }, 300); // Debounce search requests

    return () => {
      clearTimeout(handler);
    };
  }, [state.query, executeSearch]);

  return children(state, { setQuery, reset });
}
