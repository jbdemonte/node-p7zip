import { run } from './binary';

/**
 * Delete file(s) from archive
 * @param {string} archive
 * @param {string|string[]} files
 * @param {string|string[]} [switches]
 * @return {Promise}
 */
export async function remove(archive: string, files: string | string[], switches?: string | string[]): Promise<void> {
  const args: string[] = ['d'].concat(switches || [], archive, files);
  await run(args);
}
