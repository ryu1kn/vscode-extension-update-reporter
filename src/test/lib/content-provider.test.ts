import * as assert from 'assert';
import {mock, when} from '../helpers/helper';

import ContentProvider from '../../lib/content-provider';
import ExtensionStore from '../../lib/extension-store';
import {PreloadedExtension} from '../../lib/entities/extension';
import {parseVersion} from '../../lib/entities/version';
import * as vscode from 'vscode';
import MarkdownReportGeneratorFactory from '../../lib/markdown-report-generator-factory';
import FileSystem from '../../lib/file-system';

const multiline = require('multiline-string')({ marginMark: '|' });

describe('ContentProvider', () => {
  const extensionRaw = { id: 'ID', packageJSON: { displayName: 'EXT_NAME' } } as vscode.Extension<any>;
  const extension = new PreloadedExtension(extensionRaw, parseVersion('0.1.0'));

  const extensionStore = mock(ExtensionStore);
  when(extensionStore.getUpdatedExtensions()).thenReturn([extension]);

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('PATH1/CHANGELOG.md')).thenResolve();

  const markdownReportGenerator = new MarkdownReportGeneratorFactory(fileSystem).create();

  const contentProvider = new ContentProvider(markdownReportGenerator, extensionStore);

  it('returns HTML with extension updates in it', async () => {
    const html = await contentProvider.provideTextDocumentContent();
    const expectation = multiline(`
        |  <body>
        |    <h1>Extension Updates</h1>
        |<h2>EXT_NAME <code>ID</code></h2>
        |<p>CHANGELOG.md not found</p>
        |
        |  </body>`);
    assert.ok(html.includes(expectation));
  });
});
