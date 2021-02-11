import { HTTPStatusCode } from '../httpHelpers/httpStatusCode';

type HTTPErrorProps = {
  status: HTTPStatusCode;
  message: any;
}

export default class HTTPError extends Error {
  readonly status: HTTPStatusCode;
  // Is object is used to set the response type header when returnign to the client
  private isObject: boolean;

  constructor({ status, message }: HTTPErrorProps) {
    super();
    this.name = 'HTTPError';
    this.isObject = (typeof message === 'object');
    this.message = this.isObject
      ? JSON.stringify(message)
      : message;
    this.status = status;
  }
}

export function mapHTTPError(status: HTTPStatusCode, err: Error): HTTPError {
  return new HTTPError({ status, message: err.message });
}
