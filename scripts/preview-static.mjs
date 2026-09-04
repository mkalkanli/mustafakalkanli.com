import { createServer } from 'node:http';
import { access, readFile, realpath } from 'node:fs/promises';
import {
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const defaultDistDir = resolve(projectRoot, 'dist');

const contentTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

export const contentTypeForPath = (assetPath) =>
  contentTypes.get(extname(assetPath).toLowerCase()) ??
  'application/octet-stream';

const isOutsideDirectory = (directory, candidate) => {
  const candidateRelativePath = relative(directory, candidate);

  return (
    candidateRelativePath === '..' ||
    candidateRelativePath.startsWith(`..${sep}`) ||
    isAbsolute(candidateRelativePath)
  );
};

export const resolveAssetPath = async (distDir, requestPath) => {
  const pathname = decodeURIComponent(requestPath.split('?')[0] ?? '/');
  const requestedPath =
    pathname === '/' || pathname.length === 0
      ? 'index.html'
      : pathname.replace(/^\/+/, '');
  const assetPath = resolve(distDir, requestedPath);

  if (isOutsideDirectory(distDir, assetPath)) {
    throw new Error('Requested asset resolves outside the dist directory.');
  }

  await access(assetPath);

  const [realDistDir, realAssetPath] = await Promise.all([
    realpath(distDir),
    realpath(assetPath),
  ]);
  if (isOutsideDirectory(realDistDir, realAssetPath)) {
    throw new Error('Requested asset resolves outside the dist directory.');
  }

  return realAssetPath;
};

export const createStaticPreviewServer = ({ distDir = defaultDistDir } = {}) =>
  createServer(async (request, response) => {
    if (!request.url || !request.method) {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Bad Request');
      return;
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, {
        Allow: 'GET, HEAD',
        'Content-Type': 'text/plain; charset=utf-8',
      });
      response.end('Method Not Allowed');
      return;
    }

    try {
      const assetPath = await resolveAssetPath(distDir, request.url);
      const body = await readFile(assetPath);

      response.writeHead(200, {
        'Cache-Control': 'no-store',
        'Content-Type': contentTypeForPath(assetPath),
      });

      if (request.method === 'HEAD') {
        response.end();
        return;
      }

      response.end(body);
    } catch (error) {
      const statusCode =
        error instanceof Error &&
        error.message.includes('outside the dist directory')
          ? 403
          : 404;

      response.writeHead(statusCode, {
        'Content-Type': 'text/plain; charset=utf-8',
      });
      response.end(statusCode === 403 ? 'Forbidden' : 'Not Found');
    }
  });

const startStaticPreview = async () => {
  const host = process.env.HOST ?? '127.0.0.1';
  const port = Number.parseInt(process.env.PORT ?? '4173', 10);

  await access(defaultDistDir);

  const server = createStaticPreviewServer();
  await new Promise((resolvePromise, rejectPromise) => {
    server.once('error', rejectPromise);
    server.listen(port, host, () => {
      server.off('error', rejectPromise);
      resolvePromise();
    });
  });

  console.log(`Static preview ready at http://${host}:${port}/`);
};

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  await startStaticPreview();
}
