import * as vscode from 'vscode';
import CommandFactory from './command-factory';
import { COMMAND } from './const';
import FileSystem from './file-system';
import Main from './main';

export default class ExtensionStarter {
  private readonly commandFactory: CommandFactory;
  private readonly main: Main;

  constructor(vscode: any, fileSystem: FileSystem) {
    this.commandFactory = new CommandFactory(fileSystem, vscode);
    this.main = this.commandFactory.createMain();
  }

  async start(context: vscode.ExtensionContext) {
    const commandHandler = () => {
      this.main.show();
    };

    context.subscriptions.push(
      vscode.commands.registerCommand(COMMAND, commandHandler)
    );

    await this.main.run();
  }
}
