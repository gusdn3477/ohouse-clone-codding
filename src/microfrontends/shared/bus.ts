import { Subject } from 'rxjs';
import type { AppEvent } from './contracts';

const appEventBus = new Subject<AppEvent>();

export const appEvents$ = appEventBus.asObservable();

export function publishAppEvent(event: AppEvent) {
  appEventBus.next(event);
}
