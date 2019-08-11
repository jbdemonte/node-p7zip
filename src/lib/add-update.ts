import { run } from './binary';

const countRe = /Items to compress: (\d+)/;

function build(tag: string) {
  return async (archive: string, files: string | string[], switches?: string | string[]): Promise<number> => {
    const args: string[] = [tag].concat(switches || [], archive, files);
    const lines = await run(args);
    const match = lines.join('\n').match(countRe);
    return match ? parseInt(match[1], 10) : 0;
  };
}

/**
 * Add file(s) to archive
 */
export const add = build('a');

/**
 * Update file(s) to archive
 */
export const update = build('u');
