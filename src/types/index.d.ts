/* eslint-disable no-var */

declare global {
  namespace globalThis {
    var __rxbus__: any; //accross use by sdk feeds
    var __webClientMananger__: any;
    var getWebClientMananger: { (): any };

    // extends console or more
    interface Console {
      insight(msg: string, ...args): void;
    }
  }
}

globalThis.getWebClientMananger = (): any => {
  return globalThis.__webClientMananger__;
};

export {};
