import {EXTENSION_NAME} from "../../lib/const";
import ContentProvider from "../../lib/content-provider";

class VsCode {
  private contentProvider?: ContentProvider;
  private providedContent?: string;

  get _providedContent() {
    return this.providedContent;
  }

  get extensions() {
    return {
      all: [
        {
          id: 'ID_1',
          extensionPath: 'PATH_1',
          packageJSON: {displayName: 'My Extension 1', version: '1.0.0'}
        },
        {
          id: 'ID_2',
          extensionPath: 'PATH_2',
          packageJSON: {displayName: 'My Extension 2', version: '1.0.0'}
        },
        {
          id: 'ID_3',
          extensionPath: 'PATH_3',
          packageJSON: {displayName: 'My Extension 3', version: '0.12.1'}
        }
      ]
    };
  }

  get workspace() {
    return {
      getConfiguration: (key: string) =>
        key === 'extensionUpdateReporter' && {
          get: (key: string) =>
            key === 'lastCheckedVersions' && {
              ID_1: '0.8.0',
              ID_2: '0.1.0',
              ID_3: '0.1.0'
            },
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

export const vscode = new VsCode();
