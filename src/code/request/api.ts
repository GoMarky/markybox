import { isProd } from '@/base/platform';

export const BASE_URL = isProd ? '//s1.swen.tech' : '//localhost:3021';
