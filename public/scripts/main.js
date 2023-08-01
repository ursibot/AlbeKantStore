// cart open and close
let cartIcon = document.querySelector('#cartIcon');
let cart = document.querySelector('.cart');
let closeCart = document.querySelector('#closeCart');
// open cart
cartIcon.onclick = () => {
    cart.classList.add("active");
};
// close cart
closeCart.onclick = () => {
    cart.classList.remove("active");
};

// add to cart
// working cart
if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", ready);
} else {
    ready();
}
// functions
function ready() {
    // remove from cart
    let cartRemoverButtons = document.getElementsByClassName("cartRemover");
    for (let i = 0; i < cartRemoverButtons.length; i++) {
        let button = cartRemoverButtons[i];
        button.addEventListener("click", removeCartItem);
    }
    // change quantity
    let quantityInputs = document.getElementsByClassName("cartQuantity");
    for (let i = 0; i < quantityInputs.length; i++) {
        let input = quantityInputs[i];
        input.addEventListener("change", quantityChanged);
    }
    // adding to cart
    let addToCart = document.getElementsByClassName("addCart");
    for (let i = 0; i < addToCart.length; i++) {
        let button = addToCart[i];
        button.addEventListener("click", addToCartClicked);
    }
    loadCartItems();
}

function removeCartItem(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updatetotal();
    saveCartItems();
}

function quantityChanged(event) {
    var input = event.target;
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addToCartClicked(event) {
    let button = event.target;
    let shopItem = button.parentElement;
    let title = shopItem.getElementsByClassName("productTitle")[0].innerText;
    let price = shopItem.getElementsByClassName("price")[0].innerText;
    let img = shopItem.getElementsByClassName("productImg")[0].src;
    addItemToCart(title, price, img);
    updatetotal();
    saveCartItems();
    updateCartIcon();
}

function addItemToCart(title, price, img) {
    let cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cartBox");
    let cartItems = document.getElementsByClassName("cartContent")[0];
    let cartItemsNames = cartItems.getElementsByClassName("cartItemTitle");
    for (let i = 0; i < cartItemsNames.length; i++) {
        if (cartItemsNames[i].innerText == title) {
            alert("You have already added this item to your cart.");
            return;
        }
    }
    let cartBoxContent = `
    <img src="${img}" alt="" class="cartImg"/>
    <div class="detailBox">
        <div class="cartItemTitle">${title}</div>
        <div class="cartPrice">${price}</div>
        <input 
          type="number"
          name="" 
          id="" 
          value="1" 
          class="cartQuantity"
        />
    </div>
    <i class="bi bi-trash3-fill cartRemover"></i>`;
    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);
    cartShopBox
      .getElementsByClassName("cartRemover")[0]
      .addEventListener("click", removeCartItem);
    cartShopBox
      .getElementsByClassName("cartQuantity")[0]
      .addEventListener("change", quantityChanged);
    saveCartItems();
    updateCartIcon();
}

/*function updatetotal() {
    let cartContents = document.getElementsByClassName("cartContent")[0];
    let cartBoxes = cartContents.getElementsByClassName("cartBox");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName("cartPrice")[0];
        let quantityElement = cartBox.getElementsByClassName("cartQuantity")[0]; 
        let price = parseFloat(priceElement.innerText.replace("$", ""));
        let quantity = quantityElement.value;
        total += price * quantity;

        total = Math.round(total * 100) / 100;
        document.getElementsByClassName("totalPrice")[0].innerText = "$" + total;
    }
}*/

function updatetotal() {
    let cartContents = document.getElementsByClassName("cartContent")[0];
    let cartBoxes = cartContents.getElementsByClassName("cartBox");
    let total = 0;
    for (let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let priceElement = cartBox.getElementsByClassName("cartPrice")[0];
        let quantityElement = cartBox.getElementsByClassName("cartQuantity")[0]; 
            if (priceElement && quantityElement) {
                let price = parseFloat(priceElement.innerText.replace("$", ""));
                let quantity = quantityElement.value;
                total += price * quantity;
            }
        }
        total = Math.round(total * 100) / 100;
        document.getElementsByClassName("totalPrice")[0].innerText = "$" + total;
        // save total to localstorage
        localStorage.setItem("cartTotal", total);
    }

// localstorage when refreshing the page
function saveCartItems() {
    let cartContents = document.getElementsByClassName("cartContent")[0];
    let cartBoxes = cartContents.getElementsByClassName("cartBox");
    let cartItems = [];

    for (let i = 0; i < cartBoxes.length; i++) {
        cartBox = cartBoxes[i];
        let titleElement = cartBox.getElementsByClassName("cartItemTitle")[0];
        let priceElement = cartBox.getElementsByClassName("cartPrice")[0];
        let quantityElement = cartBox.getElementsByClassName("cartQuantity")[0];
        let productImg = cartBox.getElementsByClassName("cartImg")[0].src;

        let item = {
            title: titleElement.innerText,
            price: priceElement.innerText,
            quantity: quantityElement.value,
            productImg: productImg,
        };
        cartItems.push(item);
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    updateCartIcon();
}
// loads in cart
function loadCartItems() {
    let cartItems = localStorage.getItem("cartItems");
    if (cartItems) {
        cartItems = JSON.parse(cartItems);

        for (let i = 0; i < cartItems.length; i++) {
            let item = cartItems[i];
            addItemToCart(item.title, item.price, item.productImg);

            let cartBoxes = document.getElementsByClassName("cartBox");
            let cartBox = cartBoxes[cartBoxes.length - 1];
            let quantityElement = cartBox.getElementsByClassName("cartQuantity")[0];
            quantityElement.value = item.quantity;
        }
    }
    let cartTotal = localStorage.getItem("cartTotal");
    if (cartTotal) {
        document.getElementsByClassName("totalPrice")[0].innerText = 
            "$" + cartTotal;
    }
    updateCartIcon();
}
// quantity in the cart icon
function updateCartIcon() {
    let cartBoxes = document.getElementsByClassName("cartBox");
    let quantity = 0;

    for(let i = 0; i < cartBoxes.length; i++) {
        let cartBox = cartBoxes[i];
        let quantityElement = cartBox.getElementsByClassName("cartQuantity")[0];
        quantity += parseInt(quantityElement.value);
    }
    let cartIcon = document.querySelector("#cartIcon");
    cartIcon.setAttribute("data-quantity", quantity);
}

// clearing the cart after successful payment
function clearCart() {
    let cartContent = document.getElementsByClassName("cartContent")[0];
    cartContent.innerHTML = "";
    updatetotal();
    localStorage.removeItem("cartItems");
}



// modals
// get modal, informationIconButton, <span> closer
let modal = document.querySelector(".modal");
let informationIconButton = document.querySelector(".informationModal");
let closer = document.querySelector("#closer");

// make icon open modal
informationIconButton.onclick = () => {
    modal.style.display = "block";
}
// make closer close modal
closer.onclick = () => {
    modal.style.display ="none";
}
// window click to close too
window.onclick = function (event) {
    if (event.target === modal) {
    modal.style.display = "none";
    }
}
