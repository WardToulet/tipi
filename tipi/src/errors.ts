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
abstract class TipiError {
  readonly endpoint?: string; 
  readonly message: string;

  constructor({ endpoint, message }: TipiErrorProps) {
    this.endpoint = endpoint;
    this.message = message;
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
