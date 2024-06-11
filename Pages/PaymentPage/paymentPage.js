import { updateLocalStorage, updateCount, verifylocalStorage, requestCompanies } from "../../script.js";

let cartStorage = localStorage.getItem("cart");
const cart = new Map();

if(cartStorage && cartStorage.length > 0){
    const storedCart = JSON.parse(cartStorage);
    Object.entries(storedCart).forEach(([key, value]) => cart.set(parseInt(key), value));
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('expiryDate').addEventListener('input', function(event) {
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

    document.getElementById('cardNumber').addEventListener('input', function(event) {
        let input = event.target.value;
        input = input.replace(/\D/g, '');
        if (input.length > 16) {
            input = input.slice(0, 16);
        }
        input = input.match(/.{1,4}/g)?.join(' ') || input;
        event.target.value = input;
    });

    document.getElementById('cvv').addEventListener('input', function(event) {
        let input = event.target.value;
        input = input.replace(/\D/g, '');
        if (input.length > 3) {
            input = input.slice(0, 3);
        }
        event.target.value = input;
    });

    document.getElementById('paymentForm').addEventListener('submit', function(event) {
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
            document.getElementById('expiryDateError').textContent = 'Formato da data de expiração deve ser MM/AA.';
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
});

function renderCartDetails() {
    const container = document.querySelector(".paymentList-container");
    container.innerHTML = ''; 

    if (cart.size === 0) {
        const h1 = document.createElement("h1");
        const back = document.createElement("a");
        back.href = "/";
        back.innerHTML = "Voltar";
        h1.innerText = "Adicione itens ao carrinho";
        container.append(h1, back);
    } else {
        const title = document.createElement("h1")
        const totalPrice = document.createElement("p");
        const totalToPay = document.createElement("p")
        const list = document.createElement("ul")
        const hr = document.createElement("hr")

        title.innerText = "Itens do carrinho"
        totalToPay.innerText = "Total:"
        totalPrice.innerText = `R$ ${Array.from(cart.values()).reduce((acc, item) => {
            return acc + (item.count * item.findProduct.price);
        }, 0).toFixed(2)}`;
        container.append(title,list,hr,totalToPay,totalPrice);
    }
}

verifylocalStorage();
updateLocalStorage();
renderCartDetails();
