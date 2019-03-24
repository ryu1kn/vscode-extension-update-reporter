import CommandFactory from './command-factory';
import FileSystem from './file-system';
import {ExtensionContextLike} from './types';

export default class ExtensionStarter {
  private readonly commandFactory: CommandFactory;

  constructor(vscode: any, fileSystem: FileSystem) {
    this.commandFactory = new CommandFactory(fileSystem, vscode);
  }

  async start(context: ExtensionContextLike) {
    const contentProvider = this.commandFactory.createContentProvider();
    await this.commandFactory.createMain().run(context, contentProvider);
  }
}
