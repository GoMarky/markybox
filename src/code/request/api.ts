import { isDev } from '@/base/platform';

export const BASE_URL = !isDev ? '//localhost:3021' : '//s1.swen.tech';
