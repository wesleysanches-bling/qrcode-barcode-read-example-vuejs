<template>
  <div class="barcode-reader">
    <h3>📊 Leitura de Código de Barras</h3>
    
    <!-- Estado Inicial -->
    <div v-if="!isScanning && !decodedText">
      <p class="info-text">Clique no botão para escanear código de barras</p>
      <button @click="startScanning" class="scan-button barcode-button">
        <div class="button-icon">📊</div>
        <div class="button-text">
          <strong>Iniciar Leitura</strong>
          <small>EAN, UPC, Code 128, Boleto</small>
        </div>
      </button>
    </div>

    <!-- Estado de Scanning -->
    <div v-if="isScanning">
      <div class="scanning-header">
        <p class="info-text scanning-text">
          📊 Posicione o código de barras horizontalmente
        </p>
        <div class="scan-type-badge">Código de Barras</div>
      </div>
      
      <div class="camera-wrapper">
        <div class="camera-container">
          <StreamBarcodeReader 
            v-model:hasTorch="hasTorch"
            v-model:hasZoom="hasZoom"
            v-model:hasAutofocus="hasAutofocus"
            v-model:hasFocusDistance="hasFocusDistance"
            v-model:videoDevices="videoDevices"
            :torch="torch"
            :zoom="Number(zoom)"
            :autofocus="autofocus"
            :focus-distance="Number(focusDistance)"
            :device-index="deviceIndex"
            :ms-between-decoding="300"
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

          <!-- Controles Simplificados -->
          <div v-if="cameraReady" class="quick-controls">
            <!-- Flash/Torch -->
            <button
              v-if="hasTorch"
              @click="torch = !torch"
              :class="['control-btn', { 'active': torch }]"
              title="Flash"
            >
              {{ torch ? '💡' : '💡' }}
            </button>

            <!-- Trocar Câmera -->
            <button
              v-if="videoDevices?.devices?.length > 1"
              @click="switchCamera"
              class="control-btn"
              title="Trocar Câmera"
            >
              🔄
            </button>

            <!-- Zoom Simplificado -->
            <button
              v-if="hasZoom"
              @click="toggleZoom"
              :class="['control-btn', { 'active': zoom > 1 }]"
              title="Zoom"
            >
              🔍
            </button>
          </div>
        </div>
      </div>

      <button @click="cancelScanning" class="cancel-button">
        ✕ Cancelar
      </button>

      <div v-if="cameraReady" class="camera-status">
        <p>✓ Câmera pronta!</p>
        <p class="hint">💡 Dica: Use 🔍 para dar zoom se necessário</p>
      </div>
    </div>

    <!-- Estado de Resultado -->
    <div v-if="!isScanning && decodedText">
      <div class="result-display success">
        <div class="success-icon">✓</div>
        <p class="success-title">Código de Barras Detectado!</p>
        <div class="scan-type-result">📊 Código de Barras</div>
        <div class="code-value">
          <p class="code-label">Código:</p>
          <p class="result-text">{{ decodedText }}</p>
        </div>
      </div>

      <button @click="resetScanning" class="scan-button barcode-button">
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
import { ref, watch } from 'vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'

interface ZoomCapabilities {
  min: number
  max: number
  step: number
}

interface FocusCapabilities {
  min: number
  max: number
  step: number
}

interface VideoDevices {
  devices?: Array<any>
  selectedIndex?: number
}

const decodedText = ref<string>('')
const isScanning = ref<boolean>(false)
const cameraReady = ref<boolean>(false)
const errorMessage = ref<string>('')

// Controles de câmera
const hasTorch = ref<boolean>(false)
const hasZoom = ref<ZoomCapabilities | false>(false)
const hasAutofocus = ref<boolean>(false)
const hasFocusDistance = ref<FocusCapabilities | false>(false)
const videoDevices = ref<VideoDevices>({})

// Estados dos controles
const torch = ref<boolean>(false)
const zoom = ref<number>(1)
const autofocus = ref<boolean>(true)
const focusDistance = ref<number>(0)
const deviceIndex = ref<number | null>(null)

