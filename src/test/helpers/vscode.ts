import {EXTENSION_NAME} from '../../lib/const';
import ContentProvider from '../../lib/content-provider';
import * as vscode from 'vscode';
import {EXTENSION_METADATA, LAST_RECORDED_VERSIONS} from './extension-data';
import {ObjectMap} from '../../lib/utils/collection';

class VsCode {
  private readonly extensionMetaData: vscode.Extension<any>[];
  private readonly lastRecordedVersions: ObjectMap<string>;
  private contentProvider?: ContentProvider;
  private providedContent?: string;

  constructor(extensionMetaData?: vscode.Extension<any>[], lastRecordedVersions?: ObjectMap<string>) {
    this.extensionMetaData = extensionMetaData || EXTENSION_METADATA;
    this.lastRecordedVersions = lastRecordedVersions || LAST_RECORDED_VERSIONS;
  }

  get _providedContent() {
    return this.providedContent;
  }

  get extensions() {
    return {
      all: this.extensionMetaData
    };
  }

  get workspace() {
    return {
      getConfiguration: (key: string) =>
        key === 'extensionUpdateReporter' && {
          get: (key: string) => key === 'lastCheckedVersions' && this.lastRecordedVersions,
          update: () => {
          }
        },

      registerTextDocumentContentProvider: (extName: string, contentProvider: ContentProvider) => {
        if (extName === EXTENSION_NAME) this.contentProvider = contentProvider;
      }
    };
  }

  get commands() {
    return {
      executeCommand: async (name: String, uri: string, something: any | undefined, title: String): Promise<string | void> => {
        if (name === 'vscode.previewHtml' && uri === `${EXTENSION_NAME}:show-updates-summary`) {
          this.providedContent = await this.contentProvider!.provideTextDocumentContent();
        }
      }
    };
  }

  get Uri() {
    return {parse: (raw: string) => raw};
  }
}

export function createVsCode(extensionMetaData?: vscode.Extension<any>[], lastRecordedVersions?: ObjectMap<string>) {
  return new VsCode(extensionMetaData, lastRecordedVersions);
}
