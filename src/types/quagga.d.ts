declare module '@ericblade/quagga2' {
  export interface QuaggaJSResultObject {
    codeResult: {
      code: string
      format: string
    }
  }

  export interface QuaggaJSConfigObject {
    inputStream: {
      name: string
      type: string
      target?: HTMLElement | string
      constraints?: {
        width?: number
        height?: number
        facingMode?: string
        aspectRatio?: number
      }
    }
    decoder: {
      readers: string[]
      multiple?: boolean
    }
    locate?: boolean
    locator?: {
      patchSize?: string
      halfSample?: boolean
    }
    frequency?: number
  }

  export default class Quagga {
    static init(
      config: QuaggaJSConfigObject,
      callback?: (err: any) => void
    ): Promise<void>
    static start(): void
    static stop(): void
    static onDetected(callback: (result: QuaggaJSResultObject) => void): void
    static offDetected(callback: (result: QuaggaJSResultObject) => void): void
  }
}

