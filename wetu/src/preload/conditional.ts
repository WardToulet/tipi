import PreloadFunc from './preload';

/**
 * Takes a predicate function, and a preload function the preload is run 
 * if the predicate returns true
 */
export const conditional = (predicate: (module: any) => boolean, preloadFunc: PreloadFunc): PreloadFunc => (module: any): any => {
  if(predicate(module)) {
    return preloadFunc(module);
  } else {
    return module;
  }
}
