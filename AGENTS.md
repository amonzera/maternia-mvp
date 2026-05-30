# Maternia — Documentação Técnica para Agentes de IA e Desenvolvedores (AGENTS.md)

Este documento foi criado para orientar futuros agentes de inteligência artificial (como Gemini, Claude, Codex) e desenvolvedores humanos que forem dar manutenção ou expandir o projeto **Maternia**. Aqui estão detalhados a arquitetura, a identidade visual, os fluxos internos de código e as diretrizes do projeto.

---

## 🧭 1. Visão Geral do Produto

O **Maternia** é uma plataforma focada em transformar a jornada exaustiva e solitária de pais e mães de primeira viagem em ações práticas e acolhimento especializado.

### O Maternia NÃO é:
* Um e-commerce ou marketplace de produtos/carrinho de compras.
* Um blog de maternidade ou portal genérico de notícias.
* Uma rede social ou fórum de discussão.
* Um catálogo médico frio e filtrável apenas por especialidade.

### O Maternia É:
* Uma **jornada guiada orientada pela dor** (Ex: *"Bebê chorando sem parar"*, *"Dor ao amamentar"*), que acolhe o usuário, fornece orientações preventivas imediatas e o conecta diretamente ao especialista ideal.
* Um **validador de demanda de MVP**, capturando leads qualificados (lista de espera) e medindo o interesse e o comportamento do usuário localmente em memória.

---

## 📂 2. Arquitetura de Diretórios (State of the Art)

O projeto está estruturado em uma arquitetura limpa, modular e otimizada para performance, utilizando apenas tecnologias web nativas (**Vanilla Web Stack**):

```bash
maternia-landing/
├── index.html              # Landing Page de atração e conscientização
├── triagem.html            # Dashboard interativo da triagem (MVP)
├── css/
│   └── styles.css          # Design System unificado e estilos de componentes
├── js/
│   └── scripts.js          # Lógica do MVP, motor de triagem e métricas locais
├── assets/                 # Pasta dedicada de imagens e identidade visual
│   ├── logo.png            # Logotipo oficial Maternia
│   ├── hero-mother.png     # Imagem da seção Hero (Mãe e recém-nascido)
│   ├── avatar-juliana.png  # Foto realista da Dra. Juliana Silva (Pediatra)
│   ├── avatar-pediatra.png # Avatar genérico para o perfil de Pediatria
│   ├── avatar-sono.png     # Avatar de Mariana Costa (Consultora de Sono)
│   ├── avatar-amamentacao.png # Avatar de Ana Beatriz Nunes (Consultora de Amamentação)
│   ├── avatar-psicologa.png # Avatar de Dra. Carla Mendes (Psicóloga Perinatal)
│   ├── avatar-fisio.png    # Avatar da Fisioterapeuta Pélvica
│   └── content-breastfeeding.png # Imagem do artigo destacado de Amamentação
├── README.md               # Guia de introdução rápida do projeto
└── AGENTS.md               # Esta documentação detalhada para desenvolvedores e IAs
```

---

## 🎨 3. Design System e Identidade Visual

O design foi baseado no arquivo original de identidade visual (`Maternia Design - Thalita Lelis.pdf`) e ajustado para um tema exclusivamente **claro** (Light Theme), visando acolhimento, leveza e legibilidade para pais cansados.

### 🎨 Paleta de Cores (OKLCH Moderno)
* **Amora / Violeta (`var(--primary)`)**: Representa o instinto de cuidado, a intuição materna e o acolhimento emocional.
  * *Valor:* `oklch(58% .13 295)` (Gradients: `#9461cc` a `#b388eb`)
* **Azul Sereno (`var(--secondary)`)**: Representa o lado lógico, a credibilidade técnica e a segurança médica.
  * *Valor:* `oklch(94% .025 350)` (Apoio visual: `#8cb2cc`)
* **Bege Pele / Areia (`var(--background)`)**: Traz conforto tátil, calor humano e afasta a sensação fria de "aplicativo de hospital".
  * *Valor:* `oklch(98.5% .012 80)` (Warm cream)
* **Branco Suave (`var(--card)`)**: Usado em superfícies de cartões e modais, garantindo contraste sem agredir os olhos.
  * *Valor:* `oklch(100% 0 0)` (Pure white)

### ✍️ Tipografia
* **Logotipo**: `Comfortaa` (ultra-arredondada, amigável e moderna).
* **Títulos e Headings (`h1`, `h2`, `h3`, `h4`)**: `Quicksand` (fonte geométrica arredondada de alta legibilidade, com apelo afetivo).
* **Parágrafos e Ações**: `Nunito` (fonte sem-serifa clássica para textos longos e botões).
* *Carregamento via Google Fonts no topo de `css/styles.css`.*

---

## 🧠 4. Mecânicas Técnicas do MVP

