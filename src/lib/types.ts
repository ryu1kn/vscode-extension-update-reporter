import {Version} from './entities/version';

export type Change = {
  version: Version;
  changeText: string;
};

export type ExtensionContextLike = {
  subscriptions: {dispose(): any}[];
};

export type VsCodeLike = {
  _providedContent: any;
  _configUpdateCall: any;
  extensions: any;
  workspace: any;
  window: any;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  Uri: any;
  /* eslint-disable-next-line @typescript-eslint/naming-convention */
  ViewColumn: any;
  commands: any;
};
