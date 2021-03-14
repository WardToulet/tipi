type PreloadErrorProps = {
  preloadName: string,
  message: string,
}

export default class PreloadError extends Error {
  readonly pipeline: string;

  constructor({ preloadName, message }: PreloadErrorProps) {
    super();
    this.message = `[preload: ${preloadName}] ${message}`;
    this.name = 'PreloadError';
  } 
}
