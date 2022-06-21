import { IServiceIdentifier, IServicesAccessor } from '@/platform/instantiation/common/instantiation';

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
  getService<T>(id: IServiceIdentifier<T>): T;
}

declare global {
  interface Window {
    workbench: ICreateComponentFactory;
  }
}

export const API_VERSION = process.env.API_VERSION as string;

export const isDev: boolean = process.env.NODE_ENV === 'development';
export const isProd: boolean = process.env.NODE_ENV === 'production';
export const isTest: boolean = process.env.NODE_ENV === 'test';
export const APP_VERSION: string = (process.env.APP_VERSION as unknown) as string;
export const buildNumber: string = (process.env.BUILD_NUMBER as unknown) as string;
export const buildDate: string = (process.env.BUILD_DATE as unknown) as string;
export const isMobileDevice = /Mobi/i.test(navigator.userAgent);


