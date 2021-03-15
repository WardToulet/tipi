import { HandleFunc } from 'tipi';

export const method = 'GET';
export const path = '/context';

export const handle: HandleFunc<undefined, undefined, undefined, string> = async () => {
  return 'Helo context';
}
