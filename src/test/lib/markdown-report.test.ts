import * as assert from 'assert';

import {PreloadedExtension} from '../../lib/entities/extension';
import * as vscode from 'vscode';
import {parseVersion} from '../../lib/entities/version';
import MarkdownReportGeneratorFactory from '../../lib/markdown-report-generator-factory';
import {mock, when} from '../helpers/helper';
import FileSystem from '../../lib/file-system';

const multiline = require('multiline-string')();

type ExtensionSource = {
  id: string;
  displayName: string;
  extensionPath: string;
  knownVersion: string;
  lastRecordedVersion: string;
};

describe('Markdown Report', () => {
  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile('PATH1/CHANGELOG.md')).thenResolve(multiline(`
        The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

        ## [1.0.0] - 2018-04-21
        ### Added
        - foo2
        - bar

        ## [0.9.0] - 2018-04-20
        ### Added
        - foo

        ## [0.8.0] - 2018-04-19
        ### Added
        - baz
        `));
  when(fileSystem.readFile('PATH2/CHANGELOG.md')).thenResolve(multiline(`
        The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

        ## [0.1.0] - 2018-04-22
        ### Removed
        - baz

        ## [0.0.9] - 2018-04-21
        ### Removed
        - foo
        `));
  when(fileSystem.readFile('PATH3/CHANGELOG.md')).thenResolve(multiline(`
        ### 1-3-0
        * foo
        `));
  when(fileSystem.readFile('PATH4/CHANGELOG.md')).thenReject(new Error('FILE_NOT_FOUND'));
  when(fileSystem.readFile('PATH5/CHANGELOG.md')).thenResolve(multiline(`
        ### 1.3.0
        * foo
        
        ### Fixes:
        * bar
        `));

  const markdownReportGenerator = new MarkdownReportGeneratorFactory(fileSystem).create();

  it('creates an updates summary', async () => {
    const extension1 = createExtension({
      id: 'EXT1',
      displayName: 'EXT_NAME_1',
      extensionPath: 'PATH1',
      knownVersion: '1.0.0',
      lastRecordedVersion: '0.8.0'
    });
    const extension2 = createExtension({
      id: 'EXT2',
      displayName: 'EXT_NAME_2',
      extensionPath: 'PATH2',
      knownVersion: '0.1.0',
      lastRecordedVersion: '0.0.9'
    });

    assertMarkdownReports([extension1, extension2], multiline(`
      # Extension Updates

      ## EXT_NAME_1 \`EXT1\`
      ### [1.0.0]
      #### Added
      - foo2
      - bar

      ### [0.9.0]
      #### Added
      - foo

      ## EXT_NAME_2 \`EXT2\`
      ### [0.1.0]
      #### Removed
      - baz
      `)
    );
  });

  it('shows a message that changelog is not available', async () => {
    const extension = createExtension({
      id: 'EXT3',
      displayName: 'EXT_NAME_3',
      extensionPath: 'PATH3',
      knownVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    assertMarkdownReports([extension], multiline(`
      # Extension Updates

      ## EXT_NAME_3 \`EXT3\`
      Couldn't parse the changelog. [View it on Marketplace](https://marketplace.visualstudio.com/items/EXT3/changelog).
      `)
    );
  });

  it('shows a message that changelog is not found', async () => {
    const extension = createExtension({
      id: 'EXT4',
      displayName: 'EXT_NAME_4',
      extensionPath: 'PATH4',
      knownVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    assertMarkdownReports([extension], multiline(`
      # Extension Updates

      ## EXT_NAME_4 \`EXT4\`
      CHANGELOG.md not found
      `)
    );
  });

  it('increases an indent level of each header in the change description', async () => {
    const extension = createExtension({
      id: 'EXT5',
      displayName: 'EXT_NAME_5',
      extensionPath: 'PATH5',
      knownVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    assertMarkdownReports([extension], multiline(`
      # Extension Updates

      ## EXT_NAME_5 \`EXT5\`
      ### [1.3.0]
      * foo
      
      #### Fixes:
      * bar
      `)
    );
  });

  async function assertMarkdownReports(extensions: PreloadedExtension[], expectedReport: string) {
    assert.deepEqual(
      await markdownReportGenerator.generate(extensions),
      expectedReport
    );
  }

  function createExtension({id, displayName, extensionPath, knownVersion, lastRecordedVersion}: ExtensionSource) {
    const extensionRaw = {
      id,
      extensionPath,
      packageJSON: {
        displayName,
        version: knownVersion
      }
    } as vscode.Extension<any>;
    return new PreloadedExtension(extensionRaw, parseVersion(lastRecordedVersion));
  }
});
