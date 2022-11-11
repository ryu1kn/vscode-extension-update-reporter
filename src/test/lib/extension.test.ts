import * as assert from 'assert';

import {RawExtension} from '../../lib/entities/extension';
import * as vscode from 'vscode';

describe('Extension', () => {
  it('uses `displayName` as its name', () => {
    const extension = createExtension({
      displayName: 'foo',
      name: 'bar' });
    assert.strictEqual(extension.displayName, 'foo');
  });

  it('uses `name` as its name if `displayName` is not available', () => {
    const extension = createExtension({
      name: 'bar' });
    assert.strictEqual(extension.displayName, 'bar');
  });

  it('uses `homepage` as its homepage', () => {
    const extension = createExtension({
      homepage: 'foo',
      links: { getstarted: { uri: 'bar' }},
      repository: 'https://github.com/ryu1kn/vscode-extension-update-reporter.git' });
    assert.strictEqual(extension.homepage, 'foo');
  });

  it('uses `links.getstarted.uri` as its homepage when `homepage` is not available', () => {
    const extension = createExtension({
      links: { getstarted: { uri: 'foo' }},
      repository: 'https://github.com/ryu1kn/vscode-extension-update-reporter.git'});
    assert.strictEqual(extension.homepage, 'foo');
  });

  it('uses `repository` as its homepage when `homepage` and `links.getstarted.uri` is not available', () => {
    const extension = createExtension({
      repository: 'https://github.com/ryu1kn/vscode-extension-update-reporter.git' });
    assert.strictEqual(extension.homepage, 'https://github.com/ryu1kn/vscode-extension-update-reporter#readme');
  });

  it('uses `repository` string as its repository', () => {
    ['https://github.com/ryu1kn/vscode-extension-update-reporter.git',
     'git+https://github.com/ryu1kn/vscode-extension-update-reporter.git',
     'git+ssh://git@github.com/ryu1kn/vscode-extension-update-reporter.git'
    ].forEach((repository) => {
      const extension = createExtension({
        repository });
      assert.strictEqual(extension.repository, 'https://github.com/ryu1kn/vscode-extension-update-reporter.git');
    });
  });

  it('uses `repository` object as its repository', () => {
    ['https://github.com/ryu1kn/vscode-extension-update-reporter.git',
     'git+https://github.com/ryu1kn/vscode-extension-update-reporter.git',
     'git+ssh://git@github.com/ryu1kn/vscode-extension-update-reporter.git'
    ].forEach((repository) => {
      const extension = createExtension({
        repository: {
          url: repository
      }});
      assert.strictEqual(extension.repository, 'https://github.com/ryu1kn/vscode-extension-update-reporter.git');
    });
  });

  function createExtension (packageJson: any) {
    const rawExtension = {
      packageJSON: packageJson
    };
    return new RawExtension(rawExtension as vscode.Extension<any>);
  }
});
