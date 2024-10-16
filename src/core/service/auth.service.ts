import { Observable, Subscription, mergeMap, lastValueFrom } from 'rxjs';
import {
  HttpClient,
  theHttpClient,
  hookResponse,
  HttpRequestConfig,
} from './http-client';

import { ApiResponse, toSuccess, toError } from '../model/response';

import { IServerOption } from '../client';

import { Tracer } from '../../land/tracer';

function toFormBody(data: any): any {
  return new URLSearchParams(data);
}

export class AuthService {
  constructor(
    private _serverOption: IServerOption,
    private _http: HttpClient = theHttpClient
  ) {}

  private _yield(): Observable<ApiResponse> {
    const outs = new Observable<ApiResponse>(subscriber => {
      Tracer.log('_yield success');
      subscriber.next(toSuccess());
    });
    return outs;
  }

  private wrapApi(path: string) {
    const url = this._serverOption.endPoint(path);
    return url;
  }

  public csrf(): Observable<ApiResponse> {
    const that = this;
    const url: string = this.wrapApi('/api/v1/csrf');
    const outs = new Observable<ApiResponse>(subscriber => {
      that._http
        .get(url)
        .pipe(
          mergeMap(response => {
            return response.json();
          })
        )
        .subscribe({
          next: response => {
            const result = ApiResponse.of(response);
            subscriber.next(result);
            subscriber.complete();
          },
          error: e => {
            Tracer.debug('error ?', e);
            subscriber.error(e);
          },
          complete: () => {
            subscriber.complete();
          },
        });
    });
    return outs;
  }

  public login(
    login: string,
    password: string,
    args?: {} | null
  ): Observable<ApiResponse> {
    const that = this;
    const outs = new Observable<ApiResponse>(subscriber => {
      //@step fetch csrf
      const csrfOuts = this.csrf();
      csrfOuts.subscribe({
        next: (r: ApiResponse) => {
          Tracer.debug('next-> ', r);
          if (!r.isSuccess()) {
            const msg = r.message;
            subscriber.error(new Error(msg));
          }
          const csrf_token = r.data.csrf;
          //@step do login with csrf
          that._login(login, password, { csrf_token: csrf_token }).subscribe({
            next: r => {
              subscriber.next(r);
            },
            error: ex => {
              subscriber.error(ex);
            },
          });
        },
        error: e => {
          subscriber.error(e);
        },
      });
    });
    return outs;
  }

  public _login(
    login: string,
    password: string,
    args: any
  ): Observable<ApiResponse> {
    const that = this;
    const url = this.wrapApi('/api/v1/login');
    const data = {
      login: login,
      password: password,
    };
    Object.assign(data, args);
    const body = toFormBody(data);

    const request: Partial<HttpRequestConfig> = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: body,
    };

    Tracer.debug('_login, post api url? request?', url, request);
    const outs = new Observable<ApiResponse>(subscriber => {
      that._http
        .post(url, request)
        .pipe(mergeMap(response => response.json()))
        .subscribe(
          hookResponse(subscriber, r => {
            return r;
          })
        );
    });
    return outs;
  }

  public logout(): Observable<ApiResponse> {
    const that = this;
    const url = this.wrapApi('/api/v1/logout');
    const request: Partial<HttpRequestConfig> = {};
    const outs = new Observable<ApiResponse>(subscriber => {
      that._http
        .get(url, request)
        .pipe(mergeMap(response => response.json()))
        .subscribe(hookResponse(subscriber));
    });
    return outs;
  }
}
