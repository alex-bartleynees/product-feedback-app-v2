import { AsyncLocalStorage } from 'node:async_hooks';
import { IncomingMessage } from 'node:http';

// Use globalThis to ensure the same instance across all modules
declare global {
  var __REQUEST_STORAGE__: AsyncLocalStorage<IncomingMessage> | undefined;
}

/**
 * AsyncLocalStorage for storing the incoming request during SSR.
 * This allows us to access the request from anywhere in the application
 * during server-side rendering without passing it through the DI system.
 *
 * Using globalThis ensures the same instance is shared between server.ts
 * and the Angular server bundle.
 */
if (!globalThis.__REQUEST_STORAGE__) {
  globalThis.__REQUEST_STORAGE__ = new AsyncLocalStorage<IncomingMessage>();
}

export const requestStorage = globalThis.__REQUEST_STORAGE__;

/**
 * Get the current request from AsyncLocalStorage
 */
export function getCurrentRequest(): IncomingMessage | undefined {
  return requestStorage.getStore();
}
