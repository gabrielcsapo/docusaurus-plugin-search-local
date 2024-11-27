import fs from 'fs';
import path from 'path';
import util from 'util';
import { Props as PostBuildProps } from '@docusaurus/types';
import { PluginConfig } from '../../types';
import { buildIndex } from './buildIndex';
import { debugInfo } from './debug';
import { processDocInfos } from './processDocInfos';
import { scanDocuments } from './scanDocuments';

const writeFileAsync = util.promisify(fs.writeFile);

export function postBuildFactory(config: PluginConfig) {
  return async function postBuild(buildData: PostBuildProps): Promise<void> {
    debugInfo('gathering documents');

    const data = processDocInfos(buildData, config);

    debugInfo('parsing documents');

    // Give every index entry a unique id so that the index does not need to store long URLs.
    const allDocuments = await scanDocuments(data);

    debugInfo('building index');

    const searchIndex = buildIndex(allDocuments);

    debugInfo('writing index to disk');

    await writeFileAsync(
      path.join(buildData.outDir, 'search-index.json'),
      JSON.stringify(searchIndex),
      { encoding: 'utf8' },
    );

    debugInfo('index written to disk successfully!');
  };
}
