import http from 'http';
import tipi from '@wardtoulet/tipi';

(async () => {
  const router = await tipi({
    endpoints: `${__dirname}/endpoints`,
    match: (file: string) => /^[a-z]*.endpoint.js$/.test(file),
  });

  const server = http.createServer(router);
  server.listen(8090, () => console.log('Server listening on port 8090'));
})();
