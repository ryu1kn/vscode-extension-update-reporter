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
  Uri: any;
  ViewColumn: any;
  commands: any;
}
