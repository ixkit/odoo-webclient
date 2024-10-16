import {
  RxJSHttpClient,
  HttpRequestConfig,
  HttpResponse,
} from 'rxjs-http-client';
import { Observable, Subscriber } from 'rxjs';
import { of, mergeMap, interval, map } from 'rxjs';
import { Tracer } from '../../land/tracer';
import { ApiResponse } from '../model/response';

export { HttpRequestConfig, HttpResponse };

class HttpClient {
  private _http!: RxJSHttpClient;

  private static instance: HttpClient;

  private constructor() {
    this._http = new RxJSHttpClient();
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public get(
    url: string,
    config: Partial<HttpRequestConfig> = {}
  ): Observable<HttpResponse> {
    return this._http.get(url, config);
  }

  public post(
    url: string,
    config: Partial<HttpRequestConfig>
  ): Observable<HttpResponse> {
    return this._http.post(url, config);
  }
}

const theHttpClient = HttpClient.getInstance();

export { HttpClient, theHttpClient };

export const hookResponse = (
  subscriber: Subscriber<any>,
  hookNext?: ((value: any) => any) | null,
  error?: ((error: any) => void) | null,
  complete?: (() => void) | null
) => {
  const hook = {
    next: (response: any) => {
      Tracer.debug('http-client,hookResponse?', response);

      let result = ApiResponse.of(response);
      if (hookNext) {
        result = hookNext(result);
      }
      subscriber.next(result);
    },
    error: (e: any) => {
      subscriber.error(e);
    },
    complete: () => {
      subscriber.complete();
    },
  };
  return hook;
};
