import { updateLocalStorage, renderCart, updateCount, verifylocalStorage, requestCompanies } from "../../script.js";

let products = []
const cartId = localStorage.getItem("cartDetailId")

if(!cartId){
    window.location.assign("../../index.html");
}

async function renderProduct() {
    try {
        products = await requestCompanies()
        renderProductDetailCard(products)
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
    }
}

function renderProductDetailCard(products){
    const product = products.find(element => element.id == cartId)
    const detailMain = document.querySelector(".app-continer")
    const detailDiv = document.createElement("div")
    const img = document.createElement("img")
    const type = document.createElement("p")
    const name = document.createElement("h1")
    const detail = document.createElement("p")
    const price = document.createElement("h3")
    const backToIndex = document.createElement("a")
    const divInfo = document.createElement("div")

    detailDiv.className = "detailDiv"
    divInfo.className = "divInfo"

    img.src = product.image
    img.onerror = function () {
        img.src = '../../assets/error.jpg';
    };

    img.className = "detailImg"
    name.innerText = product.name
    detail.innerText = product.text
    price.innerText = `R$ ${product.price.toFixed(2)}`
    backToIndex.href = "../../index.html"
    backToIndex.className = "backToIndex"
    backToIndex.innerText = "Continuar comprando"

    divInfo.append(name,detail,price,backToIndex)
    detailDiv.append(img,divInfo)
    detailMain.appendChild(detailDiv)
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

renderProduct()
verifylocalStorage()
renderCart()
updateCount()
updateLocalStorage()
footerButton()
