import { Tracer } from '../../land/tracer';
import { IDomOption } from '../client';

export class ClientDomBuilder {
  constructor(private _option: IDomOption) {}

  public getTemplateElt(): HTMLDivElement {
    return this._option.getTemplateElt();
  }
  public getScriptsElt(): HTMLDivElement {
    return this._option.getScriptElt();
  }

  public build(scriptTags: string) {
    Tracer.debug('try build with scriptTags ');
    this.renderTemplate(scriptTags);

    const elt = this.getTemplateElt();
    const list: HTMLCollection = elt.children;

    this.startClient(list);
    Tracer.debug('end build with scriptTags ');
  }
  private renderTemplate(scriptTags: string) {
    const elt = this.getTemplateElt();
    elt.innerHTML = '';
    elt.insertAdjacentHTML('afterbegin', scriptTags);
  }
  private startClient(list: HTMLCollection): boolean {
    const container = this.getScriptsElt();
    let result = false;
    for (let index = 0; index < list.length; index++) {
      const element: Element = list[index];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // @ts-ignore
      if (element.innerText) {
        // @ts-ignore
        script.text = element.innerText;
      }
      // @ts-ignore
      if (element.src) {
        // @ts-ignore
        script.src = element.src;
      }
      container.appendChild(script);
      result = true;
    }
    return result;
  }
}
