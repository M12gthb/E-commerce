let cartStorage = localStorage.getItem("cart");
let cart = new Map();

if (cartStorage && cartStorage.length > 0) {
    const storedCart = JSON.parse(cartStorage);
    Object.entries(storedCart).forEach(([key, value]) => cart.set(parseInt(key), value));
}

function verifylocalStoragePay() {
    const verification = localStorage.getItem("cart");

    if (!verification || verification == "") {
        cart = new Map();
    } else {
        const storedCart = JSON.parse(verification);
        cart = new Map(Object.entries(storedCart).map(([key, value]) => [parseInt(key), value]));
    }
}

function updateLocalStoragePay() {
    const cartObject = Object.fromEntries(cart);
    localStorage.setItem("cart", JSON.stringify(cartObject));
}

document.addEventListener('DOMContentLoaded', function () {
    const expiryDateElement = document.getElementById('expiryDate');
    if (expiryDateElement) {
        expiryDateElement.addEventListener('input', function (event) {
            let input = event.target.value;
            input = input.replace(/\D/g, '');
            if (input.length > 4) {
                input = input.slice(0, 4);
            }
            if (input.length >= 3) {
                input = `${input.slice(0, 2)}/${input.slice(2, 4)}`;
            } else if (input.length >= 2) {
                input = `${input.slice(0, 2)}/${input.slice(2)}`;
            }
            event.target.value = input;
        });
    }

    const cardNumberElement = document.getElementById('cardNumber');
    if (cardNumberElement) {
        cardNumberElement.addEventListener('input', function (event) {
            let input = event.target.value;
            input = input.replace(/\D/g, '');
            if (input.length > 16) {
                input = input.slice(0, 16);
            }
            input = input.match(/.{1,4}/g)?.join(' ') || input;
            event.target.value = input;
        });
    }

    const cvvElement = document.getElementById('cvv');
    if (cvvElement) {
        cvvElement.addEventListener('input', function (event) {
            let input = event.target.value;
            input = input.replace(/\D/g, '');
            if (input.length > 3) {
                input = input.slice(0, 3);
            }
            event.target.value = input;
        });
    }

    const paymentFormElement = document.getElementById('paymentForm');
    if (paymentFormElement) {
        paymentFormElement.addEventListener('submit', function (event) {
            event.preventDefault();

            let isValid = true;

            document.querySelectorAll('.error').forEach(error => error.textContent = '');

            const name = document.getElementById('name').value;
            if (name.length < 3) {
                isValid = false;
                document.getElementById('nameError').textContent = 'Nome deve ter pelo menos 3 caracteres.';
            }

            const email = document.getElementById('email').value;
            if (!email.includes('@')) {
                isValid = false;
                document.getElementById('emailError').textContent = 'Por favor, insira um email válido.';
            }

            const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
            if (!/^\d{16}$/.test(cardNumber)) {
                isValid = false;
                document.getElementById('cardNumberError').textContent = 'Número do cartão deve ter 16 dígitos.';
            }

            const expiryDate = document.getElementById('expiryDate').value;
            if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
                isValid = false;
                document.getElementById('expiryDateError').textContent = 'Data de expiração deve ser MM/AA.';
            }

            const cvv = document.getElementById('cvv').value;
            if (!/^\d{3}$/.test(cvv)) {
                isValid = false;
                document.getElementById('cvvError').textContent = 'CVV deve ter 3 dígitos.';
            }

            if (isValid) {
                alert('Pagamento realizado com sucesso!');
                localStorage.removeItem("cart");
                window.location.replace("/");
            }
        });
    }
});

function updateCountPay(productId, change, cart) {
    if (cart.has(productId)) {
        const currentItem = cart.get(productId);
        currentItem.count += change;

        if (currentItem.count <= 0) {
            cart.delete(productId);
        } else {
            cart.set(productId, currentItem);
        }
    }
    updateLocalStoragePay();
    renderCartDetails();
}

function removeItemPay(productId, cart) {
    cart.delete(productId);
    updateLocalStoragePay();
    renderCartDetails();
}

function removeAll(cart) {
    cart.clear();
    updateLocalStoragePay();
    renderCartDetails();
}

function renderCartDetails() {
    const container = document.querySelector(".paymentList-container");
   
    container.innerHTML = '';

    if (cart.size === 0) {
        const h1 = document.createElement("h1");
        const back = document.createElement("a");
        back.href = "/";
        back.innerHTML = "Continuar Comprando";
        h1.innerText = "Adicione itens ao carrinho";
        container.append(h1, back);
    } else {
        const title = document.createElement("h1");
        const div = document.createElement("div")
        const totalPrice = document.createElement("p");
        const totalToPay = document.createElement("p");
        const list = document.createElement("ul");
        const hr = document.createElement("hr");
        const removeAllButton = document.createElement("button");
        const back = document.createElement("a");
        back.href = "/";
        back.innerHTML = "Continuar Comprando";
        div.className = "hrDiv"


        Array.from(cart.values()).forEach((element) => {
            let li = document.getElementById(`cart-item-${element.findProduct.id}`);

            if (!li) {
                li = document.createElement("li");
                const divInfos = document.createElement("div")
                divInfos.className = "divInfos"
                const divIDC = document.createElement("div")
                divIDC.className = "divIDC"
                const divIDCR = document.createElement("div")
                divIDCR.className = "divIDCR"
                li.id = `cart-item-${element.findProduct.id}`;

                const img = document.createElement("img");
                img.src = element.findProduct.image;
                img.alt = element.findProduct.name;
                img.className = "imgItem"
                img.onerror = function () {
                    img.src = '../../assets/error.jpg';
                };

                const title = document.createElement("h3");
                title.innerText = element.findProduct.name;

                const decrement = document.createElement("button");
                decrement.id = element.id;
                decrement.innerText = "-";

                const count = document.createElement("p");
                count.innerText = element.count;
                count.className = "count";

                const increment = document.createElement("button");
                increment.id = element.id;
                increment.innerText = "+";

                const remove = document.createElement("button");
                remove.id = element.id;
                remove.innerText = "Remover";

                decrement.addEventListener("click", () => updateCountPay(element.findProduct.id, -1, cart));
                increment.addEventListener("click", () => updateCountPay(element.findProduct.id, 1, cart));
                remove.addEventListener("click", () => removeItemPay(element.findProduct.id, cart));

                divInfos.append(img, title)
                divIDC.append(decrement, count, increment)
                divIDCR.append(divIDC, remove)

                li.append(divInfos, divIDCR);
                list.appendChild(li);
            } else {
                li.querySelector(".count").innerText = element.count;
            }
        });

        removeAllButton.innerText = "Remover tudo";
        removeAllButton.addEventListener("click", () => removeAll(cart));

        title.innerText = "Itens do carrinho";
        const divTotal = document.createElement("div")
        const divBack = document.createElement("div")
        divTotal.className = "divTotal"
        divBack.className = "divBack"
        totalToPay.innerText = "Total:";
        totalPrice.innerText = `R$ ${Array.from(cart.values()).reduce((acc, item) => {
            return acc + (item.count * item.findProduct.price);
        }, 0).toFixed(2)}`;
        divTotal.append(totalToPay, totalPrice)
        divBack.append(removeAllButton, back)
        
        container.append(title, div, list, hr, divTotal, divBack);
    }
}

function footerButton() {
    const footerButton = document.querySelector('footer');
    footerButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

verifylocalStoragePay();
renderCartDetails();
footerButton()
