declare module '@netlify/angular-runtime/context' {
  export interface AppEngineContext {
    manifest: {
      basePath: string;
      supportedLocales: Record<string, string>;
      entryPoints: Record<string, () => Promise<unknown>>;
    };
    documentFilePath: string;
  }

  export function getContext(): AppEngineContext;
}
