import preCheck from '../../src/endpoint/preCheck';
import HandleFunc from '../../src/endpoint/handle';
import { PipelineError } from '../../src/errors';

// Define reusable parts for makeing endpoint
const name = 'foo';
const handle: HandleFunc<undefined, undefined, undefined, undefined, string> = async (_req) => 
  'Hello world';
const path = '/foo';
const method = 'GET';

describe('preCheck', () => {
  it('Should require path export', () => {
    expect(() => preCheck({ name, handle, method })).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, method, path: '/foo'})).not.toThrow();
    expect(() => preCheck({ name, handle, method, path: [ '/foo', '/bar' ]})).not.toThrow();
  });

  it('Should require path to start with a `/`', () => {
    expect(() => preCheck({ name, handle, method, path: 'foo'})).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, method, path: [ 'foo', 'bar' ]})).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, method, path: [ '/foo', 'bar' ]})).toThrowError(PipelineError);
  });

  it('Should not alllow empty path array', () => {
    expect(() => preCheck({ name, handle, method, path: []})).toThrowError(PipelineError);
  });

  it('Should not allow path arrays with different variables', () => {
    expect(() => preCheck({ name, handle, method, path: [ '/@foo', '/test/@foo' ]})).not.toThrow();
    expect(() => preCheck({ name, handle, method, path: [ '/test/@foo/@bar', '/exaple/@bar/@foo' ]})).not.toThrow();
    expect(() => preCheck({ name, handle, method, path: [ '/@foo', '/@bar' ]})).toThrowError(PipelineError);
  });
        
  it('Should not allow ambigious paths', () => {
    expect(() => preCheck({ name, handle, method, path: [ '/@foo/@bar', '/@bar/@foo' ]})).toThrowError(PipelineError)
    expect(() => preCheck({ name, handle, method, path: [ '/a/@foo/@bar', '/b/@bar/@foo' ]})).not.toThrow();
  });

  it('Should require valid method export', () => {
    expect(() => preCheck({ name, handle, path })).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, path, method: 'FOO' })).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, path, method: 'GET' })).not.toThrow();
  });

  it('Should export a handle function', () => {
    expect(() => preCheck({ name, path, method })).toThrowError(PipelineError);
    expect(() => preCheck({ name, handle, path, method })).not.toThrow();
  });
})
