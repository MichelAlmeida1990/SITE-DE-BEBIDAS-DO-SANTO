// Espera o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o campo de busca
    const searchInput = document.getElementById('search-input');
    const clearSearchButton = document.getElementById('clear-search');
    
    // Adiciona evento de input para busca em tempo real
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });
    
    // Adiciona evento para busca ao pressionar Enter
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const searchTerm = this.value;
            performSearch(searchTerm);
            
            // Rola para o primeiro resultado encontrado
            setTimeout(() => {
                scrollToFirstResult();
            }, 300); // Pequeno delay para garantir que os resultados estejam prontos
        }
    });
    
    // Adiciona evento para limpar a busca
    if (clearSearchButton) {
        clearSearchButton.addEventListener('click', function() {
            searchInput.value = '';
            performSearch('');
            this.style.display = 'none';
        });
    }
    
    // Mostra/esconde o botão de limpar conforme necessário
    searchInput.addEventListener('input', function() {
        if (clearSearchButton) {
            clearSearchButton.style.display = this.value ? 'block' : 'none';
        }
    });
    
    // Inicializa o estado do botão de limpar
    if (clearSearchButton) {
        clearSearchButton.style.display = searchInput.value ? 'block' : 'none';
    }
    
    // Adiciona os estilos necessários para os destaques
    addSearchStyles();
    
    // Analisa o conteúdo dos cards para criar um índice de busca preciso
    createSearchIndex();
    
    // Inicializa o lazy loading para os cards
    initLazyLoading();
});

// Armazena o índice de busca e o mapeamento de produtos
let searchIndex = [];
let productCategoryMap = {};

// Função para criar um índice de busca baseado no conteúdo real dos cards
function createSearchIndex() {
    const allCards = document.querySelectorAll('.drink-card, .porcao-card, .doce-card, .caldo-card, .combo-card, .bebida-card, .shot-card, .whisky-card, .vodka-card, .cerveja-card, .caipirinha-card, .cachaca-card, .cigarro-card');
    
    // Mapeamento de categorias de produtos (baseado nas classes dos cards)
    const categoryClasses = {
        'drink-card': 'drink',
        'porcao-card': 'porção',
        'doce-card': 'sobremesa',
        'caldo-card': 'caldo',
        'combo-card': 'combo',
        'bebida-card': 'bebida',
        'shot-card': 'shot',
        'whisky-card': 'whisky',
        'vodka-card': 'vodka',
        'cerveja-card': 'cerveja',
        'caipirinha-card': 'caipirinha',
        'cachaca-card': 'cachaça',
        'cigarro-card': 'cigarro'
    };
    
    // Constrói o índice de busca com base nos cards existentes
    searchIndex = Array.from(allCards).map(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase().trim() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase().trim() || '';
        const price = card.querySelector('.card-price')?.textContent.toLowerCase().trim() || '';
        const ingredients = card.querySelector('.card-ingredients')?.textContent.toLowerCase().trim() || '';
        
        // Determina a categoria do produto com base na classe do card
        let category = '';
        for (const [className, categoryName] of Object.entries(categoryClasses)) {
            if (card.classList.contains(className)) {
                category = categoryName;
                break;
            }
        }
        
        // Extrai palavras-chave do título e conteúdo
        const allContent = title + ' ' + description + ' ' + price + ' ' + ingredients;
        const uniqueWords = [...new Set(allContent.split(/\s+/).filter(word => word.length > 2))];
        
        // Adiciona a marca/nome do produto ao mapeamento de categorias
        if (title && category) {
            if (!productCategoryMap[category]) {
                productCategoryMap[category] = [];
            }
            productCategoryMap[category].push(title);
        }
        
        return {
            element: card,
            title,
            description,
            price,
            ingredients,
            category,
            allContent,
            uniqueWords
        };
    });
    
    console.log('Índice de busca criado com', searchIndex.length, 'itens');
    console.log('Mapeamento de categorias de produtos:', productCategoryMap);
    
    // Cria um dicionário de termos relacionados com base no conteúdo real do cardápio
    buildRelatedTermsDictionary();
}

// Dicionário global de termos relacionados
let relatedTermsDictionary = {};

