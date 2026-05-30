/**
 * Maternia — scripts.js
 * Interações, animações e lógica do MVP do site Maternia
 * Vanilla JS — sem dependências externas
 */

(function () {
  'use strict';

  /* =============================================
   * 1. MOBILE MENU
   * ============================================= */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__nav a');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    mobileMenuLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  /* =============================================
   * 2. SMOOTH SCROLL for anchor links
   * ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Show triage section if they click the CTA but it's hidden
      if (targetId === '#fluxo-guiado' && targetEl.style.display === 'none') {
        // Just scroll to #problemas instead since triage is not active yet
        const probSec = document.querySelector('#problemas');
        if (probSec) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
          window.scrollTo({
            top: probSec.getBoundingClientRect().top + window.scrollY - headerHeight - 16,
            behavior: 'smooth'
          });
        }
        return;
      }

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      history.pushState(null, '', targetId);
    });
  });

  /* =============================================
   * 3. SCROLL REVEAL — IntersectionObserver
   * ============================================= */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    animateElements.forEach(function (el) {
      // Add staggered delay based on position in parent
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(function (child) {
          return child.classList.contains('animate-on-scroll');
        });
        const siblingIndex = siblings.indexOf(el);
        if (siblingIndex > 0) {
          el.style.transitionDelay = (siblingIndex * 100) + 'ms';
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* =============================================
   * 4. HEADER SCROLL EFFECT
   * ============================================= */
  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  /* =============================================
   * 5. ACTIVE NAV TRACKING
   * ============================================= */
  const navLinks = document.querySelectorAll('.header-nav a');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length > 0 && sections.length > 0 && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* =============================================
   * 6. FAQ ACCORDION (smooth height animation)
   * ============================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (details) {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.faq-answer');

    if (!summary || !answer) return;

    summary.addEventListener('click', function (e) {
      e.preventDefault();

      // If already open, close it
      if (details.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        answer.offsetHeight; // Force reflow
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';

        answer.addEventListener('transitionend', function handler() {
          details.open = false;
          answer.removeEventListener('transitionend', handler);
        });
      } else {
        // Open it
        details.open = true;
        const height = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        answer.offsetHeight; // Force reflow
        answer.style.maxHeight = height + 'px';
        answer.style.opacity = '1';

        answer.addEventListener('transitionend', function handler() {
          answer.style.maxHeight = 'none';
          answer.removeEventListener('transitionend', handler);
        });
      }
    });
  });

  /* =============================================
   * 7. PREFERS REDUCED MOTION
   * ============================================= */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('is-visible');
      el.style.transitionDelay = '0ms';
      el.style.transitionDuration = '0ms';
    });
  }


  /* ==========================================================================
     ==========================================================================
     MVP INTERACTIVE CORE LOGIC (ETAPAS 02-05)
     ==========================================================================
     ========================================================================== */

  /* =============================================
   * 8. ESTRUTURA DE DADOS DOS FLUXOS (JSON LOCAL)
   * ============================================= */
  const FLUXOS = {
    febre: {
      titulo: "Febre",
      perguntas: [
        {
          id: "idade",
          texto: "Qual é a idade do bebê?",
          opcoes: ["Menos de 3 meses", "3 a 6 meses", "6 meses a 1 ano", "Mais de 1 ano"]
        },
        {
          id: "temperatura",
          texto: "Qual a temperatura medida?",
          opcoes: ["Abaixo de 37,5°C", "37,5°C a 38°C", "38°C a 39°C", "Acima de 39°C"]
        },
        {
          id: "duracao",
          texto: "Há quanto tempo está assim?",
          opcoes: ["Menos de 12h", "12h a 24h", "1 a 3 dias", "Mais de 3 dias"]
        },
        {
          id: "mamando",
          texto: "O bebê está mamando normalmente?",
          opcoes: ["Sim, normalmente", "Com dificuldade", "Muito pouco", "Recusando"]
        },
        {
          id: "responsivo",
          texto: "O bebê está responsivo (reagindo a estímulos)?",
          opcoes: ["Sim, bem ativo", "Um pouco sonolento", "Muito quieto", "Não está reagindo"]
        }
      ],
      resultado: {
        orientacao: "A febre é uma resposta natural do organismo. Mantenha o bebê hidratado, use roupas leves e monitore a temperatura a cada 2 horas.",
        observe: [
          "Temperatura se mantém ou sobe mesmo após medicação",
          "Bebê demonstra dificuldade para respirar",
          "Aparecimento de manchas na pele"
        ],
        alerta_imediato: [
          "Febre acima de 38°C em bebês com menos de 3 meses",
          "Bebê sem resposta a estímulos",
          "Convulsões",
          "Dificuldade intensa para respirar"
        ],
        especialista: "pediatra"
      }
    },

    sono: {
      titulo: "Sono",
      perguntas: [
        {
          id: "idade",
          texto: "Qual é a idade do bebê?",
          opcoes: ["0 a 3 meses", "3 a 6 meses", "6 meses a 1 ano", "Mais de 1 ano"]
        },
        {
          id: "despertares",
          texto: "Quantas vezes o bebê acorda por noite?",
          opcoes: ["1 a 2 vezes", "3 a 4 vezes", "5 ou mais vezes", "Não dorme mais de 1h seguida"]
        },
        {
          id: "duracao",
          texto: "Há quanto tempo está assim?",
          opcoes: ["Menos de 1 semana", "1 a 2 semanas", "Mais de 2 semanas", "Desde o nascimento"]
        }
      ],
      resultado: {
        orientacao: "O sono dos bebês varia muito por faixa etária. Criar uma rotina consistente de soninho com os mesmos horários e rituais ajuda a regular o ciclo de sono.",
        observe: [
          "Sinais de cansaço extremo (olheiras, irritabilidade intensa)",
          "Dificuldade de ganho de peso",
          "Roncos ou pausas na respiração durante o sono"
        ],
        alerta_imediato: [
          "Pausas longas na respiração durante o sono",
          "Coloração azulada nos lábios"
        ],
        especialista: "consultora-sono"
      }
    },

    amamentacao: {
      titulo: "Amamentação",
      perguntas: [
        {
          id: "dor",
          texto: "Sente dor ao amamentar?",
          opcoes: ["Não, sem dor", "Dor leve no início", "Dor intensa durante toda mamada", "Dor com fissuras ou sangramentos"]
        },
        {
          id: "pega",
          texto: "Você acredita que a pega está correta?",
          opcoes: ["Sim, parece boa", "Não tenho certeza", "Acho que está errada", "Bebê larga muito"]
        },
        {
          id: "producao",
          texto: "Como está a produção de leite?",
          opcoes: ["Parece suficiente", "Acho que é pouco", "Muito leite (ingurgitamento)", "Leite secou"]
        }
      ],
      resultado: {
        orientacao: "A amamentação é uma habilidade que mãe e bebê aprendem juntos. Uma pega correta é fundamental para evitar dores e garantir boa produção de leite.",
        observe: [
          "Bebê não volta ao peso de nascimento em 2 semanas",
          "Menos de 6 fraldas molhadas por dia após o 5º dia de vida",
          "Dor persistente mesmo após ajustes na pega"
        ],
        alerta_imediato: [
          "Febre na mãe (pode indicar mastite)",
          "Vermelhidão e inchaço nas mamas",
          "Bebê recusa completamente o seio"
        ],
        especialista: "consultora-amamentacao"
      }
    },

    choro: {
      titulo: "Choro Excessivo",
      perguntas: [
        {
          id: "idade",
          texto: "Qual é a idade do bebê?",
          opcoes: ["0 a 6 semanas", "6 semanas a 3 meses", "3 a 6 meses", "Mais de 6 meses"]
        },
        {
          id: "duracao",
          texto: "Por quanto tempo o bebê chora?",
          opcoes: ["Menos de 1 hora por dia", "1 a 3 horas por dia", "Mais de 3 horas por dia", "Quase o dia todo"]
        },
        {
          id: "frequencia",
          texto: "Com qual frequência isso acontece?",
          opcoes: ["Alguns dias na semana", "Todos os dias", "Sempre no mesmo horário", "Sem padrão definido"]
        }
      ],
      resultado: {
        orientacao: "Choro é a principal forma de comunicação do bebê. Às 6 semanas o choro costuma atingir o pico — isso é normal. Verifique as necessidades básicas: fome, sono, fralda, temperatura e necessidade de colo.",
        observe: [
          "Choro diferente do habitual (agudo, inconsolável)",
          "Recusa alimentar junto com o choro",
          "Bebê dobra as pernas em direção à barriga"
        ],
        alerta_imediato: [
          "Choro após queda ou trauma",
          "Febre junto com o choro",
          "Bebê não responde ao colo ou a nenhum conforto por mais de 2h"
        ],
        especialista: "pediatra"
      }
    },

    colica: {
      titulo: "Cólica",
      perguntas: [
        {
          id: "idade",
          texto: "Qual é a idade do bebê?",
          opcoes: ["Menos de 3 semanas", "3 semanas a 3 meses", "3 a 6 meses", "Mais de 6 meses"]
        },
        {
          id: "frequencia",
          texto: "Com qual frequência as crises acontecem?",
          opcoes: ["Raramente", "Alguns dias na semana", "Todo dia", "Várias vezes ao dia"]
        }
      ],
      resultado: {
        orientacao: "Cólicas são comuns nos primeiros meses e costumam melhorar por volta dos 3 meses. Massagem abdominal no sentido horário, posição de barriga para baixo no seu colo (sempre supervisionado) e movimentos rítmicos podem ajudar.",
        observe: [
          "Barriga muito dura e distendida",
          "Ausência de evacuação por mais de 3 dias",
          "Bebê com menos de 3 semanas com choro intenso"
        ],
        alerta_imediato: [
          "Sangue nas fezes",
          "Vômitos intensos junto com a cólica",
          "Bebê para de ganhar peso"
        ],
        especialista: "pediatra"
      }
    },

    puerperio: {
      titulo: "Puerpério",
      perguntas: [
        {
          id: "ansiedade",
          texto: "Como você descreveria seu nível de ansiedade?",
          opcoes: ["Leve, consigo lidar", "Moderado, me preocupa", "Alto, interfere no meu dia a dia", "Muito alto, estou com medo"]
        },
        {
          id: "exaustao",
          texto: "Como está seu nível de exaustão?",
          opcoes: ["Cansada, mas bem", "Muito cansada", "Exausta, mal consigo funcionar", "Não consigo dormir mesmo quando o bebê dorme"]
        },
        {
          id: "apoio",
          texto: "Você sente que tem apoio suficiente?",
          opcoes: ["Sim, tenho bom suporte", "Mais ou menos", "Sinto-me sozinha", "Não tenho ninguém para ajudar"]
        }
      ],
      resultado: {
        orientacao: "O puerpério é um período de intensa transformação física e emocional. O que você está sentindo é real e válido. Pedir ajuda é sinal de força, não de fraqueza.",
        observe: [
          "Sentimentos persistentes de tristeza por mais de 2 semanas",
          "Dificuldade em criar vínculo com o bebê",
          "Pensamentos que te assustam"
        ],
        alerta_imediato: [
          "Pensamentos de se machucar ou machucar o bebê",
          "Incapacidade de cuidar de si mesma ou do bebê",
          "Alucinações ou pensamentos muito confusos"
        ],
        especialista: "psicologa-perinatal"
      }
    }
  };

  /* =============================================
   * 9. DADOS MOCKADOS DOS ESPECIALISTAS
   * ============================================= */
  const ESPECIALISTAS = {
    pediatra: {
      nome: "Dra. Ana Lima",
      especialidade: "Pediatra",
      crm: "CRM/SP 123456",
      descricao: "Especialista em desenvolvimento infantil e primeiros cuidados com recém-nascidos. Atende casos de febre, cólicas, choro excessivo e saúde geral do bebê.",
      problemas: ["febre", "choro", "colica", "saúde geral"],
      avatar: "assets/avatar-pediatra.png",
      avaliacao: "4.9",
      atendimentos: "1.200+"
    },

    "consultora-amamentacao": {
      nome: "Ana Beatriz Nunes",
      especialidade: "Consultora de Amamentação (IBCLC)",
      registro: "IBCLC #45678",
      descricao: "Consultora certificada internacionalmente. Especialista em dor ao amamentar, dificuldades de pega e baixa produção de leite.",
      problemas: ["dor ao amamentar", "pega incorreta", "baixa produção de leite"],
      avatar: "assets/avatar-amamentacao.png",
      avaliacao: "5.0",
      atendimentos: "850+"
    },

    "consultora-sono": {
      nome: "Mariana Costa",
      especialidade: "Consultora de Sono Infantil",
      descricao: "Especialista em rotinas de sono para bebês de 0 a 5 anos. Ajuda famílias a estabelecerem rotinas saudáveis e a reduzir despertares noturnos.",
      problemas: ["rotina de sono", "despertares frequentes", "dificuldades para dormir"],
      avatar: "assets/avatar-sono.png",
      avaliacao: "4.8",
      atendimentos: "620+"
    },

    "psicologa-perinatal": {
      nome: "Dra. Carla Mendes",
      especialidade: "Psicóloga Perinatal",
      crp: "CRP/RJ 98765",
      descricao: "Especialista em saúde mental no período perinatal. Atende questões de ansiedade, exaustão, depressão pós-parto e adaptação à maternidade/paternidade.",
      problemas: ["ansiedade", "exaustão", "puerpério", "depressão pós-parto"],
      avatar: "assets/avatar-psicologa.png",
      avaliacao: "4.9",
      atendimentos: "430+"
    }
  };

  /* =============================================
   * 10. SISTEMA DE MÉTRICAS LOCAL
   * ============================================= */
  const METRICAS = {
    eventos: [],
    contadores: {
      problema_selecionado: {},
      fluxo_completado: {},
      especialista_visualizado: {},
      formulario_aberto: 0,
      formulario_enviado: 0
    }
  };

  // Expose metrics globally for debugging in browser console
  window.METRICAS = METRICAS;

  function registrarEvento(tipo, dados = {}) {
    const evento = {
      tipo: tipo,
      timestamp: new Date().toISOString(),
      dados: dados
    };
    METRICAS.eventos.push(evento);

    // Update counters
    if (tipo === 'problema_selecionado' && dados.problema) {
      METRICAS.contadores.problema_selecionado[dados.problema] =
        (METRICAS.contadores.problema_selecionado[dados.problema] || 0) + 1;
    }
    if (tipo === 'fluxo_completado' && dados.problema) {
      METRICAS.contadores.fluxo_completado[dados.problema] =
        (METRICAS.contadores.fluxo_completado[dados.problema] || 0) + 1;
    }
    if (tipo === 'especialista_visualizado' && dados.especialista) {
      METRICAS.contadores.especialista_visualizado[dados.especialista] =
        (METRICAS.contadores.especialista_visualizado[dados.especialista] || 0) + 1;
    }
    if (tipo === 'formulario_aberto') METRICAS.contadores.formulario_aberto++;
    if (tipo === 'formulario_enviado') METRICAS.contadores.formulario_enviado++;

    console.log('[Maternia Analytics Event]', evento);
  }

  /* =============================================
   * 11. MOTOR DO QUESTIONÁRIO (TRIAGEM)
   * ============================================= */
  let fluxoAtual = null;
  let perguntaAtual = 0;
  let respostas = {};
  let slugProblemaAtual = null;

  function iniciarFluxo(problema) {
    fluxoAtual = FLUXOS[problema];
    slugProblemaAtual = problema;
    perguntaAtual = 0;
    respostas = {};

    window.problemaAtual = fluxoAtual.titulo;

    const triageSection = document.getElementById('fluxo-guiado');
    triageSection.style.display = 'block';
    triageSection.scrollIntoView({ behavior: 'smooth' });

    registrarEvento('problema_selecionado', { problema: problema });
    renderizarPergunta();
  }

  function renderizarPergunta() {
    const pergunta = fluxoAtual.perguntas[perguntaAtual];
    const total = fluxoAtual.perguntas.length;
    const container = document.getElementById('fluxo-container');

    container.innerHTML = `
      <div class="fluxo-header">
        <button class="btn-voltar">← Voltar</button>
        <span class="fluxo-progresso">Pergunta ${perguntaAtual + 1} de ${total}</span>
      </div>
      <div class="fluxo-barra-progresso">
        <div class="fluxo-barra-fill" style="width: ${((perguntaAtual) / total) * 100}%"></div>
      </div>
      <h3 class="fluxo-pergunta">${pergunta.texto}</h3>
      <div class="fluxo-opcoes">
        ${pergunta.opcoes.map((op, i) => `
          <button class="fluxo-opcao" data-id="${pergunta.id}" data-opcao="${op}">
            ${op}
          </button>
        `).join('')}
      </div>
    `;

    // Bind events
    container.querySelector('.btn-voltar').addEventListener('click', voltarPergunta);
    container.querySelectorAll('.fluxo-opcao').forEach(btn => {
      btn.addEventListener('click', function () {
        responder(this.dataset.id, this.dataset.opcao);
      });
    });
  }

  function responder(idPergunta, valor) {
    respostas[idPergunta] = valor;
    if (perguntaAtual < fluxoAtual.perguntas.length - 1) {
      perguntaAtual++;
      renderizarPergunta();
    } else {
      renderizarResultado();
    }
  }

  function voltarPergunta() {
    if (perguntaAtual > 0) {
      perguntaAtual--;
      renderizarPergunta();
    } else {
      document.getElementById('fluxo-guiado').style.display = 'none';
      document.getElementById('problemas').scrollIntoView({ behavior: 'smooth' });
    }
  }

  function renderizarResultado() {
    const r = fluxoAtual.resultado;
    const container = document.getElementById('fluxo-container');

    container.innerHTML = `
      <div class="resultado">
        <h3 class="resultado-titulo">Orientação para: ${fluxoAtual.titulo}</h3>

        <div class="resultado-bloco resultado-orientacao">
          <h4>📋 Orientação</h4>
          <p>${r.orientacao}</p>
        </div>

        <div class="resultado-bloco resultado-observe">
          <h4>👀 Observe com atenção</h4>
          <ul>${r.observe.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>

        <div class="resultado-bloco resultado-alerta">
          <h4>🚨 Procure atendimento imediatamente se</h4>
          <ul>${r.alerta_imediato.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>

        <div class="resultado-especialista-preview">
          <p>Precisa de ajuda especializada?</p>
          <button class="btn-primary btn-ver-especialista" data-especialista="${r.especialista}">
            Encontrar especialista
          </button>
        </div>

        <p class="resultado-disclaimer">
          ⚕️ Esta orientação não substitui consulta médica.
          Em caso de dúvida, procure um profissional de saúde.
        </p>
      </div>
    `;

    // Save global state
    window.especialistaRecomendado = r.especialista;

    // Bind event
    container.querySelector('.btn-ver-especialista').addEventListener('click', function () {
      mostrarEspecialista(this.dataset.especialista);
    });

    registrarEvento('fluxo_completado', { problema: slugProblemaAtual });
  }

  /* =============================================
   * 12. ENCAMINHAMENTO PROFISSIONAL
   * ============================================= */
  function mostrarEspecialista(slug) {
    const esp = ESPECIALISTAS[slug];
    if (!esp) return;

    // Generate avatar initials fallback
    const iniciais = esp.nome.split(' ').slice(0, 2).map(n => n[0]).join('');

    const container = document.getElementById('fluxo-container');
    container.innerHTML = `
      <div class="especialista-card">
        <div class="especialista-header">
          <div class="especialista-avatar" aria-label="Avatar de ${esp.nome}">
            ${esp.avatar
              ? `<img src="${esp.avatar}" alt="${esp.nome}" width="80" height="80" loading="lazy">`
              : `<span class="especialista-iniciais">${iniciais}</span>`
            }
          </div>
          <div class="especialista-info">
            <h3 class="especialista-nome">${esp.nome}</h3>
            <p class="especialista-especialidade">${esp.especialidade}</p>
            ${esp.crm ? `<p class="especialista-registro">${esp.crm}</p>` : ''}
            ${esp.registro ? `<p class="especialista-registro">${esp.registro}</p>` : ''}
            ${esp.crp ? `<p class="especialista-registro">${esp.crp}</p>` : ''}
            <div class="especialista-stats">
              <span>⭐ ${esp.avaliacao}</span>
              <span>👩‍👧 ${esp.atendimentos} atendimentos</span>
            </div>
          </div>
        </div>

        <p class="especialista-descricao">${esp.descricao}</p>

        <div class="especialista-problemas">
          <span class="especialista-problemas-label">Atende:</span>
          ${esp.problemas.map(p => `<span class="tag-problema">${p}</span>`).join('')}
        </div>

        <div class="especialista-acoes">
          <button class="btn-primary btn-cta-especialista" data-especialista="${slug}">
            Quero falar com esta especialista
          </button>
          <button class="btn-secondary btn-voltar-problemas">
            Escolher outro especialista
          </button>
        </div>

        <p class="especialista-disclaimer">
          🔒 Atendimentos em breve. Ao clicar, você entra na lista de espera.
        </p>
      </div>
    `;

    // Scroll triage card into view
    document.getElementById('fluxo-guiado').scrollIntoView({ behavior: 'smooth' });

    // Bind actions
    container.querySelector('.btn-cta-especialista').addEventListener('click', function () {
      abrirFormularioInteresse(this.dataset.especialista);
    });
    container.querySelector('.btn-voltar-problemas').addEventListener('click', voltarParaProblemas);

    // Track visual view
    registrarEvento('especialista_visualizado', { especialista: slug });
  }

  function voltarParaProblemas() {
    document.getElementById('fluxo-guiado').style.display = 'none';
    const problemsSection = document.getElementById('problemas');
    problemsSection.scrollIntoView({ behavior: 'smooth' });
  }

  function renderizarGridEspecialistas() {
    const grid = document.querySelector('.especialistas-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear

    Object.entries(ESPECIALISTAS).forEach(([slug, esp]) => {
      const iniciais = esp.nome.split(' ').slice(0, 2).map(n => n[0]).join('');
      const card = document.createElement('div');
      card.className = 'especialista-mini-card animate-on-scroll hover-lift';
      card.innerHTML = `
        <div class="especialista-mini-avatar">${iniciais}</div>
        <h4>${esp.nome}</h4>
        <p class="especialista-mini-esp">${esp.especialidade}</p>
        <p class="especialista-mini-desc">${esp.descricao.substring(0, 95)}...</p>
        <button class="btn-secondary btn-ver-perfil-mini" data-especialista="${slug}">Ver perfil</button>
      `;

      card.querySelector('.btn-ver-perfil-mini').addEventListener('click', function () {
        // Show in the guided flow box
        const triageSection = document.getElementById('fluxo-guiado');
        triageSection.style.display = 'block';
        mostrarEspecialista(this.dataset.especialista);
      });

      grid.appendChild(card);
    });
  }

  /* =============================================
   * 13. MODAL DE FORMULÁRIO DE INTERESSE
   * ============================================= */
  window.LEADS = []; // Local Leads DB

  function abrirFormularioInteresse(slugEspecialista) {
    registrarEvento('formulario_aberto', {
      especialista: slugEspecialista,
      problema: window.problemaAtual || 'Navegação Orgânica'
    });

    const esp = ESPECIALISTAS[slugEspecialista];
    const modal = document.getElementById('modal-interesse');
    const modalContent = document.getElementById('modal-conteudo');

    modalContent.innerHTML = `
      <div class="modal-header">
        <h3 id="modal-titulo">Entrar na lista de espera</h3>
        <button class="modal-fechar" aria-label="Fechar">✕</button>
      </div>

      <p class="modal-subtitulo">
        Você será notificado(a) assim que os atendimentos com
        <strong>${esp.nome}</strong> estiverem disponíveis.
      </p>

      <form id="form-interesse" novalidate>
        <!-- Campos visíveis -->
        <div class="campo-grupo">
          <label for="campo-nome">Seu nome</label>
          <input type="text" id="campo-nome" name="nome"
                 placeholder="Como você gostaria de ser chamado(a)?"
                 required autocomplete="given-name">
        </div>

        <div class="campo-grupo">
          <label for="campo-email">E-mail</label>
          <input type="email" id="campo-email" name="email"
                 placeholder="seu@email.com"
                 required autocomplete="email">
        </div>

        <div class="campo-grupo">
          <label for="campo-whatsapp">WhatsApp <span class="campo-opcional">(opcional)</span></label>
          <input type="tel" id="campo-whatsapp" name="whatsapp"
                 placeholder="(11) 99999-9999"
                 autocomplete="tel">
        </div>

        <!-- Campos ocultos (preenchidos automaticamente) -->
        <input type="hidden" id="campo-problema" name="problema"
               value="${window.problemaAtual || 'Navegação Orgânica'}">
        <input type="hidden" id="campo-especialista" name="especialista"
               value="${esp.nome} — ${esp.especialidade}">

        <button type="submit" class="btn-primary btn-form-submit">
          Entrar na lista de espera
        </button>

        <p class="modal-privacidade">
          🔒 Seus dados são usados apenas para entrar em contato. Sem spam.
        </p>
      </form>
    `;

    // Bind event handlers
    modalContent.querySelector('.modal-fechar').addEventListener('click', fecharModal);
    modalContent.querySelector('#form-interesse').addEventListener('submit', enviarFormulario);

    modal.style.display = 'flex';
    modal.setAttribute('aria-hidden', 'false');
    document.getElementById('campo-nome').focus();
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  function enviarFormulario(event) {
    event.preventDefault();
    const form = event.target;

    // Reset error span elements
    form.querySelectorAll('.campo-erro').forEach(el => el.remove());

    const nomeInput = form.nome;
    const emailInput = form.email;
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    let valid = true;

    if (!nome) {
      mostrarErroFormulario('campo-nome', 'Por favor, informe seu nome.');
      valid = false;
    }
    if (!email) {
      mostrarErroFormulario('campo-email', 'Por favor, informe seu e-mail.');
      valid = false;
    } else if (!emailRegex.test(email)) {
      mostrarErroFormulario('campo-email', 'Por favor, informe um e-mail válido.');
      valid = false;
    }

    if (!valid) return;

    // Save lead data in memory
    const lead = {
      nome: nome,
      email: email,
      whatsapp: form.whatsapp?.value?.trim() || '',
      problema: form.problema.value,
      especialista: form.especialista.value,
      timestamp: new Date().toISOString()
    };

    window.LEADS.push(lead);

    // Send Conversion Event
    registrarEvento('formulario_enviado', {
      problema: lead.problema,
      especialista: lead.especialista
    });

    // Render success dialog inside the modal
    const modalContent = document.getElementById('modal-conteudo');
    modalContent.innerHTML = `
      <div class="modal-sucesso">
        <div class="modal-sucesso-icone" aria-hidden="true">✅</div>
        <h3>Você está na lista!</h3>
        <p>
          Obrigado, <strong>${nome}</strong>!<br>
          Entraremos em contato assim que as consultas com esta especialista estiverem ativas.
        </p>
        <button class="btn-primary btn-sucesso-fechar">
          Voltar ao início
        </button>
      </div>
    `;

    modalContent.querySelector('.btn-sucesso-fechar').addEventListener('click', function () {
      fecharModal();
      voltarParaProblemas();
    });

    console.log('[Maternia Saved Lead List]', window.LEADS);
  }

  function mostrarErroFormulario(idCampo, mensagem) {
    const campo = document.getElementById(idCampo);
    if (!campo) return;

    const erro = document.createElement('span');
    erro.className = 'campo-erro';
    erro.textContent = mensagem;
    erro.setAttribute('role', 'alert');
    campo.parentElement.appendChild(erro);
    campo.focus();
  }

  function fecharModal() {
    const modal = document.getElementById('modal-interesse');
    if (modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function fecharModalCliqueFora(event) {
    if (event.target.id === 'modal-interesse') {
      fecharModal();
    }
  }

  // Bind close modal events globally
  window.fecharModal = fecharModal;
  window.fecharModalCliqueFora = fecharModalCliqueFora;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fecharModal();
    }
  });

  /* =============================================
   * 14. INICIALIZAÇÃO DOS EVENTOS DO MVP
   * ============================================= */
  document.addEventListener('DOMContentLoaded', function () {
    // Generate Specialists Organic Grid
    renderizarGridEspecialistas();

    // Bind Problem card click events
    const cards = document.querySelectorAll('.problema-card');
    cards.forEach(card => {
      card.addEventListener('click', function () {
        iniciarFluxo(this.dataset.problema);
      });

      // Accessible keyboards
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          iniciarFluxo(this.dataset.problema);
        }
      });
    });

    // Check if there is a problem parameter in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlProblema = urlParams.get('problema');
    if (urlProblema && FLUXOS[urlProblema]) {
      // Delay slightly to ensure layout is ready and scroll reveal has set up
      setTimeout(function () {
        iniciarFluxo(urlProblema);
      }, 150);
    }
  });

})();
