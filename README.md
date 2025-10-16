# Leitor de QR Code e Código de Barras

Projeto de demonstração para leitura de QR Code e códigos de barras usando Vue.js 3 + TypeScript e a biblioteca `@teckel/vue-barcode-reader`.

## 🚀 Características

- ✅ Fluxo de leitura similar ao de pagamento (inicia, escaneia, fecha câmera)
- ✅ Leitura em tempo real via câmera (webcam/celular)
- ✅ Câmera fecha automaticamente após detectar o código
- ✅ Suporte a múltiplos formatos (QR Code, EAN, UPC, Code 128, etc.)
- ✅ Interface moderna e responsiva com animações
- ✅ Desenvolvido com Vue 3 + TypeScript
- ✅ Utiliza a engine ZXing para decodificação

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Instale as dependências:

```bash
npm install
```

## 🎯 Como Usar

1. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

2. Abra o navegador e acesse: `http://localhost:3000`

3. Clique no botão "📷 Iniciar Leitura de Código"

4. Permita o acesso à câmera quando solicitado

5. Aponte a câmera para um QR Code ou código de barras

6. A câmera fecha automaticamente após a leitura

7. O resultado é exibido na tela

8. Clique em "🔄 Escanear Novo Código" para reiniciar o processo

## 📱 Uso em Dispositivos Móveis

Para testar em dispositivos móveis na mesma rede:

1. Execute `npm run dev`
2. Observe o IP exibido no terminal (ex: `http://192.168.0.100:3000`)
3. Acesse esse endereço no navegador do celular
4. Permita o acesso à câmera

## 🛠️ Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a versão de produção
- `npm run preview` - Visualiza a versão de produção localmente

## 📦 Tecnologias Utilizadas

- **Vue.js 3** - Framework JavaScript progressivo
- **TypeScript** - Superset tipado do JavaScript
- **Vite** - Build tool e dev server
- **@teckel/vue-barcode-reader** - Biblioteca para leitura de códigos
- **ZXing** - Engine de decodificação

## 🎨 Formatos Suportados

- QR Code
- EAN-13 / EAN-8
- UPC-A / UPC-E
- Code 128
- Code 39
- ITF (Interleaved 2 of 5)
- Codabar
- RSS-14
- Data Matrix
- PDF417
- E muitos outros...

## 📝 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

