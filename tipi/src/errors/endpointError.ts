type EndpointErrorProps = {
  message: string,
}

export default class EndpointError extends Error {
  constructor({ message }: EndpointErrorProps) {
    super();
    this.message = `[endoint] ${message}`;
    this.name = 'EndpointError';
  } 
}
