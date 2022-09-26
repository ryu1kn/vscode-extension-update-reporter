import CommandFactory from './command-factory';
import FileSystem from './file-system';
import Main from './main';

export default class ExtensionStarter {
  private readonly commandFactory: CommandFactory;
  private readonly main: Main;

  constructor(vscode: any, fileSystem: FileSystem) {
    this.commandFactory = new CommandFactory(fileSystem, vscode);
    this.main = this.commandFactory.createMain();
  }

  async start() {
    await this.main.run();
  }
}
