const listaProdutos = typeof produtos !== "undefined" ? produtos : [];
const systemButton = document.getElementById("dotsButton");
const systemMenu = document.getElementById("systemMenu");
const featuredEvents = document.getElementById("featuredEvents");
const allEventsGrid = document.getElementById("allEventsGrid");
const eventCount = document.getElementById("eventCount");
const eventSearch = document.getElementById("eventSearch");
const eventSearchButton = document.getElementById("eventSearchButton");

function formatarData(data) {
    if (!data) return "--";

    const partes = data.split("-");

    if (partes.length !== 3) return data;

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function formatarPreco(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function estaNaPastaPages() {
    return window.location.pathname.toLowerCase().includes("/pages/");
}

function caminhoImagem(caminho) {
    if (!caminho) return "";
    return estaNaPastaPages() ? `../${caminho}` : caminho;
}

function caminhoEvento(id) {
    return estaNaPastaPages()
        ? `evento.html?id=${id}`
        : `Pages/evento.html?id=${id}`;
}

function criarCard(evento) {
    const imagem = caminhoImagem(evento.imagem);

    return `
        <article class="event-card">

            <a
                href="${caminhoEvento(evento.idProduto)}"
                class="event-card-image"
                aria-label="Abrir ${evento.nomeEvento}"
            >
                <img src="${imagem}" alt="${evento.nomeEvento}">
                <div class="event-date">
                    ${formatarData(evento.dataEvento)}
                </div>
            </a>

            <div class="event-card-content">

                <span class="event-category">
                    ${evento.categoria}
                </span>

                <h3>
                    ${evento.nomeEvento}
                </h3>

                <p>
                    ${evento.clubLocal}
                </p>

                <div class="event-card-footer">

                    <strong>
                        ${formatarPreco(evento.precoVenda)}
                    </strong>

                    <a
                        href="${caminhoEvento(evento.idProduto)}"
                        class="card-button"
                    >
                        Comprar
                    </a>

                </div>

            </div>

        </article>
    `;
}

function renderizarEventos(lista, container) {
    if (!container) return;

    if (lista.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h2>Nenhum evento encontrado</h2>
                <p>Não encontramos eventos para sua busca.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = lista.map(criarCard).join("");
}

function carregarDestaques() {
    if (!featuredEvents) return;

    renderizarEventos(
        listaProdutos.slice(0, 3),
        featuredEvents
    );
}

function carregarTodosEventos(lista = listaProdutos) {
    if (!allEventsGrid) return;

    renderizarEventos(
        lista,
        allEventsGrid
    );

    if (eventCount) {
        eventCount.textContent =
            `${lista.length} ${lista.length === 1 ? "evento" : "eventos"}`;
    }
}

function pesquisarEventos() {
    if (!eventSearch) return;

    const termo = eventSearch.value.trim().toLowerCase();

    const resultados = listaProdutos.filter(evento => {
        return (
            evento.nomeEvento.toLowerCase().includes(termo) ||
            evento.clubLocal.toLowerCase().includes(termo) ||
            evento.categoria.toLowerCase().includes(termo) ||
            evento.cidade.toLowerCase().includes(termo)
        );
    });

    carregarTodosEventos(resultados);
}

if (eventSearch) {
    eventSearch.addEventListener("input", pesquisarEventos);
}

if (eventSearchButton) {
    eventSearchButton.addEventListener("click", pesquisarEventos);
}

if (systemButton && systemMenu) {
    systemButton.addEventListener("click", function(event) {
        event.stopPropagation();
        systemMenu.classList.toggle("show");
    });

    document.addEventListener("click", function(event) {
        if (!systemMenu.contains(event.target)) {
            systemMenu.classList.remove("show");
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    carregarDestaques();
    carregarTodosEventos();
});
