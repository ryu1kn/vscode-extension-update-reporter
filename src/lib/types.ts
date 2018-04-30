import {Version} from './entities/version';

export type Change = {
  version: Version;
  changeText: string;
};
