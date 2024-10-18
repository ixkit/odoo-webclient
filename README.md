

# Odoo-WebClient 📡
 
  Odoo-WebClient 📡 offers a simply but super effective solution that reuse the powerful capability of native Odoo WebClient from outside frontend applications, handly seamless interact with Odoo Services from customize SPA(Single-Page App) or PWA(Progressive Web App), Maximize the value of the services that implemeted by Python🐍 code.


## Install

```bash
npm install odoo-webclient
```

## Usage
- **Step 1**: Setup client manager, configure the odoo instance address 
```ts
import { getClientManager, DefaultClientManagerOption } from 'odoo-webclient';

async function setupOdooWebClient() {
  const option = new DefaultClientManagerOption()
  option.root = 'http://localhost:8069'; // odoo instance address, the instance should install Odoo-site module~
  getClientManager().setup(option);
  
}

setupOdooWebClient();

```
- **Step 2**:  Hook the webclient mounted event, while  the instance [ WebClient](https://www.odoo.com/documentation/17.0/developer/reference/frontend/javascript_reference.html) is ready then load data through orm service
```ts
getClientManager().mounted((event)=>{ 
    reloadData();
  });
 
function reloadData(){
  const webClient = getClientManager().getWebClient(); 
  
  if (!webClient){
    return;
  }
  fetchApps(webClient)

}
async function fetchApps(webClient) {
  console.debug('⚡️ getWebClient', webClient)

  const orm = webClient.orm
  // http://localhost:8069/web/dataset/call_kw/ir.module.module/web_search_read
  const specification = {
    icon: {},
    icon_flag: {},
    to_buy: {},
    name: {},
    state: {},
    summary: {},
    website: {},
    application: {},
    module_type: {},
    shortdesc: {},
  }
  const domain = ['application', '=', true]
  const result = await orm.call('ir.module.module', 'web_search_read', [[domain], specification])

  console.debug('📡 fetchApps', result)

  dataSet.value = result.records
}

```
- **Step 3**: Let 🚀, do login then enjoy the smoothly and seamless data access experience.     
```ts
const user = 'admin'; const password = 'admin'
const clientManager = getClientManager();
const request = await clientManager.login(user,password,true).subscribe(
  {
    next:x=>{
      console.log('login reponse, should includes data.scrpitTags:',x)
      
    }
  },
  error:(err)=>{
    throw err;
  });
 

```
## Example App
[Odoo Site App](https://github.com/icoco/odoo-site-app)

## APIs
- ### Core class: IClientMananger
```ts
export interface IClientMananger { 
  
  setup(val: IServerOption): IClientMananger; 

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

```
 
- ### IClientMananger.login
  ***login(login: string, password: string, autoLoadClient: boolean) Observable<  ApiResponse >***
- #### Parameters:
  ***autoLoadClient***: Type: `boolean`, identify whether auto load Odoo WebClicent instance
 
Login feature. the response contains field: data.scrpitTags, use the string value 'data.scrpitTags' build the HTMLScriptElement <Scripts></Scripts> then will instance the native [Odoo WebClient](https://www.odoo.com/documentation/17.0/developer/reference/frontend/javascript_reference.html),  in this scene, the WebClient was concised that can seamless use the capability of native Odoo WebClient from outside frontend applications.
The value of 'data.scrpitTags' could be play 'Accesss Token' role,  store in locale and use later like regular mobile frontend application.

```ts 
const user = 'admin'; const password = 'admin'
const clientManager = getClientManager();
const request = await clientManager.login(user,password).subscribe(
  {
    next:x=>{
      console.log('login reponse, should includes data.scrpitTags:',x) 
    }
  },
  error:(err)=>{
    throw err;
  }); 

```
- ### IClientMananger.mounted
  ***mounted(handler: MessageHandler): void***  
Listen the Odoo WebClient instance mounted event.
```ts
getClientManager().mounted((event)=>{ 
    reloadData();
  });
 
function reloadData(){
  const webClient = getClientManager().getWebClient(); 
  
  if (!webClient){
    return;
  }
  fetchApps(webClient)

}
```
- ### IClientMananger.logout
  ***logout() Observable<  ApiResponse >***  
Logout feature, quit session.
 

## Backend Services Required

  - [Odoo-Site](https://apps.odoo.com/apps/modules/17.0/site)  
    Odoo Site expose the Odoo WebClient to Frontend Apps smoothly,seamless reuse the powerful capability of Odoo framework from outside Client Apps .
  - [Odoo](https://github.com/odoo/odoo)  
    The Odoo framework To Grow Your Business.

## Tech Stacks & Dependencies

  - [RxJS](https://github.com/ReactiveX/rxjs)
  - [RxJS-Http-Client](https://github.com/Jack-Overflow/rxjs-http-client) 
  - [Odoo-Site](https://apps.odoo.com/apps/modules/17.0/site)
  - [Odoo](https://github.com/odoo/odoo)

## Mechanism Workflow

   Window fetch call RESTful api ----> API response includes script Tags of Odoo WebClient ----> render script Tags ```<Script>...</Script>``` on web page ----> load the odoo webclient success----> use js orm service call py🐍 code directly 🚀

## LICENSE

[MIT](https://en.wikipedia.org/wiki/MIT_License)


## Appendix

