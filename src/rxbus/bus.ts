/*
  base on Thingsboard broadcast 
  do not Reinventing the wheel

  The Bus purpose boardcast message with listener topic
  
*/
import {
  BroadcastService,
  BroadcastListener,
  BroadcastMessage,
} from './service/index';
import { Tracer } from '../land/tracer';

export const BusTopics = {
  all: '*',
  dataStream: 'dataStream',
  client: 'client/*',
};
const option = {
  strict: !true,
};

const theBus = {
  _broadcastService: BroadcastService,

  option: option,

  setup() {
    Tracer.debug('🚌🚌🚌 setup');
    // @ts-ignore
    this._broadcastService = new BroadcastService();
  },
  //const event = {name:'dblclick', message:n}
  notify(event: BroadcastMessage) {
    Tracer.debug('🚰 notify', event);
    this.dispatchEvent(event);
  },
  /*
     const event = {name:'dblclick', message:n}
    */
  async dispatchEvent(event: BroadcastMessage) {
    const topic = event.name;
    // @ts-ignore
    const result = this._emit(topic, event);
    if (this.option.strict) {
      return result;
    }
    this._bordcastPaths(topic, event);
    //@step
    this._emit(BusTopics.all, event);
  },
  // client/init ==> client/*, client/init/*
  async _bordcastPaths(topic: string, data: BroadcastMessage) {
    Tracer.debug(`try bordcastPaths: ${topic}`);

    const paths = topic.split('/');

    let path = '';
    let firePath = '';
    for (let index = 0; index < paths.length; index++) {
      let item = paths[index];
      if (!item) {
        item = '';
      }

      if ('*' === item && index + 1 === paths.length) {
        return;
      }
      path = path + item + '/';
      firePath = `${path}*`;
      if (path === topic) {
        this._emit(firePath, data);
        return;
      }
      if (firePath === topic) {
        //avoid repeat fire
        continue;
      }
      this._emit(firePath, data);
    }
  },
  _emit(topic: string, ...args: Array<any>) {
    Tracer.debug(`_emit: ${topic}`);
    // @ts-ignore
    this._broadcastService.broadcast(topic, ...args);
  },
  //export type BroadcastListener = (event: BroadcastEvent, ...args: Array<any>) => void;

  addListener(topic: string, item: BroadcastListener): any {
    // @ts-ignore
    const sub = this._broadcastService.on(topic, item);
    const result = {
      id: new Date().getTime(),
      subscription: sub,
    };
    return result;
  },
  // {id, subscription}
  removeListener(handler: any) {
    if (handler && handler.subscription) {
      handler.subscription.unsubscribe();
    }
  },
};

//--- @ts-ignore
if (!globalThis.__rxbus__) {
  theBus.setup();
  //----  @ts-ignore
  globalThis.__rxbus__ = theBus;
}

export const rxbus = theBus;
