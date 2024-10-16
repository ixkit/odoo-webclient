import { ApiResponse } from './core/model/response';

import { rxbus } from './rxbus/bus';

import { HttpClient, theHttpClient } from './core';

import {
  getClientManager,
  OdooClientMananger,
  DefaultClientManagerOption,
} from './core';

export const profile = (seed?: string): string => {
  const name = 'Odoo-WebClient📡';
  const version = '1.0.0';
  const by = seed ? `by ${seed}` : '';
  const info = `${name} ${version} ${by}`;
  console.info(info);
  return info;
};
export { rxbus };
export { HttpClient, theHttpClient, ApiResponse };

export { getClientManager, OdooClientMananger, DefaultClientManagerOption };
