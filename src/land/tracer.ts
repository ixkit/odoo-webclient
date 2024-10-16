export const Tracer = {
  tag: '🤸🏻:',
  _tag(msg: string): string {
    return this.tag + msg;
  },
  _use: false,

  log(msg: string, ...args: any[]) {
    if (!this._use) {
      return;
    }
    if (args) {
      console.log(this._tag(msg), args);
      return;
    }
    console.log(this._tag(msg));
  },
  debug(msg: string, ...args: any[]) {
    if (!this._use) {
      return;
    }
    if (args) {
      console.debug(this._tag(msg), args);
      return;
    }
    console.debug(this._tag(msg));
  },
};