// Constrói um dicionário de termos relacionados com base no conteúdo real do cardápio
function buildRelatedTermsDictionary() {
    // Define relações básicas de categorias
    const baseRelations = {
        'cerveja': ['gelada', 'chopp', 'pilsen', 'lager', 'long neck', 'latão', 'lata', 'garrafa'],
        'whisky': ['whiskey', 'bourbon', 'escocês', 'irlandês', 'dose', 'destilado'],
        'vodka': ['destilada', 'dose', 'russa', 'polonesa'],
        'caipirinha': ['limão', 'frutas', 'drink', 'cachaça'],
        'porção': ['petisco', 'aperitivo', 'tira gosto', 'entrada'],
        'drink': ['coquetel', 'cocktail', 'bebida', 'mixologia'],
        'caldo': ['sopa', 'quente', 'cremoso'],
        'sobremesa': ['doce', 'pudim', 'mousse', 'sorvete', 'torta', 'bolo'],
        'shot': ['dose', 'destilado'],
        'combo': ['promoção', 'conjunto', 'kit', 'oferta'],
        'gin': ['tônica', 'botânicos', 'zimbro']
    };
    
    // Inicializa o dicionário com as relações básicas
    relatedTermsDictionary = {...baseRelations};
    
    // Adiciona todos os produtos reais do cardápio às suas respectivas categorias
    for (const [category, products] of Object.entries(productCategoryMap)) {
        if (!relatedTermsDictionary[category]) {
            relatedTermsDictionary[category] = [];
        }
        
        // Adiciona cada produto à sua categoria
        products.forEach(product => {
            relatedTermsDictionary[category].push(product);
            
            // Cria uma entrada para o produto que aponta para sua categoria
            const productKey = product.toLowerCase();
            if (!relatedTermsDictionary[productKey]) {
                relatedTermsDictionary[productKey] = [category];
            } else if (!relatedTermsDictionary[productKey].includes(category)) {
                relatedTermsDictionary[productKey].push(category);
            }
        });
    }
    
    console.log('Dicionário de termos relacionados construído:', relatedTermsDictionary);
}

// Função para rolar até o primeiro resultado encontrado
function scrollToFirstResult() {
    const firstResult = document.querySelector('.search-highlight');
    if (firstResult) {
        // Calcula a posição do elemento com offset para não ficar muito no topo
        const offsetTop = firstResult.getBoundingClientRect().top + window.pageYOffset - 120;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
        
        // Adiciona um efeito de pulsação extra para chamar atenção
        firstResult.classList.add('extra-highlight');
        
        // Cria um indicador visual para ajudar a localizar o resultado
        createResultIndicator(firstResult);
        
        setTimeout(() => {
            firstResult.classList.remove('extra-highlight');
            const indicator = document.querySelector('.result-indicator');
            if (indicator) indicator.remove();
        }, 3000);
    }
}

// Cria um indicador visual para o resultado da busca
function createResultIndicator(element) {
    // Remove indicador anterior se existir
    const oldIndicator = document.querySelector('.result-indicator');
    if (oldIndicator) oldIndicator.remove();
    
    const indicator = document.createElement('div');
    indicator.className = 'result-indicator';
    indicator.innerHTML = '<span>▼ Resultado encontrado ▼</span>';
    
    // Insere o indicador antes do elemento
    element.parentNode.insertBefore(indicator, element);
}

