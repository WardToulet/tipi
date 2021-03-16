import { HandleFunc } from 'tipi';

export const method = 'GET';
export const path = '/simple';

export const handle: HandleFunc<undefined, undefined, undefined, undefined, string> = async () => {
  return 'Helo world';
}
