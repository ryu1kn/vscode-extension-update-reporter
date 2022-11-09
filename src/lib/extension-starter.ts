import CommandFactory from './command-factory';
import {COMMAND} from './const';
import FileSystem from './file-system';
import Main from './main';
import {ExtensionContextLike, VsCodeLike} from './types';

export default class ExtensionStarter {
  private readonly commandFactory: CommandFactory;
  private readonly main: Main;

  constructor(private readonly vscode: VsCodeLike, fileSystem: FileSystem) {
    this.commandFactory = new CommandFactory(fileSystem, vscode);
    this.main = this.commandFactory.createMain();
  }

  async start(context: ExtensionContextLike) {
    const commandHandler = () => {
      this.main.show();
    };

    context.subscriptions.push(
      this.vscode.commands.registerCommand(COMMAND, commandHandler)
    );

    await this.main.run();
  }
}
