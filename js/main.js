/**
 * Santo Drink Bar - Scripts Gerais
 * Contém todas as funcionalidades JavaScript do site
 */

// Variáveis globais
let isNavOpen = false;
let currentSection = '';
let isScrolling = false;

// Espera que o documento esteja totalmente carregado
document.addEventListener('DOMContentLoaded', function () {
    console.log('Santo Drink Bar - Inicializando scripts');
    
    // Inicializa AOS (Animate On Scroll) com configurações otimizadas
    AOS.init({
        duration: 600, // Reduzido de 800 para 600
        easing: 'ease-out',
        once: true,
        offset: 120, // Dispara as animações mais cedo
        delay: 100, // Menor delay entre elementos
        anchorPlacement: 'top-bottom' // Ativa quando o topo do elemento atinge a parte inferior da janela
    });

    // Inicializa todos os componentes
    initNavbar();
    initScrollEffects();
    initMobileMenu();
    initModalHandlers();
    initCardapioFilters();
    initCardapioToggles();
    initCountdowns();
    
    // Verifica se estamos na página do cardápio e inicializa componentes específicos
    if (document.querySelector('.cardapio-section')) {
        initCardapioNav();
    }
    
    // Se tivermos sliders, inicialize-os
    if (document.querySelector('.swiper-container')) {
        initSwipers();
    }
    
    // Inicializa as animações GSAP
    initGSAPAnimations();
});

// Inicializa comportamentos da navbar
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Adiciona classe ativa ao item de navegação atual
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Se estiver no mesmo documento, role suavemente
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    scrollToElement(target);
                }
            }
        });
        
        // Verifica se o link corresponde à URL atual
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
    });
}

// Inicializa efeitos de rolagem
function initScrollEffects() {
    window.addEventListener('scroll', function () {
        if (isScrolling) return;
        
        isScrolling = true;
        
        // Aviso visual da rolagem
        if (document.documentElement.scrollTop > 200) {
            document.querySelector('.scroll-top').classList.add('show');
        } else {
            document.querySelector('.scroll-top').classList.remove('show');
        }
        
        // Destaca a seção atual na navegação
        highlightCurrentSection();
        
        // Verifica se a navbar precisa ser scrollada
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Permite novas verificações depois de um pequeno atraso
        setTimeout(function () {
            isScrolling = false;
        }, 100);
    });
    
    // Botão para voltar ao topo
    document.querySelector('.scroll-top').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Destaca a seção atual na navegação
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    
    let scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            if (currentSection !== sectionId) {
                currentSection = sectionId;
                updateActiveNavLink(sectionId);
            }
        }
    });
}

// Atualiza o link ativo na navegação
function updateActiveNavLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') && link.getAttribute('href').includes(sectionId)) {
            link.classList.add('active');
        }
    });
}

// Inicializa menu móvel
function initMobileMenu() {
    const menuToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (!menuToggler || !navbarCollapse) return;
    
    menuToggler.addEventListener('click', function () {
        isNavOpen = !isNavOpen;
        
        if (isNavOpen) {
            this.classList.add('active');
            navbarCollapse.classList.add('show');
            document.body.classList.add('nav-open');
        } else {
            this.classList.remove('active');
            navbarCollapse.classList.remove('show');
            document.body.classList.remove('nav-open');
        }
    });
    
    // Fecha menu ao clicar em links
    const navLinks = document.querySelectorAll('.navbar-collapse .nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            if (isNavOpen) {
                menuToggler.classList.remove('active');
                navbarCollapse.classList.remove('show');
                document.body.classList.remove('nav-open');
                isNavOpen = false;
            }
        });
    });
}

// Manipuladores de modal
function initModalHandlers() {
    // Fecha modal ao clicar fora
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Botões para abrir modal
    const modalButtons = document.querySelectorAll('[data-toggle="modal"]');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const targetModal = this.getAttribute('data-target').substring(1);
            openModal(targetModal);
        });
    });
    
    // Botões para fechar modal
    const closeButtons = document.querySelectorAll('.close-modal, .modal-close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
}

// Abre um modal
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.style.display = 'flex';
    
    setTimeout(() => {
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }, 10);
}

// Fecha um modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
    }, 300);
}

// Inicializa navegação do cardápio
function initCardapioNav() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const cardapioNav = document.querySelector('.cardapio-nav');
    
    if (!navTabs.length || !cardapioNav) return;
    
    // Destaca a primeira tab por padrão
    navTabs[0].classList.add('active');
    
    // Adiciona eventos de clique para navegação entre seções
    navTabs.forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                navTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Rola até a seção alvo com offset
                scrollToElement(targetSection, 100);
            }
        });
    });
    
    // Adiciona classe à navbar do cardápio ao rolar
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            cardapioNav.classList.add('scrolled');
        } else {
            cardapioNav.classList.remove('scrolled');
        }
    });
    
    // Destaca seção atual enquanto navega
    highlightCurrentCardapioSection();
}

// Destaca a seção atual do cardápio enquanto rola
function highlightCurrentCardapioSection() {
    const cardapioSections = document.querySelectorAll('.cardapio-section');
    const navTabs = document.querySelectorAll('.nav-tab');
    let currentTabId = '';
    
    window.addEventListener('scroll', function () {
        // Determina a posição atual
        const scrollPosition = window.scrollY + 200;
        
        // Verifica qual seção está visível
        cardapioSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = '#' + section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && 
                scrollPosition < sectionTop + sectionHeight) {
                if (currentTabId !== sectionId) {
                    currentTabId = sectionId;
                    
                    // Remove a classe ativa de todas as tabs
                    navTabs.forEach(tab => tab.classList.remove('active'));
                    
                    // Adiciona a classe ativa à tab correspondente
                    const activeTab = document.querySelector(`.nav-tab[href="${sectionId}"]`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                }
            }
        });
    });
}

