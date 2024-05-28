// Requisição

async function requestCompanies() {
    try {
        const response = await fetch(`https://ecommerce-fake-api-two.vercel.app/products`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
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
        renderCards(products,0)
        setupPagination(products)
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

// Variáveis
let cont = 0;
let soma = 0;
let index = 0;
let cart = new Map;

const footerButton = document.querySelector(".footer-button");
const search = document.querySelector(".searchBar");
const select = document.querySelector(".select");
const cartButton = document.querySelector(".cart-Button");
const cartModal = document.querySelector(".cart");
const cardModal = document.querySelector(".details");
const nextPage = document.querySelector(".next")
const previusPage = document.querySelector(".previous")


// Lógica do retorno do footer
footerButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
})

// Renderizar os posts
function renderCards (products, pageIndex) {
    const ul = document.querySelector('.cards-Container');
    const paginationText = document.querySelector(".pagination-text")
    const startIndex = pageIndex * Math.ceil(products.length / 10);
    const endIndex = startIndex + Math.ceil(products.length / 10);
    const pageItems = products.slice(startIndex, endIndex);
    ul.innerHTML = "";

    paginationText.innerText = ` ${index == 0 ? 1 : index + 1} de ${Math.ceil(products.length / 10) }`

    for(let i = 0; i < pageItems.length; i++){
        const li = document.createElement('li');
        li.className = 'card';
        const img = document.createElement('img');
        img.src = pageItems[i].image;
        img.alt = "Imagem";
        img.className = "imag";
        img.onerror = function () {
            img.src = "./assets/error.jpg"
        }
        const type = document.createElement('div');
        type.className = "typeCard";
        type.innerText = pageItems[i].type;
        const name = document.createElement('h3');
        name.id = "nameCard";
        name.innerText = pageItems[i].name;
        const price = document.createElement('p');
        price.id = "priceCard";
        price.innerText = `R$ ${pageItems[i].price.toFixed(2)}`;
        const detailButton = document.createElement("button")
        detailButton.className = "detail"
        detailButton.innerText = "Detalhes"
        const addButton = document.createElement('button');
        addButton.className = "add";
        addButton.innerText = "+";
        addButton.id = pageItems[i].id;
        const divButtons = document.createElement('div')
        divButtons.className = "divButtons"
        divButtons.append(detailButton, addButton)

        li.append(img,type, name, price, divButtons);
        ul.appendChild(li);
    }
}


// Paginação
function setupPagination(products){
    nextPage.addEventListener("click", () => {
        index++
    if(index < 0){
        index = 0
    }else if(index >= Math.ceil(products.length / 10)){
            index = Math.ceil(products.length / 10) - 1
        }
        console.log(index)
    renderCards(products, index)
})

    previusPage.addEventListener("click", () => {
        index--
    if(index < 0){
        index = 0
    }else if(index >= Math.ceil(products.length / 10)){
            index = Math.ceil(products.length / 10) - 1  
        }
        console.log(index)
    renderCards(products, index)
    })
}


// Barra de pesquisa


// Fitro de produtos


// Abrir e fechar o carrinho


// Renderizar o carrinho


// Abrir o modal de detalhes dos posts


// Renderizar as informações do modal de posts


// Manter itens no carrinho


// Chamado das funções

main();