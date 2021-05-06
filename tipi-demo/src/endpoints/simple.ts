import { HandleFunc } from '@wardtoulet/tipi';

export const method = 'GET';
export const path = '/simple';

export const handle: HandleFunc<{}, string> = async () => {
  return 'Helo world';
}
