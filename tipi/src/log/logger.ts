import Log, { LogLevel } from './log';

export interface Logger {
  (log: Log): void
}

const mapColor = (level: LogLevel): string => {
  switch(level) {
    case 'ERROR': return '\x1b[31m';
    case 'WARNING': return  '\x1b[33m';
    case 'LOG': return '\x1b[32m';
  }
}

export const simpleLogger: Logger = (log: Log) => {
  // TODO add color
  console.log(`${mapColor(log.level)}${log.tags.reverse().map(x => `[${x}]`).join('')} ${log.message}\x1b[0m`)
}
