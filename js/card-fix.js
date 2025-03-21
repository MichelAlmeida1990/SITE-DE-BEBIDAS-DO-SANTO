/**
 * Santo Drink Bar - Correção para layout dos cards
 * Versão otimizada para estrutura HTML atual
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Card Fix JS carregado');
    
    // Normaliza as classes dos cards para garantir consistência
    normalizeCardClasses();
    
    // Inicializa a formatação dos cards
    initCardLayout();
    
    // Adiciona evento de redimensionamento com debounce
    window.addEventListener('resize', debounce(function() {
        initCardLayout();
    }, 250));
    
    // Monitora mudanças no layout por botões de toggle
    monitorViewToggles();
    
    // Monitora cliques nos filtros
    monitorFilterButtons();
});

// Função para normalizar as classes dos cards
function normalizeCardClasses() {
    // Seleciona todos os tipos de cards do site baseado nas classes encontradas no HTML
    const allCards = document.querySelectorAll('.menu-item, [class*="drink-"]');
    
    if (!allCards.length) {
        console.log('Nenhum card encontrado para normalizar');
        return;
    }
    
    console.log(`Normalizando ${allCards.length} cards`);
    
    allCards.forEach(card => {
        // Adiciona a classe base card-item a todos os cards
        card.classList.add('card-item');
        
        // Normaliza a estrutura interna se necessário
        normalizeCardStructure(card);
    });
}

// Normaliza a estrutura interna dos cards para garantir consistência
function normalizeCardStructure(card) {
    // Verifica se o card tem uma imagem
    const hasImage = card.classList.contains('with-image') || 
                     card.querySelector('img') !== null;
    
    if (hasImage && !card.querySelector('.card-image, .item-image')) {
        // Encontra a imagem e envolve-a em um div .card-image se não existir
        const img = card.querySelector('img');
        if (img && img.parentNode === card) {
            const imageWrapper = document.createElement('div');
            imageWrapper.className = 'card-image';
            card.insertBefore(imageWrapper, img);
            imageWrapper.appendChild(img);
        }
    }
    
    // Normaliza o conteúdo do card
    const infoElement = card.querySelector('.menu-item-info');
    if (infoElement) {
        infoElement.classList.add('card-content');
        
        // Normaliza o título
        const title = infoElement.querySelector('h4');
        if (title) title.classList.add('card-title');
        
        // Normaliza a descrição
        const description = infoElement.querySelector('p');
        if (description) description.classList.add('card-description');
        
        // Normaliza o preço
        const price = infoElement.querySelector('.price');
        if (price) price.classList.add('card-price');
    }
    
    // Normaliza as badges
    const badges = card.querySelectorAll('[class*="badge-"]');
    badges.forEach(badge => {
        badge.classList.add('card-badge');
    });
}

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

// Função principal para inicializar o layout dos cards
function initCardLayout() {
    console.log('Inicializando formatação de cards');
    
    // Seleciona todos os cards com a classe normalizada
    const allCards = document.querySelectorAll('.card-item');
    
    if (!allCards.length) {
        console.log('Nenhum card encontrado para formatar');
        return;
    }
    
    // Reseta formatações que possam ter ficado de processamentos anteriores
    resetCardStyles(allCards);
    
    // Formata os cards baseado na visualização atual
    formatCardsBasedOnView();
    
    // Iguala as alturas dos cards em cada linha (apenas em grid)
    const container = document.querySelector('.row, .cardapio-category');
    if (container && window.innerWidth >= 768) {
        equalizeCardHeights(container);
    }
}

// Função para resetar estilos dos cards
function resetCardStyles(cards) {
    cards.forEach(card => {
        // Remove estilos inline que podem estar causando problemas
        card.style.height = '';
        card.style.minHeight = '';
    });
}

// Função para formatar cards baseado na visualização atual
function formatCardsBasedOnView() {
    // Detecta o modo de visualização atual
    const isListView = document.body.classList.contains('list-view');
    const isCompactView = document.body.classList.contains('compact-view');
    
    const cards = document.querySelectorAll('.card-item');
    
    cards.forEach(card => {
        // Remove todas as classes de visualização
        card.classList.remove('grid-card', 'list-card', 'compact-card');
        
        // Adiciona a classe apropriada
        if (isListView) {
            card.classList.add('list-card');
        } else if (isCompactView) {
            card.classList.add('compact-card');
        } else {
            card.classList.add('grid-card'); // Default é grid
        }
    });
}

// Função para igualar as alturas dos cards
function equalizeCardHeights(container) {
    // Obtém todos os cards dentro do container
    const cards = container.querySelectorAll('.card-item');
    if (!cards.length) return;
    
    // Agrupa cards por linhas (baseado na posição Y)
    const rows = {};
    
    cards.forEach(card => {
        // Reseta altura para obter a posição natural
        card.style.height = 'auto';
        
        // Obtém a posição Y
        const posY = Math.floor(card.getBoundingClientRect().top);
        if (!rows[posY]) rows[posY] = [];
        rows[posY].push(card);
    });
    
    // Para cada linha, encontra a altura máxima e aplica a todos
    Object.keys(rows).forEach(posY => {
        const rowCards = rows[posY];
        let maxHeight = 0;
        
        // Encontra a altura máxima
        rowCards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) maxHeight = height;
        });
        
        // Aplica a altura máxima a todos os cards da linha
        rowCards.forEach(card => {
            card.style.height = maxHeight + 'px';
        });
    });
}

// Monitora mudanças nos botões de toggle de visualização
function monitorViewToggles() {
    const viewToggle = document.querySelector('.view-toggle');
    if (!viewToggle) return;
    
    viewToggle.addEventListener('click', function() {
        // Alterna entre os modos de visualização
        if (document.body.classList.contains('list-view')) {
            document.body.classList.remove('list-view');
            document.body.classList.add('grid-view');
            viewToggle.innerHTML = '<i class="fas fa-list"></i> <span>Visualizar em Lista</span>';
        } else {
            document.body.classList.remove('grid-view');
            document.body.classList.add('list-view');
            viewToggle.innerHTML = '<i class="fas fa-grip-horizontal"></i> <span>Visualizar em Grade</span>';
        }
        
        // Atualiza o layout
        setTimeout(initCardLayout, 50);
    });
}

// Monitora cliques nos botões de filtro
function monitorFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove a classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Adiciona a classe active ao botão clicado
            this.classList.add('active');
            
            // Obtém o filtro
            const filter = this.getAttribute('data-filter');
            
            // Filtra os cards
            filterCards(filter);
            
            // Atualiza o layout após o filtro
            setTimeout(initCardLayout, 50);
        });
    });
}

// Filtra os cards baseado no filtro selecionado
function filterCards(filter) {
    const cards = document.querySelectorAll('.card-item');
    
    cards.forEach(card => {
        if (filter === 'all') {
            card.style.display = '';
        } else {
            if (card.classList.contains(filter)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        }
    });
}
