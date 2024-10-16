import { Observable, Subscriber } from 'rxjs';

import { BroadcastMessage, BroadcastService } from './service';

export { BroadcastMessage, BroadcastService };

export type subs<T> = (subscriber: Subscriber<T>) => any;

export function toOuts(s: subs<any>): Observable<any> {
  const outs = new Observable<any>(subscriber => {
    s(subscriber);
  });
  return outs;
}

export * from './bus';
