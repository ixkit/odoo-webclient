import { describe, expect, it, test } from '@jest/globals';

import { theHttpClient } from '../../src/index';

import {Tracer} from '../../src/land/tracer';

test('use jsdom in this test file', () => {
  const element = document.createElement('div');
  expect(element).not.toBeNull();
  Tracer.log('🧐 use jsdom in this test file');
});

const demoSdk = async (done)=>{
  const url = 'http://localhost:8120/site/sdk/demo'
  Tracer.log('try demo sdk:', this);
  const request = await theHttpClient.get(url).subscribe({next:x=>{
    Tracer.log('next result?', x)
    expect(x.status).toEqual(200);
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

describe('web.demo', () => {
  describe('sdk demo', () => {
    it('test demosdk',  (done) => {
       
      demoSdk(done) 
      Tracer.log('----> end')
    });
  });
});
