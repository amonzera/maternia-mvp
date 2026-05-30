# Maternia — Landing Page

> **Slogan:** *Porque o manual do bebê é ter com quem contar.*

Esta é a landing page oficial do **Maternia**, uma plataforma desenvolvida para conectar mães e pais de primeira viagem a profissionais especializados e humanizados de saúde e apoio materno-infantil. 

Este projeto foi recriado do zero utilizando tecnologias web puras, visando máxima performance, acessibilidade e facilidade de manutenção para colocação em produção.

---

## 🎨 Identidade Visual e Design System

O design e as cores foram implementados estritamente em conformidade com as diretrizes do guia de design do projeto (`Maternia Design - Thalita Lelis.pdf`):

### 🎨 Paleta de Cores (OKLCH Moderno)
* **Amora/Roxo Principal (`#9461cc`)**: Representa o instinto de cuidado e acolhimento emocional, reduzindo a sensação de pânico na madrugada.
* **Azul Sereno (`#8cb2cc`)**: Lado racional e credibilidade médica. Transmite serenidade e segurança.
* **Bege Pele (`#f0e9df`)**: Aquece o visual frios do azul/roxo, trazendo conforto tátil e evitando um visual de "software de hospital".
* **Branco Suave (`#fdfcfa`)**: Respiração e limpeza visual, otimizado para não fatigar olhos cansados de pais exaustos.

### ✍️ Tipografia
* **`Quicksand`**: Fonte geométrica arredondada e acolhedora usada em todos os títulos e destaques.
* **`Nunito`**: Fonte sem-serifa de alta legibilidade usada para textos de apoio, parágrafos e botões.
* **`Comfortaa`**: Fonte ultra-arredondada e minimalista aplicada estritamente no logotipo.

---

## ⚡ Tecnologias Utilizadas

Para garantir a melhor experiência do usuário e tempo de carregamento instantâneo, o projeto foi construído **sem frameworks ou dependências externas**:

* **HTML5 Semântico**: Tags estruturadas corretamente para SEO e acessibilidade (`<header>`, `<main>`, `<section>`, `<article>`, `<details>`, `<footer>`).
* **CSS3 Vanilla**:
  * Utilização de **CSS Custom Properties (Variáveis)** para gerenciar todo o design system.
  * Estruturação de layouts usando **CSS Grid** e **Flexbox** modernos.
  * **Animações nativas via CSS** (`@keyframes`) para transições suaves.
* **JavaScript Moderno (ES6+)**:
  * Implementação de scroll reveal inteligente usando a API nativa **`IntersectionObserver`** (melhor performance que eventos de scroll comuns).
  * Controle de estados de acessibilidade (`aria-expanded`, `aria-hidden`) no menu móvel.
  * Animação nativa de altura para o accordion de FAQ.

---

## 📂 Estrutura de Diretórios

```bash
maternia-landing/
├── index.html                  # Estrutura HTML da página principal
├── styles.css                  # Folha de estilos vanilla (Design System e Componentes)
├── scripts.js                  # Lógica de interações e efeitos dinâmicos
├── README.md                   # Documentação do projeto
├── logo-BF-DMk6K.png          # Logotipo Maternia
├── hero-mother-DWsmiunB.jpg    # Imagem principal (Mãe e Bebê)
├── pro-pediatra-wfWht7IY.jpg   # Foto da pediatra Dra. Juliana Silva
├── pro-consultora-CJWwyPrz.jpg # Foto da consultora de sono Carla Mendes
├── pro-fisio-B5DRmI3E.jpg      # Foto da fisioterapeuta pélvica Mariana Costa
└── content-breastfeeding-B3lW8DEk.jpg # Imagem do artigo em destaque
```

---

## 🚀 Como Executar Localmente

Como o projeto é construído apenas com arquivos estáticos puros, não requer build ou instalação de pacotes pesados (`node_modules`).

### Método 1: Python (Recomendado)
Se você tiver o Python instalado, basta rodar o servidor HTTP nativo dentro da pasta do projeto:
```bash
python3 -m http.server 8000
```
Depois, abra seu navegador em: **`http://localhost:8000`**

### Método 2: Extensão de Preview
Se você utiliza o VS Code, pode usar a extensão **Live Server** para rodar o projeto com recarregamento automático ao salvar alterações.

---

## ♿ Acessibilidade e Performance
* **Acessibilidade (a11y)**:
  * Suporte a navegação por teclado (`focus-visible` customizado para todos os elementos interativos).
  * Links de "pular para o conteúdo" (`.skip-to-content`).
  * Desativação automática de transições pesadas caso o usuário tenha ativado a preferência de redução de movimentos no sistema operacional (`@media (prefers-reduced-motion: reduce)`).
* **Performance (Web Vitals)**:
  * Carregamento de imagens crítico com atributo `fetchpriority="high"` e `loading="eager"`.
  * Imagens secundárias utilizando `loading="lazy"` para poupar dados e acelerar a renderização da página.
