document.addEventListener("DOMContentLoaded", () => {
    const sectionIndex = document.getElementById("index");
    const originalContent = sectionIndex.innerHTML; // Salva o conteúdo original
    
    const maxRecords = 151; // Total de Pokémon da 1ª geração
    const limit = 12; // Pokémon carregados por vez
    let offset = 0; // Controle de quantidade carregada
    let filteredPokemons = []; // Lista de Pokémons filtrados para manipulação

    // Função para carregar Pokémon na tela
    function loadMorePokemons(offset, limit, append = true) {
        const pokemonList = document.getElementById("pokemonList");
        const currentPokemons = filteredPokemons.slice(offset, offset + limit);

        const newHtml = currentPokemons.map((pokemon) =>
                ` 
                    <li class="pokemon ${pokemon.firstType}">
                        <span class="name">${pokemon.name}</span>
                        <span class="number">#${pokemon.order}</span>
    
                        <div class="detail">
                            <ol class="types">
                                ${pokemon.types
                                    .map((type) => `<li class="type">${type}</li>`)
                                    .join("")}
                            </ol>
    
                            <img src="${pokemon.image}" alt="${pokemon.name}" />
                        </div>
                    </li>
                `
            ).join("");

        if (append) {
            pokemonList.innerHTML += newHtml; // Adiciona mais Pokémons à lista existente
        } else {
            pokemonList.innerHTML = newHtml; // Substitui o conteúdo
        }
    }

    // Função para criar o botão "Load More"
    function createLoadMoreButton() {
        const btnLoadMore = document.createElement("button");
        btnLoadMore.id = "btn-load-more";
        btnLoadMore.textContent = "Carregar Mais";
        btnLoadMore.classList.add("load-more");

        btnLoadMore.addEventListener("click", () => {
            offset += limit; // Incrementa o offset
            loadMorePokemons(offset, limit);

            // Remove o botão se todos os Pokémon forem carregados
            if (offset + limit >= filteredPokemons.length) {
                btnLoadMore.remove();
            }
        });

        return btnLoadMore;
    }

    // Função para carregar Pokémons de um tipo específico
    function loadPokemonsByType(type) {
        offset = 0;
        
        pokeApi.getPokemons(0, maxRecords).then((pokemons = []) => {
            filteredPokemons =
                type === "all"
                    ? pokemons.slice(0, maxRecords) // Limita ao máximo de 151 Pokémons
                    : pokemons.filter((pokemon) => pokemon.types.includes(type));

            // Gera a nova página com os Pokémon filtrados
            const pokemonListHtml = 
            `
                <header>
                    <h1>Pokedex</h1>
                    <button id="btn-back" class="btn-back"><</button>
                </header>
                <ol id="pokemonList" class="pokemons"></ol>
                <footer id="footer"></footer>
            `;

            sectionIndex.innerHTML = pokemonListHtml;

            // Adiciona evento ao botão "Voltar"
            const btnBack = document.getElementById("btn-back");
            btnBack.addEventListener("click", () => {
                sectionIndex.innerHTML = originalContent; // Restaura o conteúdo inicial
                addTypeButtonEvents(); // Reatribui os eventos aos botões de tipo
            });

            // Carrega os primeiros Pokémon do tipo filtrado
            loadMorePokemons(0, limit, false); // Carrega os primeiros 12 Pokémons

            // Adiciona o botão "Load More" dentro do footer SE houver mais Pokémons
            if (filteredPokemons.length > limit) {
                const btnLoadMore = createLoadMoreButton();
                const footer = document.getElementById("footer");
                footer.appendChild(btnLoadMore);
            }
        });
    }

    // Função para atribuir eventos aos botões de tipo
    function addTypeButtonEvents() {
        const typeButtons = document.querySelectorAll(".typePokemon");
        typeButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const type = button.classList[1]; // Identifica o tipo pela classe
                loadPokemonsByType(type);
            });
        });
    }

    // Adiciona eventos de clique nos botões de tipo na inicialização
    addTypeButtonEvents();
});
