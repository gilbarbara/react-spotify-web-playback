import { canUseDOM as canUseDOMBool } from 'exenv';

export interface ScriptAttributes {
  async?: boolean;
  defer?: boolean;
  id?: string;
  source: string;
}

export const canUseDOM = () => canUseDOMBool;

export const STATUS = {
  ERROR: 'ERROR',
  IDLE: 'IDLE',
  INITIALIZING: 'INITIALIZING',
  READY: 'READY',
  RUNNING: 'RUNNING',
  UNSUPPORTED: 'UNSUPPORTED',
};

export function isEqualArray(A?: any, B?: any) {
  if (!Array.isArray(A) || !Array.isArray(B) || A.length !== B.length) {
    return false;
  }

  let result = true;

  A.forEach((a: string) =>
    B.forEach((b: string) => {
      result = a === b;
    }),
  );

  return result;
}

export function loadScript(attributes: ScriptAttributes): Promise<any> {
  if (!attributes || !attributes.source) {
    throw new Error('Invalid attributes');
  }

  return new Promise((resolve, reject) => {
    const { async, defer, id, source }: ScriptAttributes = {
      async: false,
      defer: false,
      source: '',
      ...attributes,
    };

    const script = document.createElement('script');

    script.id = id || '';
    script.type = 'text/javascript';
    script.async = async;
    script.defer = defer;
    script.src = source;
    script.onload = () => resolve(undefined);
    script.onerror = (error: any) => reject(`createScript: ${error.message}`);

    document.head.appendChild(script);
  });
}
