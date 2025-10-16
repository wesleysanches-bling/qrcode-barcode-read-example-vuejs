<template>
  <div>
    <h1>📱 Leitor de QR Code e Código de Barras</h1>
    
    <div class="card">
      <QRCodeReader />
    </div>

    <div class="card">
      <BarcodeReaderQuagga />
    </div>

    <div class="separator">
      <h2>🧪 TESTE: Código de Barras com vue-barcode-reader</h2>
      <p style="color: #888; font-size: 0.9em;">Compare com o QuaggaJS acima</p>
    </div>

    <div class="card test-card">
      <BarcodeReaderVue />
    </div>

    <div class="card">
      <h2>📋 Informações</h2>
      <div style="text-align: left; max-width: 600px; margin: 0 auto;">
        <h3 style="margin-top: 1rem;">📱 QR Code:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>Área de leitura <strong>quadrada</strong></li>
          <li>Ideal para QR Codes, PIX, links</li>
          <li>Posicione o QR Code no centro do quadrado</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">📊 Código de Barras (QuaggaJS):</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>Área de leitura <strong>retangular horizontal</strong></li>
          <li><strong>Especializado APENAS em boletos bancários</strong></li>
          <li>Lê o <strong>código de barras puro</strong> (44 dígitos)</li>
          <li>Os <strong>dígitos verificadores</strong> não aparecem (normal!)</li>
          <li><strong>Validação rigorosa</strong>: Aceita APENAS 44, 47 ou 48 dígitos</li>
          <li>❌ NÃO lê códigos de produtos (EAN, UPC)</li>
          <li>✅ Detecta 3x seguidas para garantir precisão</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">💡 Dicas para Boletos:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>Use o <strong>leitor de código de barras</strong> (segundo componente)</li>
          <li>Mantenha o celular <strong>paralelo</strong> ao código</li>
          <li>Garanta <strong>boa iluminação</strong> no ambiente</li>
          <li>Alinhe o código <strong>horizontalmente</strong> dentro do retângulo verde</li>
          <li>Mantenha uma distância de <strong>10-20cm</strong> do código</li>
          <li>Aguarde alguns segundos para detecção</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">🎯 Como Usar:</h3>
        <ol style="line-height: 2; color: #aaa;">
          <li>Escolha o leitor apropriado (QR ou Código de Barras)</li>
          <li>Permita o acesso à câmera quando solicitado</li>
          <li>Posicione o código na área destacada (quadrado ou retângulo)</li>
          <li>Aguarde a detecção automática</li>
          <li>A câmera fecha automaticamente após a leitura</li>
        </ol>

        <h3 style="margin-top: 1.5rem;">⚙️ Tecnologias:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li><strong>QR Code</strong>: @teckel/vue-barcode-reader (ZXing)</li>
          <li><strong>Código de Barras #1</strong>: QuaggaJS - especializado em 1D</li>
          <li><strong>Código de Barras #2</strong>: @teckel/vue-barcode-reader (teste)</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">🧪 Comparação:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li><strong>QuaggaJS</strong>: Especializado em boletos, múltiplas detecções</li>
          <li><strong>vue-barcode-reader</strong>: Mesma lib do QR Code, usa ZXing</li>
          <li>Teste ambos e veja qual funciona melhor no seu dispositivo</li>
          <li>Ambos validam apenas códigos de 44, 47 ou 48 dígitos</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">✅ Recomendação:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>Para <strong>QR Codes</strong>: use o primeiro componente</li>
          <li>Para <strong>Boletos</strong>: teste os dois leitores e escolha o melhor</li>
          <li>QuaggaJS geralmente tem melhor performance para boletos</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QRCodeReader from './components/QRCodeReader.vue'
import BarcodeReaderQuagga from './components/BarcodeReaderQuagga.vue'
import BarcodeReaderVue from './components/BarcodeReaderVue.vue'
</script>

<style scoped>
ul, ol {
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}

.separator {
  margin: 3rem 0 2rem;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(46, 125, 50, 0.1) 100%);
  border-radius: 16px;
  border: 2px solid rgba(76, 175, 80, 0.3);
}

.separator h2 {
  margin: 0 0 0.5rem 0;
  color: #4caf50;
}

.test-card {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.05) 0%, rgba(46, 125, 50, 0.05) 100%);
  border: 2px solid rgba(76, 175, 80, 0.3);
}
</style>

