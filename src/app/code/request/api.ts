import { isDev } from '@/base/platform';

export const BASE_URL = isDev ? '//localhost:3021' : '//s1.gomarky.tech';

const WS_PROTOCOL = isDev ? 'ws' : 'wss';
export const BASE_WEBSOCKET_URL = `${WS_PROTOCOL}://${BASE_URL}`;