// Função que realiza a busca
function performSearch(searchTerm) {
    searchTerm = searchTerm.toLowerCase().trim();
    console.log('Buscando por:', searchTerm);
    
    // Remove mensagem anterior se existir
    const oldMessage = document.querySelector('.no-results-message');
    if (oldMessage) oldMessage.remove();
    
    // Remove indicador anterior se existir
    const oldIndicator = document.querySelector('.result-indicator');
    if (oldIndicator) oldIndicator.remove();
    
    // Se não houver termo de busca, mostra tudo
    if (searchTerm === '') {
        searchIndex.forEach(item => {
            item.element.style.display = '';
            item.element.classList.remove('search-highlight');
            item.element.classList.remove('extra-highlight');
            removeHighlights(item.element);
        });
        
        document.querySelectorAll('.cardapio-section').forEach(section => {
            section.style.display = '';
        });
        
        // Reinicia o lazy loading após limpar a busca
        initLazyLoading();
        return;
    }
    
    // Divide o termo de busca em palavras individuais
    const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 1);
    
    // Expande os termos de busca com base nas palavras relacionadas
    let expandedSearchTerms = [...searchWords];
    
    // Adiciona termos relacionados à busca usando o dicionário construído
    searchWords.forEach(word => {
        // Verifica se a palavra está no dicionário
        if (relatedTermsDictionary[word]) {
            expandedSearchTerms = expandedSearchTerms.concat(relatedTermsDictionary[word]);
        }
        
        // Verifica se a palavra é parte de alguma chave no dicionário
        for (const [key, values] of Object.entries(relatedTermsDictionary)) {
            // Se a palavra é parte de uma chave
            if (key.includes(word) && key !== word) {
                expandedSearchTerms.push(key);
                expandedSearchTerms = expandedSearchTerms.concat(values);
            }
            
            // Se a palavra é parte de algum valor
            values.forEach(value => {
                if (typeof value === 'string' && value.includes(word) && value !== word) {
                    expandedSearchTerms.push(value);
                    expandedSearchTerms.push(key);
                }
            });
        }
    });
    
    // Remove duplicatas e termos muito curtos
    expandedSearchTerms = [...new Set(expandedSearchTerms)].filter(term => term.length > 2);
    console.log('Termos expandidos para busca:', expandedSearchTerms);
    
    // Contador de itens encontrados
    let foundItems = 0;
    const matchedItems = [];
    
    // Filtra os itens do índice
    searchIndex.forEach(item => {
        let isMatch = false;
        let matchScore = 0;
        
        // Verifica correspondência exata no título (prioridade máxima)
        if (item.title === searchTerm) {
            isMatch = true;
            matchScore += 20;
        }
        
        // Verifica correspondências parciais no título (alta prioridade)
        if (item.title.includes(searchTerm)) {
            isMatch = true;
            matchScore += 10;
        }
        
        // Verifica se o termo de busca é a categoria do item
        if (item.category === searchTerm) {
            isMatch = true;
            matchScore += 8;
        }
        
        // Verifica correspondências com termos expandidos no título
        expandedSearchTerms.forEach(term => {
            if (item.title.includes(term)) {
                isMatch = true;
                matchScore += 5;
            }
        });
        
        // Verifica correspondências em outros campos
        expandedSearchTerms.forEach(term => {
            if (item.description.includes(term)) {
                isMatch = true;
                matchScore += 3;
            }
            
            if (item.ingredients && item.ingredients.includes(term)) {
                isMatch = true;
                matchScore += 4;
            }
        });
        
        if (isMatch) {
            item.element.style.display = '';
            foundItems++;
            
            // Adiciona efeito de destaque
            item.element.classList.add('search-highlight');
            item.element.dataset.matchScore = matchScore;
            
            // Destaca o termo encontrado no título e descrição
            highlightMatchedTerms(item.element, [searchTerm, ...expandedSearchTerms]);
            
            // Adiciona ao array de itens encontrados
            matchedItems.push({
                element: item.element,
                score: matchScore
            });
        } else {
            item.element.style.display = 'none';
            item.element.classList.remove('search-highlight');
            item.element.classList.remove('extra-highlight');
            
            // Remove destaques anteriores
            removeHighlights(item.element);
        }
    });
    
    console.log('Itens encontrados:', foundItems);
    
    // Ordena os itens encontrados por pontuação (mais relevantes primeiro)
    matchedItems.sort((a, b) => b.score - a.score);
    
    // Reordena os elementos no DOM para mostrar os mais relevantes primeiro
    if (matchedItems.length > 0) {
        const container = matchedItems[0].element.parentNode;
        
        // Reordena os elementos no DOM
        matchedItems.forEach(item => {
            container.appendChild(item.element);
        });
    }
    
    // Esconde seções vazias
    document.querySelectorAll('.cardapio-section').forEach(section => {
        const visibleCards = Array.from(section.querySelectorAll('[class*="-card"]'))
            .filter(card => card.style.display !== 'none');
        
        if (visibleCards.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
    
    // Mostra mensagem se não encontrar nada
    if (foundItems === 0 && searchTerm.length > 0) {
        const noResultsMessage = document.createElement('div');
        noResultsMessage.className = 'no-results-message';
        noResultsMessage.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #777;">
                <h3>Nenhum item encontrado para "${searchTerm}"</h3>
                <p>Tente buscar por outra palavra ou verifique a ortografia.</p>
            </div>
        `;
        
        const searchContainer = document.querySelector('.search-container') || document.getElementById('search-input').parentNode;
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(noResultsMessage, searchContainer.nextSibling);
        }
    } else if (foundItems > 0 && searchTerm.length > 0) {
        // Cria uma mensagem de resultados encontrados
        const resultsMessage = document.createElement('div');
        resultsMessage.className = 'no-results-message results-found';
        resultsMessage.innerHTML = `
            <div style="text-align: center; padding: 15px; color: #4a7; background-color: #f8fff8;">
                <h4>${foundItems} item(s) encontrado(s) para "${searchTerm}"</h4>
            </div>
        `;
        
        const searchContainer = document.querySelector('.search-container') || document.getElementById('search-input').parentNode;
        if (searchContainer) {
            searchContainer.parentNode.insertBefore(resultsMessage, searchContainer.nextSibling);
        }
        
        // Rola para o primeiro resultado encontrado após uma busca manual
        setTimeout(() => {
            scrollToFirstResult();
        }, 300);
    }
}

// Função para destacar os termos encontrados
function highlightMatchedTerms(card, terms) {
    removeHighlights(card);
    
    const elements = [
        card.querySelector('.card-title'),
        card.querySelector('.card-description'),
        card.querySelector('.card-ingredients')
    ];
    
    elements.forEach(element => {
        if (!element) return;
        
        const originalText = element.textContent;
        let highlightedText = originalText;
        
        // Guarda o texto original como atributo se ainda não existir
        if (!element.hasAttribute('data-original-text')) {
            element.setAttribute('data-original-text', originalText);
        }
        
        // Ordena os termos por tamanho (do maior para o menor) para evitar substituições parciais
        const sortedTerms = [...terms].sort((a, b) => b.length - a.length);
        
        sortedTerms.forEach(term => {
            if (!term || term.length < 3) return; // Ignora termos muito curtos
            
            // Escape caracteres especiais para regex
            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedTerm})`, 'gi');
            highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
        });
        
        if (highlightedText !== originalText) {
            element.innerHTML = highlightedText;
        }
    });
}

