// Error types for tipi
// An error should say where it originated at what stage

interface TipiErrorProps {
  /**
   * The name of the endpoint where the error occured
   */
  endpoint?: string,
  /**
   * A human readable error message
   */
  message: string,
}

/**
 * Base class for other error classes
 */
abstract class TipiError extends Error {
  readonly endpoint?: string; 

  constructor({ endpoint, message }: TipiErrorProps) {
    super(message);
    this.endpoint = endpoint;
  }
}

interface HTTPErrorProps {
  // FIXME: use http method type
  status: number,
}

export class HTTPError extends TipiError {
  readonly status: number;

  constructor({ status, ...props }: HTTPErrorProps & TipiErrorProps ) {
    super(props);
    this.status = status;
  }
} 

export class PipelineError extends TipiError {
}
