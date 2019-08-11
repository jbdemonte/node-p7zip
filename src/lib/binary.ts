import { spawn } from 'child_process';
import * as path from 'path';

const bin = path.resolve(path.join(__dirname, '..', '..', 'bin', '7za'));

/**
 * Run 7za using arguments, arguments may be inline or in an array
 * @param {any[]} args
 * @return {Promise<string[]>}
 */
export function run(args: string[]): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const cmd = spawn(bin, args);
    let out = '';

    cmd.stdout.on('data', lines => {
      out += lines.toString();
    });

    // cmd.stderr.on('data', () => undefined));

    cmd.on('close', code => {
      if (code) {
        reject(new Error(`Command exit with code ${code}`));
      } else {
        resolve(out.replace(/\r/g, '').split(/\n/));
      }
    });
  });
}
