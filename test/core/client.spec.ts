 
import { describe, expect, it, test,beforeEach,afterEach } from '@jest/globals';

import { getClientManager, DefaultClientManagerOption } from '../../src/index';

import {Tracer} from '../../src/land/tracer';

 
const serverOption =  new DefaultClientManagerOption(); 

beforeEach(() => {
  serverOption.root = 'http://localhost:8120'
  const clientManager = getClientManager();
  clientManager.setup(serverOption);
});

afterEach(() => {
   
});

const clientCsrf = async (done)=>{
 
  Tracer.log('try csrf:', this);
   
  const clientManager = getClientManager();
  const authService = clientManager.getAuthService();
  const request = await authService.csrf().subscribe({next:x=>{
    Tracer.log('next result?', x)
   // expect(x.status).toEqual(200);  
    done();
    return x;
  },
  error:(err)=>{
    Tracer.log('err:',err);
  }
})

  Tracer.log('request result?', request)
  return request;
}

const clientLogin = async (done)=>{
 
  Tracer.log('try webclientLogin:', this);
  const user = 'admin'; const password = 'admin'
  const clientManager = getClientManager();
  const request = await clientManager.login(user,password,false).subscribe({next:x=>{
    Tracer.log('after login, result?', x)
    expect(x.isSuccess()).toBeTruthy();
    done();
    return x;
  },
  error:(err)=>{
    Tracer.log('err:',err);
    
    done();
  }
})

  Tracer.log('request result?', request)
  return request;
}

//---------------- test csrf -------------
//define the unit test name 
//cli: npm run test client
describe('client.csrf', () => {
  describe('theClient await', () => {
    it('test csrf',  (done) => {
       
     // clientCsrf(done)
       
      done();
     Tracer.log('----> end')
    });
  });
});

//---------------- test login -------------
//define the unit test name 
//cli: npm run test client
describe('client.login', () => {
  describe('theClient await', () => {
    it('test login',  (done) => {
       
      clientLogin(done)
       
      
     Tracer.log('----> end')
    });
  });
});