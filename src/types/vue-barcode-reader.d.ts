declare module '@teckel/vue-barcode-reader' {
  import { DefineComponent } from 'vue'

  export const StreamBarcodeReader: DefineComponent<{
    onDecode?: (result: string) => void
    onLoaded?: () => void
    onError?: (error: Error) => void
  }>

  export const ImageBarcodeReader: DefineComponent<{
    onDecode?: (result: string) => void
    onError?: (error: Error) => void
  }>
}

