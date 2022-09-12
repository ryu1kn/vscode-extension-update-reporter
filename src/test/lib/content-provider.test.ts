import {join} from 'path';
import * as assert from 'assert';
import {mock, when} from '../helpers/helper';

import ContentProvider from '../../lib/content-provider';
import {PreloadedExtension} from '../../lib/entities/extension';
import {parseVersion} from '../../lib/entities/version';
import * as vscode from 'vscode';
import MarkdownReportGeneratorFactory from '../../lib/markdown-report-generator-factory';
import FileSystem from '../../lib/file-system';

const multiline = require('multiline-string')({ marginMark: '|' });

describe('ContentProvider', () => {
  const extensionRaw = { id: 'ID', extensionPath: 'PATH1', packageJSON: { version: '1.0.0', displayName: 'EXT_NAME' } } as vscode.Extension<any>;
  const updatedExtensions = [new PreloadedExtension(extensionRaw, parseVersion('0.1.0'))];

  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile(join('PATH1', 'CHANGELOG.md'))).thenReject(new Error('FILE_NOT_FOUND'));

  const markdownReportGenerator = new MarkdownReportGeneratorFactory(fileSystem).create();

  const contentProvider = new ContentProvider(markdownReportGenerator);

  it('returns HTML with extension updates in it', async () => {
    const html = await contentProvider.provideTextDocumentContent(updatedExtensions);
    const expectation = multiline(`
        |  <body>
        |    <h1>Extension Updates</h1>
        |<details open>
        |  <summary>
        |<h2>EXT_NAME <code>ID</code></h2>
        |  </summary>
        |<p>CHANGELOG.md not found</p>
        |</details>
        |
        |  </body>`);
    assert.ok(html.includes(expectation));
  });
});
