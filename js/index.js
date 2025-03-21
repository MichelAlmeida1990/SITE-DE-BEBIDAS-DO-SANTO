/**
 * Santo Drink Bar - Scripts específicos da página inicial
 * Versão otimizada para melhor performance
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Index JS carregado');
    
    // Inicializa carrossel de promoções especiais da página inicial
    initPromotionCarousel();
    
    // Inicializa carrossel de drinks autorais
    initDrinkSlider();
    
    // Inicializa contador especial da página inicial
    initSpecialCountdown();
    
    // Inicializa efeitos de destaque na página inicial
    initHomeHighlights();
    
    // Inicializa animação específica do hero da página inicial
    initHeroAnimation();
    
    // Inicializa efeitos da seção Sobre
    initSobreSection();
});

// Função debounce para otimizar eventos frequentes
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Carrossel de promoções especiais
function initPromotionCarousel() {
    const carousel = document.querySelector('.home-carousel');
    if (!carousel) return;
    
    console.log('Inicializando carrossel da página inicial');
    
    // Prioriza Swiper sobre Slick para consistência
    if (typeof Swiper !== 'undefined') {
        new Swiper('.home-carousel', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                992: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            }
        });
    } 
    // Fallback para jQuery e Slick
    else if (typeof jQuery !== 'undefined' && jQuery.fn.slick) {
        $('.home-carousel').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 5000,
            dots: true,
            arrows: true,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1
                    }
                }
            ]
        });
    }
}

// Carrossel de Drinks Autorais com interações otimizadas
function initDrinkSlider() {
    const drinkSlider = document.querySelector('.drink-slider');
    if (!drinkSlider) return;
    
    console.log('Inicializando carrossel de Drinks Autorais');
    
    // Adiciona classes para controle por CSS em vez de JS
    document.body.classList.add('has-drink-slider');
    
    // Inicialização com Slick
    if (typeof jQuery !== 'undefined' && jQuery.fn.slick) {
        $('.drink-slider').slick({
            slidesToShow: 3,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            dots: true,
            arrows: true,
            centerMode: false, // Removido centerMode para melhor performance
            speed: 500, // Reduzido para melhorar performance
            cssEase: 'ease-out', // Simplificado
            responsive: [
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2
                    }
                },
                {
                    breakpoint: 640,
                    settings: {
                        slidesToShow: 1,
                        centerMode: true,
                        centerPadding: '30px'
                    }
                }
            ],
            // Evento quando o slide muda - simplificado
            afterChange: function(event, slick, currentSlide) {
                highlightActiveSlide();
            }
        });
        
        // Configuração otimizada para interações
        setupOptimizedDrinkInteractions();
        
        // Destaque inicial do slide ativo
        setTimeout(highlightActiveSlide, 100);
    } else {
        console.warn('Slick não está disponível. O carrossel de drinks não será inicializado.');
    }
}

// Versão otimizada de interações com os drinks
function setupOptimizedDrinkInteractions() {
    // Verifica se é um dispositivo touch para evitar efeitos pesados
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Em dispositivos touch, adicionar apenas interações essenciais
    if (isTouch) {
        // Adiciona classes CSS para dispositivos touch para estilos específicos
        document.body.classList.add('touch-device');
        return;
    }
    
    // Usa delegação de eventos no container do slider
    const slider = document.querySelector('.drink-slider');
    if (!slider) return;
    
    // Delegação de eventos - Um único listener para todos os slides
    slider.addEventListener('mouseover', function(e) {
        const slide = e.target.closest('.drink-slide');
        if (slide && !slide.classList.contains('slick-current')) {
            slide.classList.add('hover');
        }
    });
    
    slider.addEventListener('mouseout', function(e) {
        const slide = e.target.closest('.drink-slide');
        if (slide) {
            slide.classList.remove('hover');
        }
    });
    
    // Efeito de clique simplificado
    slider.addEventListener('click', function(e) {
        const slide = e.target.closest('.drink-slide');
        if (slide) {
            // Adiciona e remove classe para animação CSS
            slide.classList.add('clicked');
            setTimeout(() => {
                slide.classList.remove('clicked');
            }, 300);
            
            const quoteName = slide.querySelector('.drink-quote')?.textContent || 'Drink Especial';
            console.log(`Detalhes do drink: "${quoteName}"`);
        }
    });
}

// Versão simplificada do destaque de slide ativo
function highlightActiveSlide() {
    // Remove classe ativa de todos os slides
    document.querySelectorAll('.drink-slide').forEach(slide => {
        slide.classList.remove('active-drink');
    });
    
    // Adiciona classe ao slide ativo
    const activeSlide = document.querySelector('.drink-slide.slick-current');
    if (activeSlide) {
        activeSlide.classList.add('active-drink');
    }
}

// Contador regressivo especial da página inicial
function initSpecialCountdown() {
    const specialCountdown = document.querySelector('.special-countdown');
    if (!specialCountdown) return;
    
    console.log('Inicializando contador especial da página inicial');
    
    const endDate = new Date(specialCountdown.getAttribute('data-end-date')).getTime();
    
    // Atualiza o contador a cada segundo
    const interval = setInterval(function() {
        const now = new Date().getTime();
        const distance = endDate - now;
        
        if (distance < 0) {
            clearInterval(interval);
            specialCountdown.innerHTML = specialCountdown.getAttribute('data-end-text') || 'Encerrado';
            return;
        }
        
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        specialCountdown.innerHTML = `
            <div class="countdown-item"><span>${days}</span> dias</div>
            <div class="countdown-item"><span>${hours}</span> horas</div>
            <div class="countdown-item"><span>${minutes}</span> min</div>
            <div class="countdown-item"><span>${seconds}</span> seg</div>
        `;
    }, 1000);
}

// Efeitos de destaque na página inicial
function initHomeHighlights() {
    const highlights = document.querySelectorAll('.destaque-card');
    if (!highlights.length) return;
    
    console.log('Inicializando efeitos de destaque da página inicial');
    
    highlights.forEach((card, index) => {
        // Adiciona delay crescente para efeito cascata
        const delay = 100 + (index * 150);
        
        // Verifica se GSAP está disponível para animações avançadas
        if (typeof gsap !== 'undefined') {
            gsap.from(card, {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: delay / 1000,
                ease: 'power2.out'
            });
        } 
        // Fallback para CSS básico
        else {
            card.style.transitionDelay = `${delay}ms`;
            card.classList.add('show');
        }
        
        // Adiciona efeito hover
        card.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
}

// Animação específica do hero da página inicial
function initHeroAnimation() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    console.log('Inicializando animação do hero da página inicial');
    
    // Verifica se GSAP está disponível
    if (typeof gsap !== 'undefined') {
        // Timeline para sequência de animações
        const tl = gsap.timeline();
        
        tl.from('.hero-title', {
            opacity: 0,
            y: 50,
            duration: 1,
            ease: 'power3.out'
        })
        .from('.hero-subtitle', {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-cta', {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.4')
        .from('.hero-image', {
            opacity: 0,
            scale: 0.9,
            duration: 1.2,
            ease: 'power2.out'
        }, '-=0.8');
    } 
    // Fallback para CSS básico
    else {
        heroSection.classList.add('animate');
    }
    
    // Parallax suave no scroll com debounce
    window.addEventListener('scroll', debounce(function() {
        const scrollY = window.pageYOffset;
        const heroImage = heroSection.querySelector('.hero-image');
        
        if (heroImage) {
            // Efeito parallax suave
            heroImage.style.transform = `translateY(${scrollY * 0.2}px)`;
        }
    }, 10));
}

// Efeitos para a seção Sobre o Santo
function initSobreSection() {
    const sobreSection = document.querySelector('.sobre-section');
    if (!sobreSection) return;
    
    console.log('Inicializando efeitos da seção Sobre');
    
    // Verifica se o ScrollTrigger do GSAP está disponível
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        // Anima a imagem com scroll
        gsap.from('.sobre-img', {
            scrollTrigger: {
                trigger: '.sobre-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            scale: 0.9,
            duration: 1,
            ease: 'power2.out'
        });
        
        // Anima o texto com leve delay
        gsap.from('.sobre-content', {
            scrollTrigger: {
                trigger: '.sobre-section',
                start: 'top 80%',
                end: 'bottom 20%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            x: -30,
            duration: 1,
            ease: 'power2.out'
        });
    }
    
    // Adiciona efeito de hover mais elaborado
    const sobreImg = sobreSection.querySelector('.sobre-img');
    if (sobreImg) {
        sobreImg.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        sobreImg.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    }
}