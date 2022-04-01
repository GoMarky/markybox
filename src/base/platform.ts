import { IServicesAccessor } from '@/platform/instantiation/common/instantiation';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
    }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ICreateComponentFactory {
  createComponent<R, TS extends any[] = []>(
    fn: (accessor: IServicesAccessor, ...args: TS) => R,
    ...args: TS
  ): R;
}

declare global {
  interface Window {
    workbench: ICreateComponentFactory;
  }

}

export const API_VERSION = 'v1';

export const isDev: boolean = process.env.NODE_ENV === 'development';
export const isProd: boolean = process.env.NODE_ENV === 'production';
export const isTest: boolean = process.env.NODE_ENV === 'test';
// export const publicPath: string = (process.env.PUBLIC_PATH as unknown) as string;
// export const APP_VERSION: string = (process.env.APP_VERSION as unknown) as string;
// export const buildNumber: string = (process.env.BUILD_NUMBER as unknown) as string;
// export const buildDate: string = (process.env.BUILD_DATE as unknown) as string;
// export const ROUTER_MODE = isDev ? 'hash' : process.env.ROUTER_MODE;
export const isMobileDevice = /Mobi/i.test(navigator.userAgent);