const startScanning = () => {
  isScanning.value = true
  decodedText.value = ''
  errorMessage.value = ''
  cameraReady.value = false
  
  // Reset dos controles
  torch.value = false
  zoom.value = 1
  autofocus.value = true
  focusDistance.value = 0
}

const cancelScanning = () => {
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
  
  // Reset dos controles
  torch.value = false
  zoom.value = 1
  autofocus.value = true
}

const resetScanning = () => {
  decodedText.value = ''
  isScanning.value = false
  cameraReady.value = false
  errorMessage.value = ''
}

const toggleZoom = () => {
  // Alterna entre zoom normal (1x) e zoom aumentado (2x)
  zoom.value = zoom.value > 1 ? 1 : 2
}

const switchCamera = () => {
  const length = videoDevices.value?.devices?.length || 0
  if (deviceIndex.value !== null && deviceIndex.value >= 0 && length > 1) {
    cameraReady.value = false
    deviceIndex.value = deviceIndex.value + 1 >= length ? 0 : deviceIndex.value + 1
  }
}

const onDecode = (result: string) => {
  console.log('Código de barras lido:', result)
  decodedText.value = result
  errorMessage.value = ''
  isScanning.value = false
  cameraReady.value = false
}

const onLoaded = () => {
  console.log('Câmera de código de barras carregada')
  cameraReady.value = true
  errorMessage.value = ''
  
  // Mantém autofoco sempre ativo
  autofocus.value = true
  
  // Zoom inicial normal
  zoom.value = 1
}

const onError = (error: Error) => {
  console.error('Erro ao carregar câmera:', error)
  errorMessage.value = 'Erro ao acessar a câmera. Verifique as permissões.'
  cameraReady.value = false
  isScanning.value = false
}

// Observar mudanças no autofocus
watch(hasAutofocus, (newValue) => {
  if (newValue) {
    autofocus.value = true
  }
})
</script>

<style scoped>
@import './shared-scanner-styles.css';

.barcode-button {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.3);
}

.barcode-button:hover {
  box-shadow: 0 8px 16px rgba(240, 147, 251, 0.4);
}

/* Área retangular já definida no shared-scanner-styles.css */

/* Quick Controls */
.quick-controls {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.8rem;
  z-index: 10;
}

.control-btn {
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  padding: 0.6em 1.2em;
  border-radius: 20px;
  font-size: 0.9em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.control-btn:hover {
  background-color: rgba(0, 0, 0, 0.9);
  border-color: #42b983;
  transform: scale(1.05);
}

.control-btn.active {
  background-color: #42b983;
  border-color: #42b983;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.6);
}

/* Zoom Control (Direita) */
.zoom-control {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 1.5rem 0.8rem;
  border-radius: 30px;
}

/* Focus Control (Esquerda) */
.focus-control {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(10px);
  padding: 1.5rem 0.8rem;
  border-radius: 30px;
}

.control-label {
  font-size: 1.3em;
  color: white;
}

.control-value {
  font-size: 0.75em;
  color: #42b983;
  font-weight: bold;
  min-width: 40px;
  text-align: center;
}

/* Slider Vertical */
.slider-vertical {
  writing-mode: bt-lr;
  -webkit-appearance: slider-vertical;
  appearance: slider-vertical;
  width: 8px;
  height: 150px;
  padding: 0;
  margin: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  outline: none;
}

.slider-vertical::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

.slider-vertical::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #42b983;
  cursor: pointer;
  border: none;
  box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
}

.hint {
  font-size: 0.85em;
  color: #888;
  margin-top: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .quick-controls {
    top: 10px;
    gap: 0.5rem;
  }

  .control-btn {
    font-size: 0.8em;
    padding: 0.5em 1em;
  }

  .zoom-control,
  .focus-control {
    padding: 1rem 0.6rem;
  }

  .slider-vertical {
    height: 120px;
  }

  .control-label {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .quick-controls {
    gap: 0.4rem;
    flex-wrap: wrap;
  }

  .control-btn {
    font-size: 0.75em;
    padding: 0.4em 0.8em;
  }

  .zoom-control {
    right: 5px;
  }

  .focus-control {
    left: 5px;
  }

  .slider-vertical {
    height: 100px;
  }
}
</style>
