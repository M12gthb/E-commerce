let cart = new Map();

async function main() {
    try {
        let products = await requestCompanies();
        renderCards(products, 0);
        setupPagination(products);
        setUpSearch(products);
        verifylocalStorage();
        renderCart();
        footerButton();
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

async function requestCompanies() {
    const ul = document.querySelector(".cards-Container")

    if (window.location.pathname === "/") {
    for(let i = 0; i < 10; i++){
        const product = loaderProductEelement()
        console.log(product)
        ul.appendChild(product)
    }
        try {
            const response = await fetch('https://e-commerce-api-one-tawny.vercel.app/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;

            } else {
                console.error('Erro na resposta:', response.status);
        
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }finally{
            ul.innerHTML = ""
        }
    }else{
        try {
            const response = await fetch('https://e-commerce-api-one-tawny.vercel.app/products', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;

            } else {
                console.error('Erro na resposta:', response.status);
        
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    }
}

function footerButton() {
    const footerButton = document.querySelector('.footer-button');
    footerButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function loaderProductEelement(){
    const li = document.createElement("li")
    const img = document.createElement('div');
    const loader = document.createElement("div")
    const type = document.createElement('div');
    const name = document.createElement('h3');
    const price = document.createElement('p');
    const divButtons = document.createElement('div');
    const detailButton = document.createElement('button');
    const addButton = document.createElement('button');

    li.className = 'card';

    img.className = 'imag';
    loader.className = "loader"
    img.appendChild(loader)

    type.className = 'typeCard';
    type.className = "Carregando...";

    name.id = 'nameCard';
    name.innerText = "Carregando...";

    price.id = 'priceCard';
    price.innerText = "R$ 00.00";

    divButtons.className = 'divButtons';

    detailButton.className = 'detail';
    detailButton.innerText = 'Detalhes';

    addButton.className = 'add';
    addButton.innerText = '+';

    divButtons.append(detailButton, addButton)

    li.append(img, type, name, price, divButtons)

    return li
}

function createProductElement(product) {
    const li = document.createElement('li');
    li.className = 'card';

    const img = document.createElement('img');
    img.src = product.image;
    img.alt = 'Imagem';
    img.className = 'imag';
    img.onerror = function () {
        img.src = './assets/error.jpg';
    };

    const type = document.createElement('div');
    type.className = 'typeCard';
    type.innerText = product.type;

    const name = document.createElement('h3');
    name.id = 'nameCard';
    name.innerText = product.name;

    const price = document.createElement('p');
    price.id = 'priceCard';
    price.innerText = `R$ ${product.price.toFixed(2)}`;

    const detailButton = document.createElement('button');
    detailButton.id = product.id;
    detailButton.className = 'detail';
    detailButton.innerText = 'Detalhes';

    const addButton = document.createElement('button');
    addButton.className = 'add';
    addButton.innerText = '+';
    addButton.id = product.id;

    const divButtons = document.createElement('div');
    divButtons.className = 'divButtons';
    divButtons.append(detailButton, addButton);

    li.append(img, type, name, price, divButtons);

    return li;
}

function renderCards(products, pageIndex) {
    const ul = document.querySelector('.cards-Container');
   
        if(!products){
             ul.innerHTML = "Não foi possivel encontrar os produtos. :("
             return
        }else if (products.length == 0){
            ul.innerHTML = "Não foi possivel encontrar os produtos. :("
            return
        }
    
    const paginationText = document.querySelector('.pagination-text');
    const itemsPerPage = 10;
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = pageIndex * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, products.length);
    const nextPage = document.querySelector('.next');
    const previusPage = document.querySelector('.previous');


    if (pageIndex >= totalPages) {
        pageIndex = totalPages - 1;
    }
    if (pageIndex < 0) {
        pageIndex = 0;
    }

    if (totalPages > 1) {
        paginationText.innerText = ` ${pageIndex + 1} de ${totalPages}`;
        paginationText.style.display = 'block';
        previusPage.style.display = 'block';
        nextPage.style.display = 'block';
    } else {
        paginationText.style.display = 'none';
        previusPage.style.display = 'none';
        nextPage.style.display = 'none';
    }

    ul.innerHTML = '';

    for (let i = 0; i < endIndex - startIndex; i++) {
        const productElement = createProductElement(products[startIndex + i]);
        ul.appendChild(productElement);
    }

    const cardButton = document.querySelectorAll('.detail');
    cardButton.forEach(card => {
        card.addEventListener('click', () => {
            localStorage.setItem("cartDetailId", card.id);
            window.location.assign("Pages/DetailPage/detailPage.html");
        });
    });
    

    const addButton = document.querySelectorAll('.add');
    addButton.forEach(button => {
        button.addEventListener('click', () => {
            const findProduct = products.find(element => element.id == button.id);
            if (findProduct) {
                if (cart.has(findProduct.id)) {
                    const currentItem = cart.get(findProduct.id);
                    currentItem.count += 1;
                    cart.set(findProduct.id, currentItem);
                    renderCart();
                } else {
                    cart.set(findProduct.id, { findProduct: findProduct, count: 1 });
                    renderCart();
                }
                updateLocalStorage();
            }
        });
    });
}

function setupPagination(products) {
    const totalPages = Math.ceil(products.length / 10);
    const nextPage = document.querySelector('.next');
    const previusPage = document.querySelector('.previous');
    let index = 0;

    const updatePage = (newIndex) => {
        index = (newIndex + totalPages) % totalPages;
        renderCards(products, index);
    };

    nextPage.addEventListener('click', () => {
        updatePage(index + 1);
    });

    previusPage.addEventListener('click', () => {
        updatePage((index - 1 + totalPages) % totalPages);
    });

    renderCards(products, index);
}

function setUpSearch(products) {
    const allProducts = products;
    const search = document.querySelector('.searchBar');
    const select = document.querySelector('.select');
    const sort = document.querySelector('.sort');

    search.addEventListener('input', (e) => {
        if (e.target.value === '') {
            renderCards(allProducts, 0);
            setupPagination(allProducts);
        } else {
            const filteredProducts = allProducts.filter((element) => element.name.toLowerCase().includes(e.target.value.toLowerCase()));
            renderCards(filteredProducts, 0);
            setupPagination(filteredProducts);
        }
    });

    select.addEventListener('change', (e) => {
        if (e.target.value === '') {
            renderCards(allProducts, 0);
            setupPagination(allProducts);
        } else {
            const filteredProductsbyType = allProducts.filter((element) => element.type.toLowerCase().includes(e.target.value.toLowerCase()));
            renderCards(filteredProductsbyType, 0);
            setupPagination(filteredProductsbyType);
        }
    });

    sort.addEventListener('change', (e) => {
        if (e.target.value === '') {
            return;
        } else if (e.target.value === 'Ascendente') {
            const sortedProducts = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));
            renderCards(sortedProducts, 0);
            setupPagination(sortedProducts);
        } else if (e.target.value === 'Descendente') {
            const sortedProducts = [...allProducts].sort((a, b) => b.name.localeCompare(a.name));
            renderCards(sortedProducts, 0);
            setupPagination(sortedProducts);
        }
    });
}

function renderCart() {
    const ul = document.querySelector(".cart-ul");
    const cartButton = document.querySelector(".cart-Button");
    const cartModal = document.querySelector(".cart");
    const closeButton = document.querySelector(".cart-closeButton");
    const totalPrice = document.createElement("h1")
    const totalCount = document.createElement("h1")
    const totalItens = document.querySelector(".cartCont")
    const removeAllButton = document.createElement("button")
    const cartCount = document.querySelector(".cartCont")

    cartButton.addEventListener("click", () => {
        cartModal.showModal();

        closeButton.addEventListener("click", () => {
            cartModal.close();
        });
        cartModal.addEventListener('click', (event) => {
            if (event.target === cartModal) {
                cartModal.close();
            }
        });
    });

    ul.innerHTML = "";

    if (cart.size == 0) { 
        const title = document.createElement("h1")
        title.innerText = "Carrinho"
        totalItens.innerHTML = ""
        cartCount.style.display = "none"
        return ul.appendChild(title)
    }
    else{
        cartCount.style.display = "block"
        totalItens.innerText = `${Array.from(cart.values()).reduce((acc, item)=> {
            return acc + item.count
        },0)}`
        totalPrice.innerText = `Total: R$ ${Array.from(cart.values()).reduce((acc, item)=> {
            return acc + (item.count * item.findProduct.price)
        },0).toFixed(2)}`
        totalCount.innerText = `Quantidade: ${Array.from(cart.values()).reduce((acc, item)=> {
            return acc + item.count
        },0)}`
        ul.append(totalPrice, totalCount)
    }

    Array.from(cart.values()).forEach((element) => {
        let li = document.getElementById(`cart-item-${element.findProduct.id}`);
        
        if (!li) {
            li = document.createElement("li");
            li.id = `cart-item-${element.findProduct.id}`;
            
            const img = document.createElement("img");
            img.src = element.findProduct.image;
            img.alt = element.findProduct.name
            
            const title = document.createElement("h3");
            title.innerText = element.findProduct.name;
            
            const decrement = document.createElement("button");
            decrement.id = element.id
            decrement.innerText = "-";
            
            const count = document.createElement("p");
            count.innerText = element.count;
            count.className = "count";

            const increment = document.createElement("button");
            increment.id = element.id
            increment.innerText = "+";
            
            const remove = document.createElement("button");
            remove.id = element.id
            remove.innerText = "Remove";
            
            decrement.addEventListener("click", () => updateCount(element.findProduct.id, -1, cart));
            increment.addEventListener("click", () => updateCount(element.findProduct.id, 1, cart));
            remove.addEventListener("click", () => removeItem(element.findProduct.id, cart));
            removeAllButton.innerText = "Remover tudo";
            removeAllButton.addEventListener("click", () => removeAllCart(cart));
            
            
            li.append(img, title, decrement, count, increment, remove);
            ul.append(li, removeAllButton); 
        } else {
            li.querySelector(".count").innerText = element.count;
        }
    });

    if (cart.size > 0){
        const finalbuyer = document.createElement("a")
        finalbuyer.innerText = "Finalizar Compra"
        finalbuyer.href = "/Pages/PaymentPage/paymentPage.html"
        if (window.location.pathname === "/Pages/DetailPage/detailPage.html") {
            finalbuyer.href = "../PaymentPage/paymentPage.html"
        }
        
        ul.appendChild(finalbuyer)
    }
}

function updateCount(productId, change, cart) {
    if (cart.has(productId)) {
        const currentItem = cart.get(productId);
        currentItem.count += change;
        
        if (currentItem.count <= 0) {
            cart.delete(productId);
        } else {
            cart.set(productId, currentItem);
        }
        renderCart(cart); 
    }
    updateLocalStorage()
}

function removeItem(productId, cart) {
    cart.delete(productId);
    renderCart(cart); 
    updateLocalStorage()
}

function removeAllCart(cart) {
    cart.clear();
    updateLocalStorage();
    renderCart()
}

function verifylocalStorage() {
    const verification = localStorage.getItem("cart");

    if (!verification || verification == "") {
        cart = new Map();
    } else {
        const storedCart = JSON.parse(verification);
        cart = new Map(Object.entries(storedCart).map(([key, value]) => [parseInt(key), value]));
    }
}

function updateLocalStorage() {
    const cartObject = Object.fromEntries(cart);
    localStorage.setItem("cart", JSON.stringify(cartObject));
}

main()

export {verifylocalStorage, updateCount, updateLocalStorage, renderCart, requestCompanies, removeItem};

