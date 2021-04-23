import { HandleFunc } from '@wardtoulet/tipi';

export const path = '/test';
export const method = 'GET';

const mpokey = 'fdkjskdjkdfdj';

export const handle: HandleFunc<
  undefined,
  undefined,
  undefined,
  undefined,
  string
> = async () => {
  return 'Hello World';
}
