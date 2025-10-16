# Leitor de QR Code e Código de Barras

Projeto de demonstração para leitura de QR Code e códigos de barras usando Vue.js 3 + TypeScript e a biblioteca `@teckel/vue-barcode-reader`.

## 🚀 Características

- ✅ **Dois componentes especializados**: QR Code e Código de Barras
- ✅ **QR Code**: Usa @teckel/vue-barcode-reader (ZXing engine)
- ✅ **Código de Barras**: Usa QuaggaJS (especializado em 1D barcodes)
- ✅ Fluxo de leitura similar ao de pagamento (inicia, escaneia, fecha câmera)
- ✅ Leitura em tempo real via câmera (webcam/celular)
- ✅ Câmera fecha automaticamente após detectar o código
- ✅ Suporte a múltiplos formatos (QR Code, EAN, UPC, Code 128, boletos)
- ✅ **Otimizado para boletos bancários** com QuaggaJS
- ✅ Áreas de leitura específicas (quadrada para QR, retangular para barras)
- ✅ Interface moderna e responsiva com animações
- ✅ Desenvolvido com Vue 3 + TypeScript

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

### 📱 Para QR Code:

3. Clique em "Iniciar Leitura" no componente de QR Code
4. Permita o acesso à câmera
5. Posicione o QR Code no centro do quadrado
6. A câmera fecha automaticamente após a leitura

### 📊 Para Código de Barras (incluindo boletos):

3. Clique em "Iniciar Leitura" no componente de Código de Barras
4. Permita o acesso à câmera
5. Posicione o código horizontalmente no retângulo verde
6. Mantenha distância de 10-20cm do código
7. Aguarde alguns segundos para detecção automática
8. A câmera fecha automaticamente após a leitura

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
- **@teckel/vue-barcode-reader** - Leitura de QR Code (ZXing engine)
- **QuaggaJS (@ericblade/quagga2)** - Leitura de códigos de barras 1D
- **ZXing** - Engine de decodificação para QR Code

## 🎨 Formatos Suportados

### 📱 QR Code:
- QR Code (todos os tipos)
- PIX
- Links
- Textos
- vCards

### 📊 Códigos de Barras:
- **Boletos bancários**
- EAN-13 / EAN-8 (produtos)
- UPC-A / UPC-E
- Code 128
- Code 39
- ITF (Interleaved 2 of 5)
- Codabar
- RSS-14
- E muitos outros...

## 🎯 QuaggaJS - Especialista em Códigos de Barras

O componente de código de barras usa **QuaggaJS**, uma biblioteca especializada que oferece:

- ✅ **Detecção automática** otimizada para códigos 1D
- ✅ **Localização inteligente** do código na imagem
- ✅ **Múltiplos readers** em paralelo (EAN, Code 128, UPC, etc)
- ✅ **Alta precisão** para boletos bancários
- ✅ **Validação de tamanho**: Aceita apenas códigos com tamanhos válidos
- ✅ **Performance superior** em códigos de barras lineares
- ✅ **Funciona bem** em diferentes condições de iluminação

### 📏 Tamanhos Aceitos (APENAS BOLETOS):

**✅ Aceita:**
- **44 dígitos**: Código de barras de boleto bancário ⭐ (SEM dígitos verificadores)
- **47 dígitos**: Linha digitável de boleto ⭐ (COM dígitos verificadores)
- **48 dígitos**: Linha digitável completa ⭐

**❌ NÃO aceita (para evitar leituras parciais):**
- ~~8 dígitos (EAN-8)~~ - Leitura parcial
- ~~12 dígitos (UPC-A)~~ - Leitura parcial
- ~~13 dígitos (EAN-13)~~ - Leitura parcial do boleto
- ~~14 dígitos (GTIN-14)~~ - Leitura parcial

---

### 🔢 Diferença entre Código de Barras (44) e Linha Digitável (47-48):

**Código de Barras (44 dígitos):**
```
858000000080236038525237071625219299827171
```
- Representação numérica **SEM** dígitos verificadores
- É o que o QuaggaJS normalmente detecta
- **Totalmente válido** para processar o pagamento!

**Linha Digitável (48 dígitos):**
```
85800000008 9 02360385252 0 37071625219 8 29982717149 0
            ↑             ↑             ↑               ↑
         DV1           DV2           DV3             DV4
```
- Inclui **dígitos verificadores** (DV) entre os blocos
- Os 4 dígitos extras (9, 0, 8, 0) são verificadores
- Formato usado para digitação manual

**⚠️ IMPORTANTE:** Se o sistema leu 44 dígitos, está CORRETO! Os dígitos verificadores não fazem parte do código de barras puro.

---

**Por que essa restrição?**
- Evita que o QuaggaJS leia apenas parte do código
- Garante que apenas boletos completos sejam detectados
- Elimina falsos positivos com códigos de produtos
- Detecta o mesmo código **3 vezes seguidas** para garantir consistência

Qualquer código com tamanho diferente de 44, 47 ou 48 é automaticamente ignorado.

## 💡 Dicas para Leitura de Boletos

1. **Use o leitor de código de barras** (segundo componente)
2. **Garanta boa iluminação** no ambiente
3. **Mantenha o celular paralelo** ao código de barras
4. **Distância ideal**: 10-20cm do código
5. **Alinhe horizontalmente** dentro do retângulo verde
6. **Aguarde alguns segundos** - QuaggaJS precisa de tempo para processar
7. **Estabilize o celular** - evite tremores durante a leitura
8. Se não funcionar, **tente ajustar a distância** ou melhorar a luz

## 🤔 Por que Apps Bancários Leem Melhor?

### Apps Nativos vs Web (JavaScript)

**Apps Bancários (iOS/Android):**
- 📱 Usam **ML Kit** (Google) e **Vision Framework** (Apple)
- ⚡ Código nativo compilado (Swift, Kotlin, C++)
- 🎯 Machine Learning e IA integrados
- 🔧 Controle total do hardware
- 📸 60+ FPS de processamento

**Nosso Leitor (QuaggaJS no navegador):**
- 🌐 JavaScript rodando no navegador
- 🔒 Acesso limitado pela API getUserMedia
- 📊 Algoritmos clássicos (sem IA/ML)
- 🐢 5-10 FPS de processamento
- ⚙️ Limitações do navegador

### Otimizações Aplicadas:

Para compensar, aplicamos:
- ✅ Resolução máxima (1920x1080)
- ✅ Multi-threading (usa todos os cores da CPU)
- ✅ Foco/exposição contínuos
- ✅ patchSize 'x-large' para códigos longos
- ✅ Validação rigorosa (detecta 3x seguidas)
- ✅ Apenas readers necessários (Code 128 + I2of5)

### Alternativas para Produção:

Se precisar de performance profissional:
1. **PWA com ML Kit** - Usar biblioteca nativa via bridge
2. **Capacitor/Cordova** - App híbrido com acesso nativo
3. **html5-qrcode** - Biblioteca mais moderna
4. **API nativa** - Enviar foto para backend processar

---

## 📝 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

