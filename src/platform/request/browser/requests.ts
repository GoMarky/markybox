import { API_VERSION } from '@/base/platform';

const BASE_ENDPOINTS = {
  SESSION_LOGIN: 'session/login/',
  SESSION_INFO: 'session/info/',
  SESSION_LOGOUT: 'session/logout/',
  SESSION_REGISTER_USER: 'session/register/',
  NOTE_CREATE: 'note/create/',
  NOTE_UPDATE: 'note/update/',
  NOTE_DELETE: 'note/delete/',
  NOTE_GET_ALL: 'note/get-all/',
  NOTE_GET_BY_ID: 'note/getById/',
};

function addVersion(endpoints: Record<string, string>): Record<string, string> {
  const dict: Record<string, string> = {};

  for (const key in endpoints) {
    dict[key] = `${API_VERSION}/${endpoints[key]}`;
  }

  return dict;
}

export const ENDPOINTS = addVersion(BASE_ENDPOINTS) as typeof BASE_ENDPOINTS;
