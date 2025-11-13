declare module 'simple-peer' {
  namespace SimplePeer {
    export interface Options {
      initiator?: boolean;
      trickle?: boolean;
      stream?: MediaStream;
    }

    export interface SignalData {
      type?: string;
      sdp?: string;
      candidate?: any;
    }

    export interface Instance {
      signal(data: SignalData): void;
      send(data: string | Uint8Array): void;
      on(event: 'signal', listener: (data: SignalData) => void): void;
      on(event: 'connect', listener: () => void): void;
      on(event: 'data', listener: (data: Uint8Array) => void): void;
      on(event: 'close', listener: () => void): void;
      on(event: 'error', listener: (err: Error) => void): void;
      destroy(): void;
      connected: boolean;
    }
  }

  class SimplePeer implements SimplePeer.Instance {
    constructor(options?: SimplePeer.Options);
    signal(data: SimplePeer.SignalData): void;
    send(data: string | Uint8Array): void;
    on(event: 'signal', listener: (data: SimplePeer.SignalData) => void): void;
    on(event: 'connect', listener: () => void): void;
    on(event: 'data', listener: (data: Uint8Array) => void): void;
    on(event: 'close', listener: () => void): void;
    on(event: 'error', listener: (err: Error) => void): void;
    destroy(): void;
    connected: boolean;
  }

  export = SimplePeer;
}
