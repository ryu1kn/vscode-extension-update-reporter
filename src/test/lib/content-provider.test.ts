import * as assert from 'assert';
const td = require('testdouble');

import ContentProvider from '../../lib/content-provider';
const multiline = require('multiline-string')();

describe('ContentProvider', () => {
  const extensionUpdatesReportGenerator = td.object('generate');
  td
    .when(extensionUpdatesReportGenerator.generate())
    .thenResolve('MARKDOWN_STRING');
  const contentProvider = new ContentProvider(extensionUpdatesReportGenerator);

  it('returns HTML with extension updates in it', async () => {
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
