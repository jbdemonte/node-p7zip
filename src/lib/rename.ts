import { run } from './binary';

/**
 * Rename a file in archive
 */

export async function rename(archive: string, oldName: string, newName: string, switches?: string | string[]): Promise<void> {
  await run(['rn'].concat(switches || [], archive, oldName, newName));
}
