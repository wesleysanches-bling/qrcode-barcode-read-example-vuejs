<template>
  <div class="barcode-reader-vue">
    <h3>📊 Leitura de Código de Barras (vue-barcode-reader)</h3>
    
    <!-- Estado Inicial -->
    <div v-if="!isScanning && !decodedText">
      <p class="info-text">Teste com @teckel/vue-barcode-reader (mesma lib do QR Code)</p>
      <button @click="startScanning" class="scan-button barcode-vue-button">
        <div class="button-icon">📊</div>
        <div class="button-text">
          <strong>Iniciar Leitura</strong>
          <small>Boletos com vue-barcode-reader</small>
        </div>
      </button>
    </div>

    <!-- Estado de Scanning -->
    <div v-if="isScanning">
      <div class="scanning-header">
        <p class="info-text scanning-text">
          📊 Posicione o código de barras horizontalmente
        </p>
        <div class="scan-type-badge vue-badge">vue-barcode-reader</div>
      </div>
      
      <div class="camera-wrapper">
        <div class="camera-container">
          <StreamBarcodeReader
            @decode="onDecode"
            @loaded="onLoaded"
            @error="onError"
          />
          <!-- Overlay com área retangular -->
          <div class="scan-overlay">
            <div class="scan-area scan-area-rectangle">
              <div class="corner corner-tl"></div>
              <div class="corner corner-tr"></div>
              <div class="corner corner-bl"></div>
              <div class="corner corner-br"></div>
              <div class="scan-line"></div>
            </div>
          </div>
        </div>
      </div>

      <button @click="cancelScanning" class="cancel-button">
        ✕ Cancelar
      </button>

      <p v-if="cameraReady" class="camera-status">
        ✓ Câmera pronta! Posicione o código horizontalmente.
      </p>
    </div>

    <!-- Estado de Resultado -->
    <div v-if="!isScanning && decodedText">
      <div class="result-display success">
        <div class="success-icon">✓</div>
        <p class="success-title">Código de Barras Detectado!</p>
        <div class="scan-type-result">📊 vue-barcode-reader (ZXing)</div>
        <div class="code-info">
          <span class="code-length">📏 {{ decodedText.length }} dígitos</span>
          <span v-if="decodedText.length === 44" class="code-type">🏦 Código de Barras</span>
          <span v-else-if="decodedText.length >= 47" class="code-type">📄 Linha Digitável</span>
        </div>
        <div class="code-value">
          <p class="code-label">Código Lido:</p>
          <p class="result-text">{{ decodedText }}</p>
        </div>
        <div v-if="decodedText.length === 44" class="info-box">
          <p class="info-title">ℹ️ Informação:</p>
          <p class="info-text">
            Este é o <strong>código de barras puro</strong> (44 dígitos).<br>
            Os <strong>dígitos verificadores</strong> (DV) não aparecem nesta representação.<br>
            É normal e o código está correto para processar o pagamento!
          </p>
        </div>
      </div>

      <button @click="resetScanning" class="scan-button barcode-vue-button">
        🔄 Escanear Novo Código
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
  console.log('📊 Código de barras lido (vue-barcode-reader):', result)
  console.log('📏 Tamanho:', result.length)
  
  // Limpar código
  const cleanCode = result.replace(/\D/g, '')
  const cleanLength = cleanCode.length
  
  console.log('🔢 Código limpo:', cleanCode, 'Tamanho limpo:', cleanLength)
  
  // Validar tamanho (apenas boletos: 44, 47, 48)
  const validLengths = [44, 47, 48]
  if (!validLengths.includes(cleanLength)) {
    console.log(`⚠️ Código ignorado - tamanho ${cleanLength} inválido`)
    return
  }
  
  console.log('✅ Código válido aceito!')
  decodedText.value = cleanCode
  errorMessage.value = ''
  isScanning.value = false
  cameraReady.value = false
}

const onLoaded = () => {
  console.log('Câmera de código de barras carregada e pronta.')
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

.barcode-reader-vue {
  width: 100%;
}

.barcode-vue-button {
  background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.barcode-vue-button:hover {
  box-shadow: 0 8px 16px rgba(76, 175, 80, 0.4);
}

.vue-badge {
  background-color: rgba(76, 175, 80, 0.2) !important;
  color: #4caf50 !important;
  border: 1px solid #4caf50;
}

.code-info {
  margin: 0.5rem 0;
}

.code-length {
  display: inline-block;
  background-color: rgba(66, 185, 131, 0.15);
  color: #42b983;
  padding: 0.3em 0.8em;
  border-radius: 12px;
  font-size: 0.9em;
  font-weight: bold;
}

.code-type {
  display: inline-block;
  background-color: rgba(33, 150, 243, 0.15);
  color: #2196f3;
  padding: 0.3em 0.8em;
  border-radius: 12px;
  font-size: 0.85em;
  font-weight: bold;
  margin-left: 0.5rem;
}

.info-box {
  background-color: rgba(33, 150, 243, 0.1);
  border: 2px solid rgba(33, 150, 243, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  text-align: left;
}

.info-title {
  font-size: 1.1em;
  font-weight: bold;
  color: #2196f3;
  margin-bottom: 0.8rem;
}

.info-text {
  font-size: 0.95em;
  color: #ccc;
  line-height: 1.6;
}

.info-text strong {
  color: #42b983;
}
</style>

