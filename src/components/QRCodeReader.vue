<template>
  <div class="qrcode-reader">
    <h3>📱 Leitura de QR Code</h3>
    
    <!-- Estado Inicial -->
    <div v-if="!isScanning && !decodedText">
      <p class="info-text">Clique no botão para escanear QR Code</p>
      <button @click="startScanning" class="scan-button qr-button">
        <div class="button-icon">📱</div>
        <div class="button-text">
          <strong>Iniciar Leitura</strong>
          <small>QR Code</small>
        </div>
      </button>
    </div>

    <!-- Estado de Scanning -->
    <div v-if="isScanning">
      <div class="scanning-header">
        <p class="info-text scanning-text">
          📱 Posicione o QR Code no centro do quadrado
        </p>
        <div class="scan-type-badge">QR Code</div>
      </div>
      
      <div class="camera-wrapper">
        <div class="camera-container">
          <StreamBarcodeReader 
            @decode="onDecode" 
            @loaded="onLoaded"
            @error="onError"
          />
          
          <!-- Overlay com área quadrada -->
          <div class="scan-overlay">
            <div class="scan-area scan-area-square">
              <div class="corner corner-tl"></div>
              <div class="corner corner-tr"></div>
              <div class="corner corner-bl"></div>
              <div class="corner corner-br"></div>
              <div class="scan-line scan-line-vertical"></div>
            </div>
          </div>
        </div>
      </div>

      <button @click="cancelScanning" class="cancel-button">
        ✕ Cancelar
      </button>

      <p v-if="cameraReady" class="camera-status">
        ✓ Câmera pronta! Centre o QR Code no quadrado.
      </p>
    </div>

    <!-- Estado de Resultado -->
    <div v-if="!isScanning && decodedText">
      <div class="result-display success">
        <div class="success-icon">✓</div>
        <p class="success-title">QR Code Detectado com Sucesso!</p>
        <div class="scan-type-result">📱 QR Code</div>
        <div class="code-value">
          <p class="code-label">Conteúdo:</p>
          <p class="result-text">{{ decodedText }}</p>
        </div>
      </div>

      <button @click="resetScanning" class="scan-button qr-button">
        🔄 Escanear Novo QR Code
      </button>
    </div>

    <!-- Mensagem de erro -->
    <p v-if="errorMessage" class="error-message">
      ⚠️ {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'

const decodedText = ref<string>('')
const isScanning = ref<boolean>(false)
const cameraReady = ref<boolean>(false)
const errorMessage = ref<string>('')

const startScanning = () => {
  isScanning.value = true
  decodedText.value = ''
  errorMessage.value = ''
  cameraReady.value = false
}

const cancelScanning = () => {
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
}

const resetScanning = () => {
  decodedText.value = ''
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
}

const onDecode = (result: string) => {
  console.log('QR Code lido:', result)
  decodedText.value = result
  errorMessage.value = ''
  isScanning.value = false
  cameraReady.value = false
}

const onLoaded = () => {
  console.log('Câmera QR Code carregada')
  cameraReady.value = true
  errorMessage.value = ''
}

const onError = (error: Error) => {
  console.error('Erro ao carregar câmera:', error)
  errorMessage.value = 'Erro ao acessar a câmera. Verifique as permissões.'
  cameraReady.value = false
  isScanning.value = false
}
</script>

<style scoped>
@import './shared-scanner-styles.css';

.qr-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.qr-button:hover {
  box-shadow: 0 8px 16px rgba(102, 126, 234, 0.4);
}

/* Área quadrada já definida no shared-scanner-styles.css */
</style>

