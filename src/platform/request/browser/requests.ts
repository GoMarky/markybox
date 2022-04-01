import { API_VERSION } from '@/base/platform';

const BASE_ENDPOINTS = {
  GET_ALL_USERS: 'users/',
  SESSION_LOGIN: 'session/login/',
  SESSION_INFO: 'session/info/',
  SESSION_LOGOUT: 'session/logout/'
};

function addVersion(endpoints: Record<string, string>): Record<string, string> {
  const dict: Record<string, string> = {};

  for (const key in endpoints) {
    dict[key] = `${API_VERSION}/${endpoints[key]}`;
  }

  return dict;
}

export const ENDPOINTS = addVersion(BASE_ENDPOINTS) as typeof BASE_ENDPOINTS;