// Função para remover destaques
function removeHighlights(card) {
    const elements = [
        card.querySelector('.card-title'),
        card.querySelector('.card-description'),
        card.querySelector('.card-ingredients')
    ];
    
    elements.forEach(element => {
        if (!element) return;
        
        // Restaura o texto original se existir
        if (element.hasAttribute('data-original-text')) {
            element.textContent = element.getAttribute('data-original-text');
        } else {
            // Remove as tags de destaque
            element.innerHTML = element.innerHTML.replace(/<span class="highlight">(.*?)<\/span>/g, '$1');
        }
    });
}

// Inicializa o lazy loading para os cards
function initLazyLoading() {
    // Seleciona todas as seções do cardápio
    const sections = document.querySelectorAll('.cardapio-section');
    
    // Define o número inicial de cards visíveis por seção
    const initialVisibleCards = window.innerWidth <= 768 ? 4 : 8;
    
    // Processa cada seção
    sections.forEach(section => {
        const cards = section.querySelectorAll('[class*="-card"]');
        const cardCount = cards.length;
        
        // Se a seção tem mais cards que o limite inicial, configura o lazy loading
        if (cardCount > initialVisibleCards) {
            // Esconde os cards excedentes
            Array.from(cards).forEach((card, index) => {
                if (index >= initialVisibleCards) {
                    card.classList.add('lazy-hidden');
                }
            });
            
            // Cria o botão "Mostrar mais"
            if (!section.querySelector('.show-more-btn')) {
                const showMoreBtn = document.createElement('button');
                showMoreBtn.className = 'show-more-btn';
                showMoreBtn.innerHTML = `Mostrar mais ${cardCount - initialVisibleCards} itens <i class="fas fa-chevron-down"></i>`;
                
                // Adiciona evento de clique para mostrar mais cards
                showMoreBtn.addEventListener('click', function() {
                    const hiddenCards = section.querySelectorAll('.lazy-hidden');
                    
                    // Mostra todos os cards escondidos
                    hiddenCards.forEach(card => {
                        card.classList.remove('lazy-hidden');
                    });
                    
                    // Remove o botão após mostrar todos os cards
                    this.remove();
                });
                
                // Adiciona o botão ao final da seção
                section.querySelector('.card-grid').after(showMoreBtn);
            }
        }
    });
    
    // Adiciona observador de interseção para carregar cards quando ficarem visíveis
    setupIntersectionObserver();
}

