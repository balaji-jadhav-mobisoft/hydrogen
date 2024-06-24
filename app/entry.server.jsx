import {RemixServer} from '@remix-run/react';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {createContentSecurityPolicy} from '@shopify/hydrogen';

/**
 * @param {Request} request
 * @param {number} responseStatusCode
 * @param {Headers} responseHeaders
 * @param {EntryContext} remixContext
 */
export default async function handleRequest(
  request,
  responseStatusCode,
  responseHeaders,
  remixContext,
) {
  // Generate the nonce first
  const {nonce, header, NonceProvider} = createContentSecurityPolicy();

  // Update the Content Security Policy directives to include the nonce
  const cspHeader = {
    ...header,
    directives: {
      ...header.directives,
      defaultSrc: [
        "'self'",
        `'nonce-${nonce}'`,
        'https://cdn.shopify.com',
        'https://shopify.com',
        'http://localhost:*',
      ],
      scriptSrc: [
        "'self'",
        `'nonce-${nonce}'`,
        'https://cdn.shopify.com',
        'https://shopify.com',
        'http://localhost:*',
        'https://cdn.jsdelivr.net',
      ],
    },
  };

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');
  responseHeaders.set('Content-Security-Policy', cspHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

/** @typedef {import('@shopify/remix-oxygen').EntryContext} EntryContext */
