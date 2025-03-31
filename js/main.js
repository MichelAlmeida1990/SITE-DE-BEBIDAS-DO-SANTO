/**
 * Santo Drink Bar - Scripts Gerais
 * Versão otimizada para melhor performance
 */

// Variáveis globais
let isNavOpen = false;
let currentSection = '';
let isScrolling = false;
let slickInitialized = false;

// Espera que o documento esteja pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('Santo Drink Bar - Inicializando scripts');
    
    // Esconde o preloader quando o DOM estiver pronto
    hidePreloader();
    
    // Inicializa componentes principais
    initNavigation();
    initScrollEffects();
    initAnimations();
    initInteractiveElements();
    
    // Inicializa componentes específicos de página
    if (document.querySelector('.drink-slider')) {
        initDrinkSlider();
    }
    
    if (document.querySelector('.countdown-badge')) {
        initCountdowns();
    }
    
    if (document.querySelector('.cardapio-section')) {
        initCardapioComponents();
    }
    
    // Detecta quando as imagens estão carregadas
    trackImageLoading();
});

// Esconde o preloader
function hidePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 500);
}

// Inicializa navegação
function initNavigation() {
    // Efeito de scroll na navbar
    window.addEventListener('scroll', debounce(function() {
        if (window.scrollY > 50) {
            document.querySelector('.navbar').classList.add('scrolled');
        } else {
            document.querySelector('.navbar').classList.remove('scrolled');
        }
    }, 10));
    
    // Toggle do menu mobile
    const menuToggler = document.querySelector('.navbar-toggler');
    if (menuToggler) {
        menuToggler.addEventListener('click', function() {
            isNavOpen = !isNavOpen;
            document.body.classList.toggle('nav-open', isNavOpen);
        });
    }
    
    // Links ativos na navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add('active');
        }
        
        link.addEventListener('click', function(event) {
            // Se for link interno com hash
            if (this.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    scrollToElement(targetElement);
                }
                
                // Fecha o menu mobile se estiver aberto
                if (isNavOpen) {
                    document.querySelector('.navbar-toggler').click();
                }
            }
        });
    });
}

// Inicializa efeitos de scroll
function initScrollEffects() {
    // Botão voltar ao topo
    const scrollTopButton = document.querySelector('.scroll-top');
    if (scrollTopButton) {
        window.addEventListener('scroll', debounce(function() {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('show');
            } else {
                scrollTopButton.classList.remove('show');
            }
        }, 100));
        
        scrollTopButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Destaca seção atual durante o scroll
    window.addEventListener('scroll', debounce(function() {
        if (isScrolling) return;
        
        isScrolling = true;
        highlightCurrentSection();
        
        setTimeout(() => {
            isScrolling = false;
        }, 50);
    }, 100));
}

// Destaca a seção atual na navegação
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = '#' + section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            currentSectionId = sectionId;
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentSectionId) {
            link.classList.add('active');
        }
    });
}

// Inicializa animações
function initAnimations() {
    // Inicializa AOS (Animate On Scroll) se disponível
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
    
    // Inicializa animações para elementos com classe animate-on-scroll
    initIntersectionObserver();
}

// Inicializa observador de interseção para animações
function initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
        // Fallback para navegadores que não suportam IntersectionObserver
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            el.classList.add('animate-in');
        });
        return;
    }
    
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Inicializa elementos interativos
function initInteractiveElements() {
    // Efeito hover nos cards
    document.querySelectorAll('.destaque-card, .promo-card, .menu-item').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // Efeito ripple nos botões
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.add('btn-ripple');
        
        btn.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Inicializa formulários
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            // Previne envio para implementar validação personalizada
            // Remova esta linha quando implementar o envio real
            e.preventDefault();
            
            // Exemplo de validação simples
            let isValid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('is-invalid');
                } else {
                    field.classList.remove('is-invalid');
                }
            });
            
            if (isValid) {
                // Simulação de envio bem-sucedido
                // Substitua por código real de envio
                const submitBtn = this.querySelector('[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.innerHTML;
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
                    
                    setTimeout(() => {
                        this.reset();
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalText;
                        showToast('Mensagem enviada com sucesso!', 'success');
                    }, 1500);
                }
            }
        });
    });
}

// Inicializa slider de drinks
function initDrinkSlider() {
    // Verifica se jQuery e Slick estão disponíveis
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.slick === 'undefined') {
        console.warn('jQuery ou Slick não encontrados. O slider não será inicializado.');
        return;
    }
    
    // Verifica se o slider já foi inicializado
    if (slickInitialized) return;
    
    // Inicializa o slider quando a página estiver totalmente carregada
    window.addEventListener('load', function() {
        jQuery('.drink-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 3000,
            dots: true,
            arrows: true,
            centerMode: true,
            centerPadding: '0',
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        centerMode: false
                    }
                },
                {
                    breakpoint: 576,
                    settings: {
                        slidesToShow: 1,
                        arrows: false
                    }
                }
            ]
        });
        
        slickInitialized = true;
        console.log('Slider de drinks inicializado');
        
        // Força uma atualização do layout após o carregamento
        setTimeout(function() {
            window.dispatchEvent(new Event('resize'));
        }, 500);
    });
    
    // Monitora visibilidade do slider durante o scroll
    window.addEventListener('scroll', debounce(function() {
        checkDrinkSliderVisibility();
    }, 100));
}

