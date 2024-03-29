/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {EXTENSION_METADATA, LAST_RECORDED_VERSIONS} from './extension-data';
import {ObjectMap} from '../../lib/utils/collection';
import {EXTENSION_ID} from '../../lib/const';
import {VsCodeLike} from '../../lib/types';

type ConfigUpdateCall = [string, ObjectMap<string>, boolean];

class VsCode implements VsCodeLike {
  private readonly lastRecordedVersions: ObjectMap<string>;
  private providedContent?: string;
  private configUpdateCall?: ConfigUpdateCall;

  constructor(lastRecordedVersions?: ObjectMap<string>) {
    this.lastRecordedVersions = lastRecordedVersions || LAST_RECORDED_VERSIONS;
  }

  get _providedContent() {
    return this.providedContent;
  }

  get _configUpdateCall() {
    return this.configUpdateCall;
  }

  get extensions() {
    return {all: EXTENSION_METADATA};
  }

  get workspace() {
    return {
      getConfiguration: (key: string) =>
        key === EXTENSION_ID && {
          get: (key: string) => key === 'lastCheckedVersions' && this.lastRecordedVersions,
          update: (...args: any[]) => {
            this.configUpdateCall = args as ConfigUpdateCall;
          }
        }
    };
  }

  get window() {
    return {
      createWebviewPanel: (_viewType: string, _title: string, _showOptions: any, _options?: any): any => {
        const that = this;
        return {
          webview: {
            set html(html: string) { that.providedContent = html; }
          },
          onDidDispose: () => {}
        };
      }
    };
  }

  get Uri() {
    return {parse: (raw: string) => raw};
  }

  get ViewColumn() {
    return {One: 'ONE'};
  }

  get commands() {
    return {
      registerCommand: (command: string, callback: (...args: any[]) => any, thisArg?: any) => {}
    };
  }
}

export function createVsCode(lastRecordedVersions?: ObjectMap<string>) {
  return new VsCode(lastRecordedVersions);
}
