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

export { default as extractPathVariableNames } from './extractPathVariableNames';
