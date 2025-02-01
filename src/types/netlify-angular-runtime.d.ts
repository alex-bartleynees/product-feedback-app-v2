declare module '@netlify/angular-runtime/context' {
  export interface AppEngineContext {
    manifest: {
      basePath: string;
      supportedLocales: Record<string, string>;
      entryPoints: Record<string, () => Promise<any>>;
    };
    documentFilePath: string;
  }

  export function getContext(): AppEngineContext;
}
