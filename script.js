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
        setUpSearch(products)
        // setFilterSearch(products)
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
const paginationContainer = document.querySelector(".pagination-container")


// Lógica do retorno do footer
footerButton.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
})

// Renderizar os posts
function renderCards(products, pageIndex) {
    const ul = document.querySelector('.cards-Container');
    const paginationText = document.querySelector(".pagination-text");
    const itemsPerPage = 10; 
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    const pageItems = products.slice(startIndex, endIndex);
    
    if (pageIndex >= totalPages) {
        pageIndex = totalPages -1;
    }
    if (pageIndex < 0) {
        pageIndex = 0;
    }
    
    
    if (totalPages > 1) {
        paginationText.innerText = ` ${pageIndex + 1} de ${totalPages}`;
        paginationText.style.display = "block";
        previusPage.style.display = "block";
        nextPage.style.display = "block"
    }else {
        paginationText.style.display = "none";
        previusPage.style.display = "none";
        nextPage.style.display = "none";
    }
    
    ul.innerHTML = "";
    
    function createProductElement(product) {
        const li = document.createElement('li');
        li.className = 'card';
        
        const img = document.createElement('img');
        img.src = product.image;
        img.alt = "Imagem";
        img.className = "imag";
        img.onerror = function () {
            img.src = "./assets/error.jpg";
        };
        
        const type = document.createElement('div');
        type.className = "typeCard";
        type.innerText = product.type;
        
        const name = document.createElement('h3');
        name.id = "nameCard";
        name.innerText = product.name;
        
        const price = document.createElement('p');
        price.id = "priceCard";
        price.innerText = `R$ ${product.price.toFixed(2)}`;
        
        const detailButton = document.createElement("button");
        detailButton.id = product.id
        detailButton.className = "detail";
        detailButton.innerText = "Detalhes";
        
        const addButton = document.createElement('button');
        addButton.className = "add";
        addButton.innerText = "+";
        addButton.id = product.id;
        
        const divButtons = document.createElement('div');
        divButtons.className = "divButtons";
        divButtons.append(detailButton, addButton);
        
        li.append(img, type, name, price, divButtons);
        
        return li;
    }
    
    for (let i = 0; i < pageItems.length; i++) {
        const productElement = createProductElement(pageItems[i]);
        ul.appendChild(productElement);
    }
    const cardButton = document.querySelectorAll(".detail")
       cardButton.forEach(card => 
        card.addEventListener("click", () => {
        const closeButton = document.querySelector(".details-closeButton")
        cardModal.showModal()
       
        closeButton.addEventListener("click", () => {
            cardModal.close()
        })
        cardModal.addEventListener('click', (event) => {
        if (event.target === cartModal) {
                cartModal.close();
            }
        })
    }))
    
    
}

// Paginação
function setupPagination(products) {
    const totalPages = Math.ceil(products.length / 10); 
    let index = 0;

    const updatePage = (newIndex) => {
        index = (newIndex + totalPages) % totalPages;
        renderCards(products, index);
    };

    nextPage.addEventListener("click", () => {
        updatePage(index + 1);
    });

    previusPage.addEventListener("click", () => {
        updatePage((index - 1 + totalPages) % totalPages);
    });

    // Renderizar a primeira página
    renderCards(products, index);
}




// Barra de pesquisa
function setUpSearch(products){
    const allProducts = products
    search.addEventListener("input", (e) => {
        if(e.target.value == ""){
            renderCards(allProducts,0)
        }
        const filteredProducts = allProducts.filter((element) => element.name.toLowerCase().includes(e.target.value.toLowerCase()))
        renderCards(filteredProducts, 0)
        setupPagination(filteredProducts)
    })
    select.addEventListener("change", (e) => {
        if(e.target.value == ""){
         renderCards(allProducts,0)
        }
        const filteredProductsbyType = allProducts.filter((element) => element.type.toLowerCase().includes(e.target.value.toLowerCase()))
        renderCards(filteredProductsbyType, 0)
        setupPagination(filteredProductsbyType)
    })
}

// Abrir e fechar o carrinho


// Renderizar o carrinho


// Renderizar as informações do modal de posts

// Manter itens no carrinho

// Chamado das funções

main()