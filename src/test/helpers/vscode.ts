import {EXTENSION_NAME} from '../../lib/const';
import ContentProvider from '../../lib/content-provider';
import {EXTENSION_METADATA, LAST_RECORDED_VERSIONS} from './extension-data';
import {ObjectMap} from '../../lib/utils/collection';

type ConfigUpdateCall = [string, ObjectMap<string>, boolean];

class VsCode {
  private readonly lastRecordedVersions: ObjectMap<string>;
  private contentProvider?: ContentProvider;
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
        key === 'extensionUpdateReporter' && {
          get: (key: string) => key === 'lastCheckedVersions' && this.lastRecordedVersions,
          update: (...args: any[]) => {
            this.configUpdateCall = args as ConfigUpdateCall;
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

export function createVsCode(lastRecordedVersions?: ObjectMap<string>) {
  return new VsCode(lastRecordedVersions);
}
