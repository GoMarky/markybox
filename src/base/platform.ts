import { IServiceIdentifier, IServicesAccessor } from '@/platform/instantiation/common/instantiation';

enum SystemOS {
  MacOS = 'MacOS',
  Linux = 'Linux',
  Windows = 'Windows',
}

const systemOS = (() => {
  if (navigator.userAgent.indexOf('Win') !== -1) {
    return SystemOS.Windows;
  }
  if (navigator.userAgent.indexOf('Mac') !== -1) {
    return SystemOS.MacOS;
  }

  if (navigator.userAgent.indexOf('Linux') !== -1 || navigator.userAgent.indexOf('X11') !== -1) {
    return SystemOS.Linux;
  }
})();

export const isWindows = systemOS === SystemOS.Windows;
export const isMac = systemOS === SystemOS.MacOS;
export const isLinux = systemOS === SystemOS.Linux;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      APP_VERSION: string;
      BUILD_NUMBER: string;
      BUILD_DATE: string;
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
export const APP_VERSION: string = process.env.APP_VERSION;
export const buildNumber: string = process.env.BUILD_NUMBER
export const buildDate: string = process.env.BUILD_DATE;
export const isMobileDevice = /Mobi/i.test(navigator.userAgent);