A inteligência da aplicação está concentrada no arquivo [scripts.js](file:///home/sinder/Desktop/sebrae/jovem%20win/maternia/mvp/extracted/maternia-landing/js/scripts.js), que gerencia as interações de UI, o motor de perguntas e o registro de dados analíticos.

### A. O Motor de Triagem
Ao clicar em um card de problema (seja na Landing Page ou diretamente no Dashboard de Triagem), o motor lê o objeto de dados `FLUXOS` e executa um questionário passo a passo dinâmico.

* **Estados do Fluxo**:
  * `fluxoAtual`: Guarda o objeto do problema em andamento (Ex: `FLUXOS.febre`).
  * `perguntaAtual`: Índice da pergunta (0 a N).
  * `respostas`: Objeto que armazena os inputs do usuário.
* **Navegação**: O botão **"Voltar"** regride uma pergunta ou oculta a seção de triagem caso o usuário esteja na primeira pergunta, retornando-o com segurança à grade de problemas.
* **Resultado**: Exibe orientações preventivas divididas em três blocos:
  1. *Orientação geral* (ações de bem-estar).
  2. *Observe com atenção* (sinais de monitoramento).
  3. *Procure ajuda imediata se* (sinais de alerta vermelho).
  4. *Aviso legal*: *"Esta orientação não substitui consulta médica."*

### B. Integração e Match de Especialistas
Ao final do questionário de triagem, o motor identifica o especialista recomendado (ex: `pediatra`, `consultora-sono`) e renderiza um perfil detalhado com:
* Nome e foto humanizada.
* Registro profissional ativo (CRM, CRP ou IBCLC).
* Estatísticas de avaliação (Mockadas: 4.9+ baseadas em 1.200+ atendimentos).
* Tags de subespecialidades que atendem à dor do usuário.

### C. Modal e Captura de Leads
Quando o usuário clica em **"Quero falar com esta especialista"**, o modal de captura é aberto.
* O JavaScript injeta automaticamente no formulário o **Especialista Recomendado** e o **Problema Triado** em campos ocultos (`<input type="hidden">`).
* Realiza validação nativa de formulário antes do envio.
* Ao enviar, o lead é armazenado localmente em um array global `window.LEADS` e exibe uma tela de sucesso amigável.

---

## 📊 5. Sistema de Métricas Locais (Analytics)

Para validação do MVP sem custos de infraestrutura ou preocupações iniciais com LGPD de terceiros, o projeto implementa um sistema de analytics totalmente **em memória (in-memory)**.

### Eventos Rastreados
O método `registrarEvento(tipo, dados)` é invocado automaticamente nos seguintes gatilhos:

| Evento | Gatilho | Dados Coletados |
|--------|---------|-----------------|
| `problema_selecionado` | Clique em um card de problema | `problema` (slug) |
| `fluxo_completado` | Exibição das orientações finais | `problema` (slug) |
| `especialista_visualizado` | Exibição do card da especialista | `especialista` (slug), `problema` |
| `formulario_aberto` | Abertura do modal de cadastro | `especialista` (slug), `problema` |
| `formulario_enviado` | Envio de formulário com sucesso | `problema`, `especialista` |

### Como inspecionar e extrair dados
Para extrair relatórios de funil de conversão e intenção de contratação, abra o console do desenvolvedor (`F12` no navegador) e execute:

```javascript
// Exibe a tabela de contadores agregados
console.table(METRICAS.contadores);

// Exibe a lista completa de eventos cronológicos com timestamp
console.log(METRICAS.eventos);

// Exibe a lista de leads capturados (Nome, E-mail, WhatsApp, Problema, Especialista)
console.log(window.LEADS);
```

---

## 🛠️ 6. Diretrizes de Desenvolvimento para Agentes

Ao modificar este projeto, siga rigorosamente as regras abaixo:

1. **Apenas Vanilla Web Stack**: Nunca instale bibliotecas como React, Vue, jQuery ou TailwindCSS. O design system moderno em CSS puro atende a 100% dos requisitos com arquivos leves e rápidos.
2. **Tema Claro Estrito**: Não implemente inversões automáticas para modo escuro escuro na landing page ou triagem. O layout deve respeitar o Bege Areia e o Branco Suave.
3. **Imagens Locais e Relativas**: Todas as imagens devem residir em `assets/` e ser referenciadas com caminhos relativos (ex: `assets/avatar-juliana.png`). Nunca utilize caminhos absolutos ou links externos instáveis.
4. **Sem placeholders**: Sempre gere ou utilize as fotos realistas de `assets/` para rostos de profissionais e seções principais.
5. **Navegação por Teclado e Acessibilidade (a11y)**:
   * Mantenha o foco visível (`focus-visible`) nos botões e inputs.
   * Feche modais com a tecla `Escape` e cliques fora da área de conteúdo.
   * Certifique-se de alternar atributos `aria-expanded` (true/false) e `aria-hidden` (true/false) no menu mobile e no modal.