// Configura o observador de interseção para lazy loading
function setupIntersectionObserver() {
    // Verifica se o navegador suporta IntersectionObserver
    if ('IntersectionObserver' in window) {
        const options = {
            root: null, // viewport
            rootMargin: '200px', // carrega quando estiver a 200px de distância
            threshold: 0.1 // 10% do elemento visível
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const hiddenCards = section.querySelectorAll('.lazy-hidden');
                    
                    // Mostra gradualmente os cards escondidos
                    Array.from(hiddenCards).slice(0, 4).forEach(card => {
                        card.classList.remove('lazy-hidden');
                    });
                    
                    // Se não houver mais cards escondidos, para de observar esta seção
                    if (section.querySelectorAll('.lazy-hidden').length === 0) {
                        observer.unobserve(section);
                        
                        // Remove o botão "Mostrar mais" se existir
                        const showMoreBtn = section.querySelector('.show-more-btn');
                        if (showMoreBtn) showMoreBtn.remove();
                    }
                }
            });
        }, options);
        
        // Observa todas as seções do cardápio
        document.querySelectorAll('.cardapio-section').forEach(section => {
            observer.observe(section);
        });
    } else {
        // Fallback para navegadores que não suportam IntersectionObserver
        document.querySelectorAll('.lazy-hidden').forEach(card => {
            card.classList.remove('lazy-hidden');
        });
        
        // Remove todos os botões "Mostrar mais"
        document.querySelectorAll('.show-more-btn').forEach(btn => {
            btn.remove();
        });
    }
}

// Adiciona o CSS necessário para os destaques e lazy loading
function addSearchStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .search-highlight {
            animation: pulse 1.5s ease-in-out;
        }
        
        .extra-highlight {
            box-shadow: 0 0 15px rgba(255, 230, 0, 0.7);
            animation: extra-pulse 2s ease-in-out;
        }
        
        .highlight {
            background-color: rgba(255, 255, 0, 0.4);
            font-weight: bold;
            border-radius: 2px;
            padding: 0 2px;
        }
        
        .result-indicator {
            background-color: #ffeb3b;
            color: #333;
            text-align: center;
            padding: 5px;
            margin-bottom: 5px;
            border-radius: 5px;
            font-weight: bold;
            animation: blink 1s infinite;
            box-shadow: 0 0 10px rgba(255, 235, 59, 0.7);
        }
        
        @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
        }
        
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.03); }
            100% { transform: scale(1); }
        }
        
        @keyframes extra-pulse {
            0% { box-shadow: 0 0 15px rgba(255, 230, 0, 0.7); }
            50% { box-shadow: 0 0 25px rgba(255, 230, 0, 0.9); }
            100% { box-shadow: 0 0 15px rgba(255, 230, 0, 0.7); }
        }
        
        .no-results-message {
            margin: 20px auto;
            max-width: 600px;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .results-found {
            background-color: #f8fff8;
            box-shadow: 0 2px 5px rgba(0,150,0,0.1);
        }
        
        /* Estilos para lazy loading */
        .lazy-hidden {
            display: none !important;
        }
        
        .show-more-btn {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #F9C22E;
            color: #121212;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        
        .show-more-btn:hover {
            background-color: #ffcf54;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .show-more-btn i {
            margin-left: 5px;
            transition: transform 0.3s ease;
        }
        
        .show-more-btn:hover i {
            transform: translateY(2px);
        }
    `;
    document.head.appendChild(styleElement);
}

// Inicialização do AOS
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Scroll suave para as seções do cardápio
    document.querySelectorAll('.nav-tab').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 100;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Atualiza a tab ativa
                document.querySelectorAll('.nav-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Botão voltar ao topo
    const scrollTop = document.querySelector('.scroll-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTop.classList.add('show');
        } else {
            scrollTop.classList.remove('show');
        }
    });

    scrollTop.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Navbar fixa com mudança de cor ao rolar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Atualiza o lazy loading quando a janela é redimensionada
    window.addEventListener('resize', debounce(function() {
        // Reinicia o lazy loading
        document.querySelectorAll('.show-more-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.lazy-hidden').forEach(card => {
            card.classList.remove('lazy-hidden');
        });
        initLazyLoading();
    }, 250));
});

// Função de debounce para evitar múltiplas chamadas durante o redimensionamento
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
