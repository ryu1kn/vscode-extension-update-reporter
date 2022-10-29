import {join} from 'path';
import * as assert from 'assert';

import {PreloadedExtension} from '../../lib/entities/extension';
import * as vscode from 'vscode';
import {parseVersion} from '../../lib/entities/version';
import MarkdownReportGeneratorFactory from '../../lib/markdown-report-generator-factory';
import {mock, when} from '../helpers/helper';
import FileSystem from '../../lib/file-system';
import {INVALID_HEADING, INVALID_VERSION_FORMAT, VALID_1, VALID_2} from '../helpers/changelog-data';

const multiline = require('multiline-string')();

type ExtensionSource = {
  id: string;
  displayName: string;
  extensionPath: string;
  currentVersion: string;
  lastRecordedVersion: string;
  homepage?: string;
};

describe('Markdown Report', () => {
  const fileSystem = mock(FileSystem);
  when(fileSystem.readFile(join('PATH1','CHANGELOG.md'))).thenResolve(VALID_1);
  when(fileSystem.readFile(join('PATH2','CHANGELOG.md'))).thenResolve(VALID_2);
  when(fileSystem.readFile(join('PATH3','CHANGELOG.md'))).thenResolve(INVALID_VERSION_FORMAT);
  when(fileSystem.readFile(join('PATH4','CHANGELOG.md'))).thenReject(new Error('FILE_NOT_FOUND'));
  when(fileSystem.readFile(join('PATH5','CHANGELOG.md'))).thenResolve(INVALID_HEADING);

  const markdownReportGenerator = new MarkdownReportGeneratorFactory(fileSystem).create();

  it('creates an updates summary', async () => {
    const extension1 = createExtension({
      id: 'EXT1',
      displayName: 'EXT_NAME_1',
      extensionPath: 'PATH1',
      currentVersion: '1.0.0',
      lastRecordedVersion: '0.8.0'
    });
    const extension2 = createExtension({
      id: 'EXT2',
      displayName: 'EXT_NAME_2',
      homepage: 'https://github.com/ryu1kn/vscode-extension-update-reporter',
      extensionPath: 'PATH2',
      currentVersion: '0.1.0',
      lastRecordedVersion: '0.0.9'
    });

    await assertMarkdownReports([extension1, extension2], multiline(`
      # Extension Updates

      <details>
        <summary>There are 2 extensions updated.</summary>

        1. [EXT_NAME_1](#EXT1)
      2. [EXT_NAME_2](#EXT2)
      </details>

      <details open>
        <summary>

        ## <a id="EXT1"></a> EXT_NAME_1 \`EXT1\`
        </summary>

        [Marketplace](https://marketplace.visualstudio.com/items/EXT1) ● [Changelog](https://marketplace.visualstudio.com/items/EXT1/changelog)

        ### [1.0.0]
      #### Added
      - foo2
      - bar

      ### [0.9.0]
      #### Added
      - foo
      </details>

      <details open>
        <summary>

        ## <a id="EXT2"></a> EXT_NAME_2 \`EXT2\`
        </summary>

        [Marketplace](https://marketplace.visualstudio.com/items/EXT2) ● [Changelog](https://marketplace.visualstudio.com/items/EXT2/changelog) ● [Homepage](https://github.com/ryu1kn/vscode-extension-update-reporter)

        ### [0.1.0]
      #### Removed
      - baz
      </details>
      `)
    );
  });

  it('shows a message that changelog is not parsable', async () => {
    const extension = createExtension({
      id: 'EXT3',
      displayName: 'EXT_NAME_3',
      extensionPath: 'PATH3',
      currentVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    await assertMarkdownReports([extension], multiline(`
      # Extension Updates


      <details open>
        <summary>

        ## <a id="EXT3"></a> EXT_NAME_3 \`EXT3\`
        </summary>

        [Marketplace](https://marketplace.visualstudio.com/items/EXT3) ● [Changelog](https://marketplace.visualstudio.com/items/EXT3/changelog)

        Couldn't parse the changelog. Please view it on Marketplace by following the Changelog link above.
      </details>
      `)
    );
  });

  it('shows a message that changelog is not found', async () => {
    const extension = createExtension({
      id: 'EXT4',
      displayName: 'EXT_NAME_4',
      extensionPath: 'PATH4',
      currentVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    await assertMarkdownReports([extension], multiline(`
      # Extension Updates


      <details open>
        <summary>

        ## <a id="EXT4"></a> EXT_NAME_4 \`EXT4\`
        </summary>

        [Marketplace](https://marketplace.visualstudio.com/items/EXT4)

        CHANGELOG.md not found
      </details>
      `)
    );
  });

  it('increases an indent level of each header in the change description', async () => {
    const extension = createExtension({
      id: 'EXT5',
      displayName: 'EXT_NAME_5',
      extensionPath: 'PATH5',
      currentVersion: '1.3.0',
      lastRecordedVersion: '0.0.1'
    });

    await assertMarkdownReports([extension], multiline(`
      # Extension Updates


      <details open>
        <summary>

        ## <a id="EXT5"></a> EXT_NAME_5 \`EXT5\`
        </summary>

        [Marketplace](https://marketplace.visualstudio.com/items/EXT5) ● [Changelog](https://marketplace.visualstudio.com/items/EXT5/changelog)

        ### [1.3.0]
      * foo

      #### Fixes:
      * bar
      </details>
      `)
    );
  });

  async function assertMarkdownReports(extensions: PreloadedExtension[], expectedReport: string) {
    assert.strictEqual(
      await markdownReportGenerator.generate(extensions),
      expectedReport
    );
  }

  function createExtension({id, displayName, extensionPath, currentVersion, lastRecordedVersion, homepage}: ExtensionSource) {
    const extensionRaw = {
      id,
      extensionPath,
      packageJSON: {
        displayName,
        version: currentVersion,
        homepage
      }
    } as vscode.Extension<any>;
    return new PreloadedExtension(extensionRaw, parseVersion(lastRecordedVersion));
  }
});
