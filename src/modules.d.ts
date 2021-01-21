import {} from '@hapi/hapi';
declare module '@hapi/hapi' {
  interface HandlerDecorations {
    none: string;
  }
}