// Inicializa filtros do cardápio
function initCardapioFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const filter = this.getAttribute('data-filter');
            
            // Remove classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe ativa ao botão clicado
            this.classList.add('active');
            
            // Filtra os itens
            const menuItems = document.querySelectorAll('.menu-item');
            
            menuItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else if (item.classList.contains(filter)) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Inicializa toggles do cardápio
function initCardapioToggles() {
    // Toggle de detalhes
    const detailsButtons = document.querySelectorAll('.details-btn');
    
    if (detailsButtons.length) {
        detailsButtons.forEach(button => {
            button.addEventListener('click', function () {
                const cardItem = this.closest('.menu-item, .drink-card');
                const detailsContent = cardItem.querySelector('.details-content');
                
                if (detailsContent.classList.contains('show')) {
                    detailsContent.classList.remove('show');
                    this.innerHTML = '<i class="fas fa-info-circle"></i> Detalhes';
                } else {
                    detailsContent.classList.add('show');
                    this.innerHTML = '<i class="fas fa-times-circle"></i> Fechar';
                }
            });
        });
    }
    
    // Toggle de visualização (grade/lista)
    const viewToggle = document.querySelector('.view-toggle');
    
    if (viewToggle) {
        viewToggle.addEventListener('click', function () {
            const cardapioRow = document.querySelector('#bebidas-row');
            
            if (cardapioRow.classList.contains('grid-view')) {
                cardapioRow.classList.remove('grid-view');
                this.innerHTML = '<i class="fas fa-th"></i> Ver em Grade';
            } else {
                cardapioRow.classList.add('grid-view');
                this.innerHTML = '<i class="fas fa-list"></i> Ver em Lista';
            }
        });
    }
}

// Inicializa contadores regressivos
function initCountdowns() {
    const countdownElements = document.querySelectorAll('.countdown');
    
    if (!countdownElements.length) return;
    
    countdownElements.forEach(countdown => {
        const targetDate = new Date(countdown.getAttribute('data-target-date'));
        
        // Atualiza cada segundo
        const timer = setInterval(function () {
            const now = new Date().getTime();
            const distance = targetDate - now;
            
            // Calcula dias, horas, minutos e segundos
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            // Atualiza o texto
            countdown.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            
            // Se o contador acabou
            if (distance < 0) {
                clearInterval(timer);
                countdown.innerHTML = "EXPIRADO";
            }
        }, 1000);
    });
}

// Inicializa sliders Swiper
function initSwipers() {
    // Slider de promoções
    if (document.querySelector('.promos-swiper')) {
        new Swiper('.promos-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                992: {
                    slidesPerView: 3,
                }
            }
        });
    }
    
    // Slider de depoimentos
    if (document.querySelector('.testimonials-swiper')) {
        new Swiper('.testimonials-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            }
        });
    }
}

// Função auxiliar para rolagem suave
function scrollToElement(element, offset = 0) {
    const elementPosition = element.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - offset;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Inicializa animações GSAP
function initGSAPAnimations() {
    // Verifica se o GSAP foi carregado
    if (typeof gsap === 'undefined') {
        console.warn('GSAP não encontrado. As animações avançadas não serão carregadas.');
        return;
    }
    
    // Registra o plugin ScrollTrigger se disponível
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        console.log('GSAP ScrollTrigger registrado');
    }
    
    // Animações para os cards de drink
    const drinkCards = document.querySelectorAll('.drink-card');
    if (drinkCards.length) {
        gsap.utils.toArray('.drink-card').forEach((card, i) => {
            gsap.from(card, {
                y: 50,
                opacity: 0,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom-=100",
                    toggleActions: "play none none none"
                },
                delay: i * 0.1
            });
        });
    }
    
    // Animação fluida para navegação entre seções
    const navLinks = document.querySelectorAll('.nav-tab');
    if (navLinks.length) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    
                    if (target) {
                        gsap.to(window, {
                            duration: 0.8, 
                            scrollTo: {
                                y: target,
                                offsetY: 100
                            },
                            ease: "power3.inOut"
                        });
                    }
                }
            });
        });
    }
    
    // Efeito de hover nos cards com GSAP
    const menuItems = document.querySelectorAll('.drink-card, .menu-item, .promo-card, .destaque-card');
    if (menuItems.length) {
        menuItems.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card, {
                    y: -8,
                    boxShadow: "0 15px 25px rgba(0,0,0,0.3)",
                    duration: 0.3
                });
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    y: 0,
                    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                    duration: 0.5
                });
            });
        });
    }
    
    // Animação para títulos de seção
    const sectionTitles = document.querySelectorAll('.section-title');
    if (sectionTitles.length) {
        sectionTitles.forEach(title => {
            gsap.from(title, {
                y: 30,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: title,
                    start: "top bottom-=100"
                }
            });
        });
    }
    
    // Anima badges com movimento sutil
    const badges = document.querySelectorAll('.badge, .card-badge, .promo-badge');
    if (badges.length) {
        badges.forEach(badge => {
            gsap.to(badge, {
                y: "-5px",
                duration: 1.5,
                ease: "sine.inOut",
                repeat: -1,
                yoyo: true
            });
        });
    }
    
    // Efeito parallax suave para imagens de fundo
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        gsap.to(heroSection, {
            backgroundPosition: "50% 30%",
            ease: "none",
            scrollTrigger: {
                trigger: heroSection,
                start: "top top",
                end: "bottom top",
                scrub: true
            }
        });
    }
}
