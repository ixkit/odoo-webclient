import { Observable, Subscriber, Subscription, mergeMap } from 'rxjs';

import { AuthService } from './service/auth.service';
import { ApiResponse } from './model/response';
import { Tracer } from '../land/tracer';
import { I_ORM } from './service/orm.service';
import { ClientDomBuilder } from './dom/builder';
import { toOuts } from '../rxbus';
import { BroadcastMessage, BroadcastService } from '../rxbus/index';

//odoo web client instance
export interface IWebClient {
  orm: I_ORM;
  //... more service here
}
export const ClientEvent = {
  mounted: 'mounted',
  unmounted: 'unmounted',
};

export type MessageHandler = (message: BroadcastMessage) => any;

export interface IServerOption {
  root: string;
  endPoint(path: string): string;
}

export interface IDomOption {
  templateElt?: HTMLDivElement | null;
  scriptElt?: HTMLDivElement | null;
  getTemplateElt(): HTMLDivElement;
  getScriptElt(): HTMLDivElement;
}

export interface IClientManagerOption extends IServerOption, IDomOption {}

class DefaultDomOption implements IDomOption {
  templateElt?: HTMLDivElement | null | undefined;
  scriptElt?: HTMLDivElement | null | undefined;
  getTemplateElt(): HTMLDivElement {
    if (this.templateElt) {
      return this.templateElt;
    }
    const div = document.createElement('div');
    div.setAttribute('id', 'odoo-webclient-scripts-template');
    document.body.append(div);
    this.templateElt = div;
    return this.templateElt;
  }
  getScriptElt(): HTMLDivElement {
    if (this.scriptElt) {
      return this.scriptElt;
    }
    const div = document.createElement('div');
    div.setAttribute('id', 'odoo-webclient-scripts');
    document.body.append(div);
    this.scriptElt = div;
    return this.scriptElt;
  }
}
export class DefaultClientManagerOption
  extends DefaultDomOption
  implements IClientManagerOption
{
  public root = 'http://localhost:8080';
  public endPoint(path: string): string {
    const root = this.root;

    return `${root}${path}`;
  }
}

//------------  ClientMananger feature
export interface IClientMananger {
  _client: IWebClient | undefined | null;

  setup(val: IServerOption): IClientMananger;
  free(): void;

  login(
    login: string,
    password: string,
    autoLoadClient: boolean
  ): Observable<ApiResponse>;

  logout(): Observable<boolean>;

  getWebClient(): IWebClient | null;

  loadClient(scriptTags: string): Observable<any>;

  mounted(handler: MessageHandler): void;
  unmounted(handler: MessageHandler): void;
}

export class OdooClientMananger implements IClientMananger {
  private static _instance: OdooClientMananger;

  private _bus: BroadcastService | null | undefined;
  private _listenerList: Subscription[] = [];

  private constructor(
    private _option: DefaultClientManagerOption = new DefaultClientManagerOption()
  ) {}

  //---------- client feature
  _client: IWebClient | undefined | null;

  private _authService?: AuthService | undefined | null;
  public getAuthService(): AuthService {
    if (!this._authService) {
      this._authService = new AuthService(this._option);
    }
    return this._authService;
  }

  public static getInstance(): OdooClientMananger {
    if (!OdooClientMananger._instance) {
      OdooClientMananger._instance = new OdooClientMananger();
    }
    return OdooClientMananger._instance;
  }

  public setup(val: IClientManagerOption): IClientMananger {
    this._option = val;
    this._authService = null;

    Tracer.debug('setup, this?, _option?', this, this._option);
    return this;
  }

  public free() {
    this._authService = null;
    this._freeListeners();
    this._bus = null;
    this._unloadClient();
  }

