import * as assert from 'assert';
const td = require('testdouble');

import ContentProvider from '../../lib/content-provider';
import ExtensionStore from '../../lib/extension-store';
const multiline = require('multiline-string')();

describe('ContentProvider', () => {
  const extensionStore = td.object('persistLoadedExtensions') as ExtensionStore;
  const changelogAssigner = td.object('assign');
  td
    .when(changelogAssigner.assign())
    .thenResolve('MARKDOWN_STRING');
  const contentProvider = new ContentProvider(changelogAssigner, extensionStore);

  it.skip('returns HTML with extension updates in it', async () => {
    const html = await contentProvider.provideTextDocumentContent();
    assert.equal(
      html,
      multiline(`
      <html>
        <head>
          <style>
            h2 { margin-top: 3em; }
          </style>
        </head>
        <body>
          <p>MARKDOWN_STRING</p>

        </body>
      </html>`)
    );
  });
});
