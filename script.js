// Requisição

async function requestCompanies() {
    try {
        const requestHeaders = {
            'Content-Type': 'application/json'
        };
        const response = await fetch(`https://ecommerce-fake-api-two.vercel.app/products`, {
            method: "GET",
            headers: requestHeaders
        });

        if (response.ok) {
            const data = await response.json();
            return data; 
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
}

async function main() {
    try {
        let products = await requestCompanies();
        return products
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Variáveis

const footerButton = document.querySelector(".footer-button")




// Lógica do retorno do footer
footerButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
})

// Renderizar os posts


// Paginação


// Barra de pesquisa


// Fitro de produtos


// Abrir e fechar o carrinho


// Renderizar o carrinho


// Abrir o modal de detalhes dos posts


// Renderizar as informações do modal de posts


// Manter itens no carrinho


// Chamado das funções

main();