  public login(
    login: string,
    password: string,
    autoLoadClient = true
  ): Observable<ApiResponse> {
    return this._login(login, password, autoLoadClient);
  }
  private _login(
    login: string,
    password: string,
    autoLoadClient = true
  ): Observable<ApiResponse> {
    const outs = toOuts(subscriber => {
      const service = this.getAuthService();
      service.login(login, password).subscribe({
        next: r => {
          if (!r.isSuccess()) {
            subscriber.next(r);
            return;
          }
          Tracer.debug(
            'after login,response? autoLoadClient?',
            r,
            autoLoadClient
          );
          if (autoLoadClient) {
            const scrpitTags: string = r.data.scrpitTags;
            if (scrpitTags) {
              const outsDom = this._loadClient(scrpitTags);
              outsDom.subscribe({
                next: r => {
                  Tracer.debug('Success autoLoadClient, r?', r);
                },
                error: e => {
                  Tracer.debug('Failed autoLoadClient, e?', e);
                },
              });
            }
          }
          subscriber.next(r);
        },
        error: e => {
          subscriber.error(e);
        },
        complete: () => {
          subscriber.complete();
        },
      });
    });

    return outs;
  }

  private _loadClient(scriptTags: string): Observable<any> {
    if (!scriptTags) {
      return toOuts(s => {
        s.error(new Error('Empty scriptTags!'));
      });
    }
    Tracer.debug('try _loadClient, scriptTags?', scriptTags);
    const outs = new Observable<any>(subscriber => {
      const builder: ClientDomBuilder = new ClientDomBuilder(this._option);
      builder.build(scriptTags);
      subscriber.next(builder);
    });
    return outs;
  }
  private _unloadClient() {
    Tracer.debug('should _unloadClient!');
    this._setWebClient(null);
  }

  public logout(): Observable<boolean> {
    this._unloadClient();
    return toOuts(s => {
      s.next(true);
    });
  }

  public getWebClient(): IWebClient | null {
    if (this._client) {
      return this._client;
    }

    Tracer.debug('warning, getWebClient is null ');
    return null;
  }

  public _setWebClient(client: IWebClient | null) {
    this._client = client;
    if (this._client) {
      this._getBus().broadcast(ClientEvent.mounted, this._client);
      return;
    }
    this._getBus().broadcast(ClientEvent.unmounted);
  }

  public loadClient(scriptTags: string): Observable<any> {
    return this._loadClient(scriptTags);
  }

  //---------- message bus
  public mounted(handler: MessageHandler): void {
    this._wrapListener(ClientEvent.mounted, handler);
  }
  public unmounted(handler: MessageHandler): void {
    this._wrapListener(ClientEvent.unmounted, handler);
  }
  private _wrapListener(eventName: string, handler: MessageHandler) {
    const hooker: Subscription = this._getBus().on(eventName, (e, ...args) => {
      const message = {
        eventName,
        args,
      } as unknown as BroadcastMessage;
      handler(message);
    });
    this._listenerList.push(hooker);
  }
  private _getBus(): BroadcastService {
    if (this._bus) {
      return this._bus;
    }
    this._bus = new BroadcastService();
    return this._bus;
  }
  private _freeListeners() {
    const list = this._listenerList;
    if (!list) return;
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      element.unsubscribe();
    }
    this._listenerList = [];
  }
}

/*

  {name:'webClientReady',message:{webClient: IWebClient? }}

*/

const listenWebSdkFeeds = function () {
  //Tracer.debug('listenWebSdkFeeds, globalThis?', globalThis)

  const bus = globalThis.__rxbus__;
  if (!bus) {
    return;
  }
  const baseTopic = 'webClientReady';
  bus.addListener(baseTopic, (fireTopic: string, args: any) => {
    Tracer.debug(`🪝 on:[${baseTopic}], fireTopic?, args?`, fireTopic, args);
    const data = args[0];
    if (data.name === baseTopic) {
      const webClient: IWebClient = data.message.webClient;
      OdooClientMananger.getInstance()._setWebClient(webClient);
    }
  });
};
//@step
listenWebSdkFeeds();

const registerClientManager = (val: OdooClientMananger) => {
  //--- @ts-ignore
  if (globalThis.__webClientMananger__) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    globalThis.__webClientMananger__.free();
  }
  //----  @ts-ignore
  globalThis.__webClientMananger__ = val;
};
//@step auto register default webclient
registerClientManager(OdooClientMananger.getInstance());

export const getClientManager = (): OdooClientMananger => {
  if (!globalThis.__webClientMananger__) {
    registerClientManager(OdooClientMananger.getInstance());
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return globalThis.__webClientMananger__;
};
