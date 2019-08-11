import { run } from './binary';

/**
 * Extract file(s) from an archive to a directory
 */
export async function extract(
  archive: string,
  destination?: string | null,
  fileFilter?: string | string[] | null,
  switches?: string | string[] | null,
  full: boolean = true,
): Promise<void> {
  let args: string[] = [full ? 'x' : 'e'];
  if (destination) {
    args.push(`-o${destination}`);
  }
  if (switches) {
    args = args.concat(switches);
  }
  // No overwrite mode preset
  if (args.indexOf('-aoa') < 0 && args.indexOf('-aos') < 0 && args.indexOf('-aou') < 0 && args.indexOf('-aot') < 0) {
    args.push('-aoa'); // Overwrite All existing files without prompt
  }
  args.push(archive);
  if (fileFilter) {
    args = args.concat(fileFilter);
  }

  await run(args);
}
