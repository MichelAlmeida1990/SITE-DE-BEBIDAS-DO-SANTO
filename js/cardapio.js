/**
 * Santo Drink Bar - Cardápio
 * Scripts para a funcionalidade da página de cardápio
 */

// Aguarda até que o DOM esteja pronto antes de executar o código
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa todas as funções principais
    initStickyNav();
    setupFilterButtons();
    setupViewToggle();
    setupDetailsButtons();
    loadCardImages()
    
    // Equaliza as alturas dos cards após um pequeno delay para garantir que tudo foi carregado
    setTimeout(equalizeCardHeights, 100);
    
    // Re-equaliza os cards quando a janela for redimensionada
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(equalizeCardHeights, 250);
    });
});

/**
 * Função otimizada para a navegação sticky
 * Usa requestAnimationFrame para melhorar a performance de scrolling
 */
function initStickyNav() {
    const nav = document.querySelector('.cardapio-nav');
    if (!nav) return;
    
    const navTop = nav.offsetTop;
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.scrollY >= navTop) {
                    document.body.classList.add('nav-fixed');
                    nav.classList.add('fixed');
                } else {
                    document.body.classList.remove('nav-fixed');
                    nav.classList.remove('fixed');
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Função melhorada para equalizar alturas dos cards
 * Define uma altura máxima para evitar cards muito grandes
 * Agrupa por linhas para melhor responsividade
 */
function equalizeCardHeights() {
    const cardSections = ['promo-card', 'caldo-card', 'porcao-card', 'drink-card'];
    const menuItems = document.querySelectorAll('.menu-item.with-image');
    
    // Altura máxima razoável para cards de drinks autorais
    const MAX_HEIGHT_AUTORAIS = 160;
    
    // Reset height first for all menu items
    menuItems.forEach(item => {
        item.style.height = 'auto';
    });
    
    // Group menu items by row
    const rows = {};
    menuItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const top = Math.floor(rect.top);
        
        if (!rows[top]) rows[top] = [];
        rows[top].push(item);
    });
    
    // Apply max height to each row, with a reasonable limit
    Object.values(rows).forEach(rowItems => {
        let rowMaxHeight = 0;
        rowItems.forEach(item => {
            rowMaxHeight = Math.max(rowMaxHeight, item.offsetHeight);
        });
        
        // Limit maximum height to prevent overly tall cards
        rowMaxHeight = Math.min(rowMaxHeight, MAX_HEIGHT_AUTORAIS);
        
        rowItems.forEach(item => {
            item.style.height = `${rowMaxHeight}px`;
        });
    });
    
    // Handle other card types with standard equalization
    cardSections.forEach(sectionClass => {
        const cards = document.querySelectorAll('.' + sectionClass);
        let maxHeight = 0;
        
        cards.forEach(card => {
            card.style.height = 'auto';
            maxHeight = Math.max(maxHeight, card.offsetHeight);
        });
        
        cards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    });
}

/**
 * Configura os botões de filtro para filtrar itens do cardápio
 */
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            
            // Get all items that can be filtered
            const menuItems = document.querySelectorAll('.menu-item');
            
            // Apply filter
            menuItems.forEach(item => {
                if (filter === 'all') {
                    item.style.display = 'flex';
                } else {
                    if (item.classList.contains(filter)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                }
            });
            
            // Re-equalize heights after filtering
            setTimeout(equalizeCardHeights, 100);
        });
    });
}

/**
 * Configura o botão de alternar visualização (lista/grade)
 */
function setupViewToggle() {
    const viewToggle = document.querySelector('.view-toggle');
    if (!viewToggle) return;
    
    viewToggle.addEventListener('click', function() {
        const rows = document.querySelectorAll('.row');
        const icon = this.querySelector('i');
        const text = this.querySelector('span');
        
        rows.forEach(row => {
            if (row.classList.contains('grid-view')) {
                // Switch to list view
                row.classList.remove('grid-view');
                icon.className = 'fas fa-grip-horizontal';
                text.textContent = 'Visualizar em Grade';
            } else {
                // Switch to grid view
                row.classList.add('grid-view');
                icon.className = 'fas fa-list';
                text.textContent = 'Visualizar em Lista';
            }
        });
        
        // Re-equalize heights after changing view
        setTimeout(equalizeCardHeights, 100);
    });
}

/**
 * Configura os botões para expandir detalhes dos drinks
 */
function setupDetailsButtons() {
    const detailsButtons = document.querySelectorAll('.details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const detailsContent = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle details visibility
            if (detailsContent.classList.contains('show')) {
                detailsContent.classList.remove('show');
                icon.className = 'fas fa-chevron-down';
            } else {
                detailsContent.classList.add('show');
                icon.className = 'fas fa-chevron-up';
            }
            
            // Re-equalize heights after expanding details
            setTimeout(equalizeCardHeights, 300);
        });
    });
}

/**
 * Configura lazy loading para imagens de drinks
 */
function setupLazyLoading() {
    // Use Intersection Observer para carregar imagens apenas quando visíveis
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const menuItem = entry.target;
                    
                    // Extract image path from CSS variable or data attribute
                    let imagePath = menuItem.style.getPropertyValue('--bg-image');
                    if (!imagePath) {
                        // Se não tiver a variável CSS, tenta pegar do atributo data
                        const className = Array.from(menuItem.classList).find(c => c.startsWith('drink-'));
                        if (className) {
                            const drinkNumber = className.split('-')[1];
                            imagePath = `url('../images/drinks/${drinkNumber}.jpg')`;
                        }
                    }
                    
                    // Apply image if found
                    if (imagePath) {
                        menuItem.style.setProperty('--bg-image', imagePath);
                        menuItem.classList.add('lazy-loaded');
                    }
                    
                    // Stop observing this element
                    observer.unobserve(menuItem);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        // Observe all menu items with images
        document.querySelectorAll('.menu-item.with-image').forEach(item => {
            imgObserver.observe(item);
        });
    } else {
        // Fallback for browsers that don't support Intersection Observer
        document.querySelectorAll('.menu-item.with-image').forEach(item => {
            item.classList.add('lazy-loaded');
        });
    }
}

/**
 * Aplica animações suaves de rolagem para os links do menu
 */
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Função simplificada para carregar imagens nos cards
function loadCardImages() {
    // Para cada item com classe .with-image, verifica se precisa aplicar uma imagem
    document.querySelectorAll('.menu-item.with-image').forEach(item => {
        // Se o elemento já tem uma classe drink-X, não precisamos fazer nada
        if (Array.from(item.classList).some(cls => cls.startsWith('drink-'))) {
            // A imagem será carregada pelo CSS
            item.classList.add('lazy-loaded');
        } 
        // Se tiver um atributo data-image, usamos ele
        else if (item.getAttribute('data-image')) {
            const imagePath = item.getAttribute('data-image');
            item.style.setProperty('--bg-image', `url('../images/${imagePath}')`);
            item.classList.add('lazy-loaded');
        }
    });
}

// Chamar esta função quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    loadCardImages();
    // ... resto do seu código
});

