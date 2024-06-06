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
    const detailMain = document.querySelector(".detail-Container")
    const img = document.createElement("img")
    const type = document.createElement("p")
    const name = document.createElement("h1")
    const detail = document.createElement("hp")
    const price = document.createElement("p")
    const backToIndex = document.createElement("a")

    img.src = product.image
    type.innerText = product.type
    name.innerText = product.name
    detail.innerText = product.text
    price.innerText = `R$ ${product.price.toFixed(2)}`
    backToIndex.href = "../../index.html"
    backToIndex.innerText = "Voltar"

    detailMain.append(img,type,name,detail,price,backToIndex)

}


renderProduct()
verifylocalStorage()
renderCart()
updateCount()
updateLocalStorage()
