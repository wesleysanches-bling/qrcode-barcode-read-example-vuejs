<template>
  <div class="barcode-reader">
    <h3>📊 Leitura de Código de Barras</h3>
    
    <!-- Estado Inicial -->
    <div v-if="!isScanning && !decodedText">
      <p class="info-text">Leitor especializado em boletos bancários</p>
      <button @click="startScanning" class="scan-button barcode-button">
        <div class="button-icon">📊</div>
        <div class="button-text">
          <strong>Iniciar Leitura</strong>
          <small>Boletos Bancários (44-48 dígitos)</small>
        </div>
      </button>
    </div>

    <!-- Estado de Scanning -->
    <div v-if="isScanning">
      <div class="scanning-header">
        <p class="info-text scanning-text">
          📊 Posicione o código de barras horizontalmente
        </p>
        <div class="scan-type-badge">Código de Barras - QuaggaJS</div>
      </div>
      
      <div class="camera-wrapper">
        <div class="camera-container">
          <!-- Container para o Quagga -->
          <div ref="scannerContainer" class="quagga-container"></div>
          
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

      <div v-if="cameraReady" class="camera-status">
        <p>✓ Câmera pronta! Mantenha estável por alguns segundos.</p>
        <p class="hint">📏 <strong>Aceita APENAS boletos:</strong> 44, 47 ou 48 dígitos</p>
        <p class="hint warning">⚠️ O código precisa ser detectado 3 vezes para confirmar</p>
      </div>
    </div>

    <!-- Estado de Resultado -->
    <div v-if="!isScanning && decodedText">
      <div class="result-display success">
        <div class="success-icon">✓</div>
        <p class="success-title">Código de Barras Detectado!</p>
        <div class="scan-type-result">📊 {{ formatType }}</div>
        <div class="code-info">
          <span class="code-length">📏 {{ decodedText.length }} dígitos</span>
          <span v-if="decodedText.length === 44" class="code-type">🏦 Código de Barras (sem DV)</span>
          <span v-else-if="decodedText.length >= 47" class="code-type">📄 Linha Digitável (com DV)</span>
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
import { ref, onUnmounted, nextTick } from 'vue'
import Quagga from '@ericblade/quagga2'

const decodedText = ref<string>('')
const formatType = ref<string>('')
const isScanning = ref<boolean>(false)
const cameraReady = ref<boolean>(false)
const errorMessage = ref<string>('')
const scannerContainer = ref<HTMLElement | null>(null)

let detectionHandler: ((result: any) => void) | null = null

// Contador de detecções consecutivas do mesmo código
let lastCode = ''
let consecutiveCount = 0
const REQUIRED_CONSECUTIVE = 3  // Precisa detectar 3 vezes seguidas

// Validar tamanho e qualidade do código - APENAS BOLETOS
const isValidBarcodeLength = (code: string): boolean => {
  const length = code.length
  
  // Remover espaços ou caracteres não numéricos
  const cleanCode = code.replace(/\D/g, '')
  const cleanLength = cleanCode.length
  
  console.log(`🔍 Analisando código: "${code}"`)
  console.log(`📏 Tamanho: ${cleanLength} dígitos`)
  console.log(`🔢 Código: ${cleanCode}`)
  
  // APENAS BOLETOS BANCÁRIOS:
  // 44 dígitos: Código de barras de boleto (representação numérica)
  // 47 dígitos: Linha digitável de boleto (formato completo)  
  // 48 dígitos: Linha digitável com dígitos extras
  
  const validLengths = [
    44,  // Boleto - código de barras
    47,  // Boleto - linha digitável
    48   // Boleto - linha digitável completa
  ]
  
  const isValidLength = validLengths.includes(cleanLength)
  
  if (!isValidLength) {
    console.log(`❌ REJEITADO - Tamanho ${cleanLength} inválido`)
    consecutiveCount = 0
    lastCode = ''
    return false
  }
  
  // Validação adicional: código de boleto não pode ter muitos dígitos repetidos seguidos
  const hasInvalidPattern = /(\d)\1{10,}/.test(cleanCode)  // 10+ dígitos iguais seguidos
  if (hasInvalidPattern) {
    console.log(`❌ REJEITADO - Padrão suspeito (muitos dígitos repetidos)`)
    consecutiveCount = 0
    lastCode = ''
    return false
  }
  
  // Verificar consistência: precisa detectar o mesmo código múltiplas vezes
  if (cleanCode === lastCode) {
    consecutiveCount++
    console.log(`🔄 Detecção ${consecutiveCount}/${REQUIRED_CONSECUTIVE} do mesmo código`)
  } else {
    consecutiveCount = 1
    lastCode = cleanCode
    console.log(`🆕 Novo código detectado (1/${REQUIRED_CONSECUTIVE})`)
  }
  
  if (consecutiveCount >= REQUIRED_CONSECUTIVE) {
    console.log(`✅ ACEITO - Código verificado ${consecutiveCount} vezes!`)
    return true
  }
  
  return false  // Ainda precisa de mais detecções
}

