import {Version} from './entities/version';

export type Change = {
  version: Version;
  changeText: string;
};

export type ExtensionContextLike = {
  subscriptions: {dispose(): any}[];
};
