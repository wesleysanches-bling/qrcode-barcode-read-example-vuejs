<template>
  <div>
    <h1>📱 Leitor de QR Code e Código de Barras</h1>
    
    <div class="card">
      <h2>🎥 Leitura em Tempo Real</h2>
      <p class="info-text">
        Use a câmera do seu dispositivo para escanear QR Codes e códigos de barras
      </p>
      <BarcodeReader />
    </div>

    <div class="card">
      <h2>📋 Informações</h2>
      <div style="text-align: left; max-width: 600px; margin: 0 auto;">
        <h3 style="margin-top: 1rem;">🎯 Como Funciona:</h3>
        <ol style="line-height: 2; color: #aaa;">
          <li><strong>Clique</strong> no botão "Iniciar Leitura de Código"</li>
          <li><strong>Permita</strong> o acesso à câmera quando solicitado</li>
          <li><strong>Aponte</strong> a câmera para o QR Code ou código de barras</li>
          <li>A <strong>câmera fecha automaticamente</strong> após a leitura</li>
          <li>O <strong>resultado é exibido</strong> na tela</li>
          <li>Clique em <strong>"Escanear Novo Código"</strong> para reiniciar</li>
        </ol>

        <h3 style="margin-top: 1.5rem;">📱 Formatos Suportados:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>✓ QR Code</li>
          <li>✓ EAN-13 (código de barras de produtos)</li>
          <li>✓ EAN-8</li>
          <li>✓ UPC-A / UPC-E</li>
          <li>✓ Code 128</li>
          <li>✓ Code 39</li>
          <li>✓ ITF (Interleaved 2 of 5)</li>
          <li>✓ E muitos outros...</li>
        </ul>

        <h3 style="margin-top: 1.5rem;">💡 Dicas:</h3>
        <ul style="line-height: 2; color: #aaa;">
          <li>Mantenha boa iluminação no ambiente</li>
          <li>Posicione o código a uma distância adequada</li>
          <li>Aguarde a câmera ficar pronta antes de escanear</li>
          <li>Se houver erro, tente novamente</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BarcodeReader from './components/BarcodeReader.vue'
</script>

<style scoped>
ul, ol {
  padding-left: 2rem;
}

li {
  margin: 0.5rem 0;
}
</style>

