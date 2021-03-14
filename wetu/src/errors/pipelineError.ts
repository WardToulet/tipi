type PipelineErrorProps = {
  pipeline: string,
  message: string,
}

export default class PipelineError extends Error {
  readonly pipeline: string;

  constructor({ pipeline, message }: PipelineErrorProps) {
    super();
    this.message = `[error][pipline ${pipeline}] ${message}`;
    this.name = 'PipelineError';
  } 
}
