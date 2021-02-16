// I will add more levels if when I need them
export type LogLevel = 'LOG' | 'WARNING' | 'ERROR';

type LogProps = {
  level: LogLevel,
  tag?: string,
  message: string,
}

/**
 * Defines a log
 */
export default class Log {
  readonly level: LogLevel;
  readonly tags: string[];
  readonly message: string;

  constructor({ level, tag, message }: LogProps) {
    this.level = level;
    this.tags = tag ? [ tag ] : [];
    this.message = message;
  }

  /**
   * Adds a tag to the front of the log returns the log
   */
  public addTag(tag: string): Log {
    this.tags.push(tag)
    return this;
  }

  get log() {
    return `${this.tags.reverse().join('')} ${this.message}`;
  }
}