// Função auxiliar para tentar inicializar com diferentes configurações
const tryInitQuagga = async (constraints: any): Promise<boolean> => {
  return new Promise((resolve) => {
    Quagga.init(
      {
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: scannerContainer.value,
          constraints: constraints
        },
        decoder: {
          readers: [
            'code_128_reader', // Code 128 (BOLETOS) - PRINCIPAL
            'i2of5_reader'     // Interleaved 2 of 5 (BOLETOS antigos)
          ],
          multiple: false
        },
        locate: true,
        locator: {
          patchSize: 'large',   // Reduzido de x-large para large
          halfSample: false     // Maior precisão
        },
        frequency: 10,
        numOfWorkers: Math.min(navigator.hardwareConcurrency || 2, 4), // Limitar a 4 workers
        debug: {
          drawBoundingBox: false,
          showFrequency: false,
          drawScanline: false,
          showPattern: false
        }
      },
      (err) => {
        if (err) {
          console.error('Erro ao inicializar Quagga com constraints:', constraints, err)
          resolve(false)
        } else {
          console.log('Quagga inicializado com sucesso!')
          resolve(true)
        }
      }
    )
  })
}

const startScanning = async () => {
  isScanning.value = true
  decodedText.value = ''
  errorMessage.value = ''
  cameraReady.value = false
  
  // Reset do contador
  lastCode = ''
  consecutiveCount = 0

  // Aguarda o DOM atualizar para garantir que o ref está disponível
  await nextTick()

  if (!scannerContainer.value) {
    errorMessage.value = 'Erro: Container não encontrado'
    isScanning.value = false
    return
  }

  console.log('Iniciando QuaggaJS...')

  // Tentar diferentes configurações (do mais otimizado ao mais conservador)
  const configAttempts = [
    // Tentativa 1: Qualidade média-alta (mais compatível para produção)
    {
      width: { min: 640, ideal: 1280, max: 1920 },
      height: { min: 480, ideal: 720, max: 1080 },
      facingMode: 'environment'
    },
    // Tentativa 2: Qualidade média (fallback)
    {
      width: { ideal: 1280 },
      height: { ideal: 720 },
      facingMode: 'environment'
    },
    // Tentativa 3: Básico (último recurso)
    {
      width: 640,
      height: 480,
      facingMode: 'environment'
    }
  ]

  let initialized = false
  for (let i = 0; i < configAttempts.length && !initialized; i++) {
    console.log(`Tentando inicializar com configuração ${i + 1}/${configAttempts.length}...`)
    initialized = await tryInitQuagga(configAttempts[i])
  }

  if (!initialized) {
    errorMessage.value = 'Não foi possível inicializar a câmera. Tente novamente ou use outro dispositivo.'
    isScanning.value = false
    return
  }

  console.log('Quagga configurado e pronto!')
  
  // Handler para detecção
  detectionHandler = (result: any) => {
    if (result && result.codeResult && result.codeResult.code) {
      const code = result.codeResult.code
      const format = result.codeResult.format || 'Desconhecido'
      
      console.log('Código detectado:', code, 'Tamanho:', code.length, 'Formato:', format)
      
      // Validar tamanho do código (boletos e códigos comuns)
      if (!isValidBarcodeLength(code)) {
        console.log('Código ignorado: tamanho inválido')
        return
      }
      
      decodedText.value = code
      formatType.value = format
      stopScanning()
    }
  }
  
  Quagga.onDetected(detectionHandler)
  Quagga.start()
  cameraReady.value = true
  console.log('Quagga scanner ativo!')
}

const stopScanning = () => {
  try {
    if (detectionHandler) {
      Quagga.offDetected(detectionHandler)
      detectionHandler = null
    }
    Quagga.stop()
    isScanning.value = false
    cameraReady.value = false
    
    // Reset do contador
    lastCode = ''
    consecutiveCount = 0
  } catch (error) {
    console.error('Erro ao parar scanner:', error)
  }
}

const cancelScanning = () => {
  stopScanning()
  errorMessage.value = ''
}

const resetScanning = () => {
  decodedText.value = ''
  formatType.value = ''
  errorMessage.value = ''
}

// Cleanup ao desmontar componente
onUnmounted(() => {
  if (isScanning.value) {
    stopScanning()
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

.quagga-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.quagga-container :deep(video),
.quagga-container :deep(canvas) {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
}

/* Ocultar canvas de desenho do Quagga (usamos nosso próprio overlay) */
.quagga-container :deep(canvas.drawingBuffer) {
  display: none !important;
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

.hint {
  font-size: 0.85em;
  color: #888;
  margin-top: 0.5rem;
}

.hint.warning {
  color: #ff9800;
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

