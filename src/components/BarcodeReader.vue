<template>
  <div class="barcode-reader">
    <h3>Leitura com Câmera (Webcam/Celular)</h3>
    
    <!-- Estado Inicial: Botão para iniciar scan -->
    <div v-if="!isScanning && !decodedText">
      <p class="info-text">Clique no botão abaixo para iniciar a leitura</p>
      <button @click="startScanning" class="scan-button">
        📷 Iniciar Leitura de Código
      </button>
    </div>

    <!-- Estado de Scanning: Câmera ativa -->
    <div v-if="isScanning">
      <p class="info-text scanning-text">
        📸 Aponte a câmera para o código de barras ou QR Code
      </p>
      
      <div class="camera-container">
        <StreamBarcodeReader 
          @decode="onDecode" 
          @loaded="onLoaded"
          @error="onError"
        />
      </div>

      <button @click="cancelScanning" class="cancel-button">
        ✕ Cancelar Leitura
      </button>

      <p v-if="cameraReady" style="color: #42b983; font-weight: bold; margin-top: 1rem;">
        ✓ Câmera pronta! Aponte para o código.
      </p>
    </div>

    <!-- Estado de Resultado: Exibir código lido -->
    <div v-if="!isScanning && decodedText">
      <div class="result-display success">
        <div class="success-icon">✓</div>
        <p class="success-title">Código Detectado com Sucesso!</p>
        <div class="code-value">
          <p class="code-label">Valor do Código:</p>
          <p class="result-text">{{ decodedText }}</p>
        </div>
      </div>

      <button @click="resetScanning" class="scan-button">
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

// Iniciar o processo de scanning
const startScanning = () => {
  isScanning.value = true
  decodedText.value = ''
  errorMessage.value = ''
  cameraReady.value = false
}

// Cancelar o scanning
const cancelScanning = () => {
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
}

// Resetar para fazer novo scan
const resetScanning = () => {
  decodedText.value = ''
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
}

// Função chamada quando um código é decodificado
const onDecode = (result: string) => {
  console.log('Código lido:', result)
  decodedText.value = result
  errorMessage.value = ''
  // Fechar a câmera automaticamente após a leitura
  isScanning.value = false
  cameraReady.value = false
}

// Função chamada quando a câmera está pronta para uso
const onLoaded = () => {
  console.log('Componente da câmera carregado e pronto.')
  cameraReady.value = true
  errorMessage.value = ''
}

// Função chamada em caso de erro
const onError = (error: Error) => {
  console.error('Erro ao carregar câmera:', error)
  errorMessage.value = 'Erro ao acessar a câmera. Verifique as permissões.'
  cameraReady.value = false
  isScanning.value = false
}
</script>

<style scoped>
.barcode-reader {
  width: 100%;
}

.scan-button {
  background-color: #42b983;
  color: white;
  font-size: 1.2em;
  padding: 1em 2em;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  box-shadow: 0 4px 6px rgba(66, 185, 131, 0.3);
}

.scan-button:hover {
  background-color: #359268;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(66, 185, 131, 0.4);
}

.scan-button:active {
  transform: translateY(0);
}

.cancel-button {
  background-color: #ff6b6b;
  color: white;
  font-size: 1em;
  padding: 0.8em 1.5em;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
}

.cancel-button:hover {
  background-color: #ee5253;
  transform: translateY(-2px);
}

.camera-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000;
  min-height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin: 1.5rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.camera-container video {
  max-width: 100%;
  height: auto;
}

.scanning-text {
  color: #42b983;
  font-weight: bold;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.result-display.success {
  background: linear-gradient(135deg, #1e1e1e 0%, #2a4a3a 100%);
  border: 3px solid #42b983;
  padding: 2rem;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-icon {
  font-size: 4em;
  color: #42b983;
  margin-bottom: 0.5rem;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0);
  }
  to {
    transform: scale(1);
  }
}

.success-title {
  font-size: 1.3em;
  color: #42b983;
  font-weight: bold;
  margin-bottom: 1rem;
}

.code-value {
  background-color: rgba(66, 185, 131, 0.1);
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.code-label {
  font-size: 0.9em;
  color: #888;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.result-text {
  font-size: 1.8em;
  font-weight: bold;
  color: #42b983;
  word-break: break-all;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
}

@media (max-width: 768px) {
  .scan-button {
    font-size: 1em;
    padding: 0.8em 1.5em;
  }
  
  .camera-container {
    min-height: 300px;
  }
  
  .result-text {
    font-size: 1.3em;
  }
  
  .success-icon {
    font-size: 3em;
  }
}
</style>

