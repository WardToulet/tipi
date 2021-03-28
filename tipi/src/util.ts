import path from 'path';
import fs from 'fs';

export async function listFilesInDirRecrusively(
  dir: string, 
): Promise<string[]> {
  let listings = await fs.promises.readdir(dir, { withFileTypes: true });
  let results: string[] = [];

  for(let listing of listings) {
    if(listing.isFile()) {
      results.push(path.join(dir, (listing as fs.Dirent).name));
    } else {
      results.push(...(await listFilesInDirRecrusively(path.join(dir, (listing as fs.Dirent).name))));
    }
  }

  return results;
}

/**
 * Splits a string by `/` and returns the parts starting with `@` 
 * with the `@` prefix removed
 */
export function extractPathVariableNames(pathDef: string | string[]): string[] {
  // If the pathdef is multiple paths (array) we use the first of these (index 0)
  // we known the variables are the same in each step because this is garanteed before
  // the preload step is executed
  const path: string = Array.isArray(pathDef) ? pathDef[0] : pathDef;

  // Extract the variables from the string
  return path.split('/').filter(x => x.startsWith('@')).map(x => x.slice(1));
}
