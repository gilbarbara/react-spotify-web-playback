import { canUseDOM as canUseDOMBool } from 'exenv';

interface ScriptAttributes {
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

export const TYPE = {
  DEVICE: 'device_update',
  PLAYER: 'player_update',
  STATUS: 'status_update',
  TRACK: 'track_update',
};

export function getSpotifyURIType(uri: string): string {
  const [, type = ''] = uri.split(':');

  return type;
}

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
      ...attributes,
    };

    const scriptTag = document.getElementById('spotify-player');

    if (!scriptTag) {
      const script = document.createElement('script');

      script.id = id || '';
      script.type = 'text/javascript';
      script.async = async;
      script.defer = defer;
      script.src = source;
      script.onload = () => resolve(undefined);
      script.onerror = (error: any) => reject(new Error(`createScript: ${error.message}`));

      document.head.appendChild(script);
    } else {
      resolve();
    }
  });
}

export function validateURI(input: string): boolean {
  const validTypes = ['album', 'artist', 'playlist', 'show', 'track'];

  /* istanbul ignore else */
  if (input && input.indexOf(':') > -1) {
    const [key, type, id] = input.split(':');

    /* istanbul ignore else */
    if (key === 'spotify' && validTypes.indexOf(type) >= 0 && id.length === 22) {
      return true;
    }
  }

  return false;
}
