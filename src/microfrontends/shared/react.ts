import type { BehaviorSubject } from 'rxjs';
import { useSyncExternalStore } from 'react';

export function useObservableState<T>(subject: BehaviorSubject<T>) {
  return useSyncExternalStore(
    (onStoreChange) => {
      const subscription = subject.subscribe(() => onStoreChange());
      return () => subscription.unsubscribe();
    },
    () => subject.getValue(),
    () => subject.getValue()
  );
}