// Verifica se o slider de drinks está visível
function checkDrinkSliderVisibility() {
    const drinkSlider = document.querySelector('.drink-slider');
    if (!drinkSlider) return;
    
    const rect = drinkSlider.getBoundingClientRect();
    const isVisible = (
        rect.top >= -rect.height &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) * 1.5 &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    if (isVisible && !drinkSlider.classList.contains('initialized')) {
        drinkSlider.classList.add('initialized');
        // Força uma atualização do layout do slider
        window.dispatchEvent(new Event('resize'));
    }
}

// Inicializa contadores regressivos
function initCountdowns() {
    function updateCountdown(dayOfWeek, elementId) {
        const now = new Date();
        let nextDay = new Date();
        
        // Ajusta para o próximo dia da semana (0 = domingo, 1 = segunda, ..., 6 = sábado)
        const daysUntil = (dayOfWeek - now.getDay() + 7) % 7;
        nextDay.setDate(now.getDate() + (daysUntil === 0 ? 7 : daysUntil));
        nextDay.setHours(18, 0, 0, 0); // Define para às 18h
        
        const timeRemaining = nextDay - now;
        
        // Conversão para dias, horas, minutos
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        
        // Atualiza o HTML
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = `${days}d ${hours}h ${minutes}m`;
        }
    }
    
    // Atualiza contagem regressiva a cada segundo
    const countdownElements = document.querySelectorAll('.countdown-badge');
    if (countdownElements.length > 0) {
        // Inicializa os contadores para terça e quarta
        updateCountdown(2, 'countdown-terca');    // 2 = Terça-feira
        updateCountdown(3, 'countdown-quarta');   // 3 = Quarta-feira
        
        // Atualiza a cada segundo
        setInterval(() => {
            updateCountdown(2, 'countdown-terca');
            updateCountdown(3, 'countdown-quarta');
        }, 1000);
    }
}

// Inicializa componentes do cardápio
function initCardapioComponents() {
    // Filtros do cardápio
    const filterButtons = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove classe ativa de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona classe ativa ao botão clicado
            this.classList.add('active');
            
            // Filtra os itens
            const filter = this.getAttribute('data-filter');
            
            menuItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.classList.remove('filtered-out');
                    }, 10);
                } else {
                    if (item.classList.contains(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.classList.remove('filtered-out');
                        }, 10);
                    } else {
                        item.classList.add('filtered-out');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }
            });
        });
    });
}

// Monitora o carregamento de imagens
function trackImageLoading() {
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    const totalImages = images.length;
    
    function imageLoaded() {
        loadedImages++;
        if (loadedImages === totalImages) {
            console.log('Todas as imagens foram carregadas');
            // Força uma atualização do layout
            window.dispatchEvent(new Event('resize'));
        }
    }
    
    images.forEach(img => {
        // Verifica se a imagem já está carregada
        if (img.complete) {
            imageLoaded();
        } else {
            img.addEventListener('load', imageLoaded);
            img.addEventListener('error', imageLoaded); // Conta mesmo se falhar
        }
    });
}

// Função para scroll suave até um elemento
function scrollToElement(element) {
    const navbar = document.querySelector('.navbar');
    const navbarHeight = navbar ? navbar.offsetHeight : 0;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - navbarHeight - 20;
    
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Função para mostrar toast de notificação
function showToast(message, type = 'info') {
    // Verifica se já existe um container de toast
    let toastContainer = document.querySelector('.toast-container');
    
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Cria o toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    // Adiciona o toast ao container
    toastContainer.appendChild(toast);
    
    // Mostra o toast com animação
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Adiciona evento para fechar o toast
    const closeButton = toast.querySelector('.toast-close');
    closeButton.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    });
    
    // Remove o toast automaticamente após 5 segundos
    setTimeout(() => {
        if (toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Função utilitária para debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Função para detectar suporte a recursos do navegador
function supportsFeature(feature) {
    switch (feature) {
        case 'intersectionObserver':
            return 'IntersectionObserver' in window;
        case 'webp':
            const canvas = document.createElement('canvas');
            if (canvas.getContext && canvas.getContext('2d')) {
                return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
            }
            return false;
        default:
            return false;
    }
}

// Adiciona classe ao body com base nos recursos suportados
function addFeatureDetectionClasses() {
    const body = document.body;
    
    if (supportsFeature('intersectionObserver')) {
        body.classList.add('supports-io');
    }
    
    if (supportsFeature('webp')) {
        body.classList.add('supports-webp');
    }
}

// Chama a detecção de recursos quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', addFeatureDetectionClasses);
