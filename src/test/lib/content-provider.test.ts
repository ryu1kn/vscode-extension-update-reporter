import * as assert from 'assert';
import ContentProvider from '../../lib/content-provider';
import ExtensionStore from '../../lib/extension-store';
import {PreloadedExtension} from '../../lib/entities/extension';
import {parseVersion} from '../../lib/entities/version';
import * as vscode from 'vscode';
import {left} from 'fp-ts/lib/Either';

const td = require('testdouble');

const multiline = require('multiline-string')({ marginMark: '|' });

describe('ContentProvider', () => {
  const extensionRaw = { packageJSON: { displayName: 'EXT_NAME' } } as vscode.Extension<any>;
  const extension = new PreloadedExtension(extensionRaw, parseVersion('0.1.0'));
  const extensionStore = td.object(['getUpdatedExtensions', 'persistLoadedExtensions']) as ExtensionStore;
  td.when(extensionStore.getUpdatedExtensions()).thenReturn([extension]);
  const changelogAssigner = td.object('assign');
  td.when(changelogAssigner.assign([extension]))
    .thenResolve([extension.withHistory(left('ERROR_MESSAGE'))]);
  const contentProvider = new ContentProvider(changelogAssigner, extensionStore);

  it('returns HTML with extension updates in it', async () => {
    const html = await contentProvider.provideTextDocumentContent();
    const expectation = multiline(`
        |  <body>
        |    <h1>Extension Updates</h1>
        |<h2>EXT_NAME</h2>
        |<p>ERROR_MESSAGE</p>
        |
        |  </body>`);
    assert.ok(html.includes(expectation));
  });
});
