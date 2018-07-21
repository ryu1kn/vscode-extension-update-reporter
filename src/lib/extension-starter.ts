import CommandFactory from './command-factory';
import FileSystem from './file-system';
import {EXTENSION_NAME} from './const';
import {ExtensionContextLike} from './types';

export default class ExtensionStarter {
  private readonly vscode: any;
  private readonly commandFactory: CommandFactory;

  constructor(vscode: any, fileSystem: FileSystem) {
    this.vscode = vscode;
    this.commandFactory = new CommandFactory(fileSystem, vscode);
  }

  async start(context: ExtensionContextLike) {
    const disposable = this.vscode.workspace.registerTextDocumentContentProvider(
      EXTENSION_NAME,
      this.commandFactory.createContentProvider()
    );
    context.subscriptions.push(disposable);

    await this.commandFactory.createMain().run();
  }
}
