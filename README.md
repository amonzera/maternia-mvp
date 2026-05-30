# Maternia — Landing Page & Triagem MVP

> **Slogan:** *O manual do bebê é ter com quem contar.*

Esta é a plataforma oficial do **Maternia**, desenvolvida para conectar mães e pais de primeira viagem a profissionais especializados e humanizados de saúde e apoio materno-infantil. 

O projeto foi reestruturado de forma modular e limpa (State of the Art), utilizando exclusivamente tecnologias web nativas, visando máxima performance, acessibilidade e facilidade de manutenção.

---

## 🎨 Identidade Visual e Design System

O design e as cores foram implementados em conformidade com o guia de design do projeto (`Maternia Design - Thalita Lelis.pdf`) em um **tema claro** otimizado para legibilidade e acolhimento:

### 🎨 Paleta de Cores (OKLCH Moderno)
* **Amora/Roxo Principal (`var(--primary)`)**: Representa o instinto de cuidado e acolhimento emocional, reduzindo a sensação de pânico na madrugada (`oklch(58% .13 295)`).
* **Azul Sereno (`var(--secondary)`)**: Lado racional e credibilidade médica. Transmite serenidade e segurança (`oklch(94% .025 350)`).
* **Bege Pele / Areia (`var(--background)`)**: Aquece o visual, trazendo conforto tátil e evitando o visual hospitalar frio (`oklch(98.5% .012 80)`).
* **Branco Suave (`var(--card)`)**: Fundo dos cartões e modais, otimizado para não fatigar olhos cansados (`oklch(100% 0 0)`).

### ✍️ Tipografia
* **`Comfortaa`**: Fonte ultra-arredondada e minimalista aplicada estritamente no logotipo.
* **`Quicksand`**: Fonte geométrica arredondada e acolhedora usada para títulos e subtítulos.
* **`Nunito`**: Fonte sem-serifa de alta legibilidade usada para textos de apoio, parágrafos e botões.

---

## ⚡ Tecnologias Utilizadas

Para garantir a melhor experiência do usuário e tempo de carregamento instantâneo, o projeto foi construído **sem frameworks ou dependências externas**:

* **HTML5 Semântico**: Tags estruturadas corretamente para SEO e acessibilidade (`<header>`, `<main>`, `<section>`, `<article>`, `<details>`, `<footer>`).
* **CSS3 Vanilla**:
  * Utilização de **CSS Custom Properties (Variáveis)** para gerenciar todo o design system.
  * Estruturação de layouts responsivos usando **CSS Grid** e **Flexbox** modernos.
  * **Animações nativas via CSS** (`@keyframes`) para transições e hovers suaves.
* **JavaScript Moderno (ES6+)**:
  * Implementação de scroll reveal inteligente usando a API nativa **`IntersectionObserver`** (melhor performance que eventos de scroll).
  * Controle de estados de acessibilidade (`aria-expanded`, `aria-hidden`) no menu móvel e modais.
  * Motor de triagem dinâmico (sistema de estado estruturado para o questionário).

---

## 📂 Estrutura de Diretórios (State of the Art)

```bash
maternia-landing/
├── index.html              # Landing Page principal do aplicativo
├── triagem.html            # Dashboard especializado da triagem interativa (MVP)
├── css/
│   └── styles.css          # Design System e estilos unificados
├── js/
│   └── scripts.js          # Lógica do MVP, motor de triagem e métricas locais
├── assets/                 # Imagens realistas e humanizadas do projeto
│   ├── logo.png            # Logotipo oficial
│   ├── hero-mother.png     # Imagem principal da seção Hero
│   ├── avatar-juliana.png  # Foto realista da Dra. Juliana Silva (Pediatra)
│   ├── avatar-pediatra.png # Foto da especialista Dra. Ana Lima
│   ├── avatar-sono.png     # Foto da especialista Mariana Costa
│   ├── avatar-amamentacao.png # Foto da especialista Ana Beatriz Nunes
│   ├── avatar-psicologa.png # Foto da especialista Dra. Carla Mendes
│   ├── avatar-fisio.png    # Foto de apoio para Fisioterapia
│   └── content-breastfeeding.png # Imagem ilustrativa do artigo em destaque
├── README.md               # Guia rápido de uso
└── AGENTS.md               # Documentação técnica detalhada para agentes e devs
```

---

## ⚙️ Funcionamento das Páginas

O projeto separa claramente a experiência de marketing da experiência interativa de produto:

### 1. Landing Page (`index.html`)
Focada em apresentar a proposta de valor do Maternia, os problemas comuns que resolve, a forma de funcionamento, os especialistas em destaque, os artigos úteis e tirar dúvidas gerais (FAQ). Todos os CTAs principais direcionam para a triagem.

### 2. Triagem e Dashboard do MVP (`triagem.html`)
Página especializada onde o usuário passa pelo fluxo de triagem dinâmico. 
* Ele escolhe o sintoma/problema.
* Responde a perguntas estruturadas de triagem.
* Recebe orientações preventivas imediatas (sem fornecer diagnóstico médico).
* É apresentado ao perfil do especialista ideal para o seu caso.
* Pode se cadastrar na lista de espera caso queira atendimento personalizado.

---

## 📊 Validação de Demanda e Métricas do MVP

O MVP foi projetado para validar o interesse do usuário de forma 100% local, em memória. Não há banco de dados externo ou chamadas de API.

Você pode monitorar os cliques, fluxo de triagem e leads capturados diretamente no painel do desenvolvedor no seu navegador (pressione `F12` e clique na aba **Console**):

```javascript
// Para ver os dados agregados das interações do funil
console.table(METRICAS.contadores);

// Para ver a lista cronológica de eventos com timestamps
console.log(METRICAS.eventos);

// Para ver a lista de cadastros de interesse capturados
console.log(window.LEADS);
```

---

## 🚀 Como Executar Localmente

Por se tratar de arquivos estáticos puros, não requer compilação ou instalação de pacotes complexos.

### Método 1: Servidor HTTP Python (Recomendado)
Execute no terminal, a partir da pasta do projeto:
```bash
python3 -m http.server 8000
```
Acesse no seu navegador: **`http://localhost:8000`**

### Método 2: Extensão Live Server (VS Code)
Caso use VS Code, clique com o botão direito em `index.html` e selecione **"Open with Live Server"**.

---

## ♿ Acessibilidade e Performance
* **Acessibilidade (a11y)**:
  * Navegação completa por teclado com estilos de foco visíveis (`focus-visible`).
  * Links utilitários para acessibilidade (`.skip-to-content`).
  * Suporte a preferências de acessibilidade do SO (`@media (prefers-reduced-motion: reduce)`).
  * Controle de foco inteligente em modais e fechamento automático com a tecla `Escape`.
* **Performance**:
  * Imagem do Hero carregada de forma prioritária (`fetchpriority="high"`, `loading="eager"`).
  * Demais fotos usam `loading="lazy"` para economizar largura de banda e acelerar a exibição inicial.
