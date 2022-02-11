import { Disposable } from '@/platform/lifecycle/common/lifecycle';
import {
  EnvironmentAPIData,
  EnvironmentAPIDataField,
  FonbetEnvVariation,
  IEnvironmentService,
} from '@/platform/environment/common/environment';
import { MobileOS } from '@/base/platform';
import { Barrier } from '@/base/async';

/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */

export class NullEnvironmentService extends Disposable implements IEnvironmentService {
  public readonly clientServers: string[];
  public readonly lineServers: string[];

  public readonly fonbetURLs: EnvironmentAPIData;
  public readonly release: boolean;
  public readonly version: string;

  public readonly variation: FonbetEnvVariation;
  public readonly staticDir: string;
  public readonly basePath: string;

  public readonly isDev: boolean;
  public readonly os: MobileOS;
  public readonly whenURLsSettled: Barrier;
  public readonly origin: string;
  public readonly isWebView: boolean;

  constructor() {
    super();

    const { common, line } = require('@/platform/request/browser/urls/urls-red');

    this.clientServers = common;
    this.lineServers = line;
  }

  public addOrigin(): string {
    return '';
  }

  public getUrlsJsonField(): EnvironmentAPIDataField {
    return '';
  }

  public setServers(): void {
    //
  }
}
