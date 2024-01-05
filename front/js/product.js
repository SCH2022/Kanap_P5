let cart = [];

getCartFromLocalStorage();// Récupérez le panier depuis le localStorage

function saveCartToLocalStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}



function getCartFromLocalStorage() {// ajouter a cette variable (sans ecraser les données) et ensuite enregistrer le tout.

  const savedCart = localStorage.getItem("cart");

  if (savedCart) {
    const savedCartData = JSON.parse(savedCart);

    for (const item of savedCartData) {
      cart.push(item);
    }
  }
}


const productId = new URLSearchParams(window.location.search).get("id"); // Récupération de l'ID du produit


function addToCart() {
  const selectQuantity = document.getElementById("quantity").value;
  const selectColor = document.getElementById("colors").value;

  if (selectQuantity < 1 || selectQuantity > 100) {
    alert("Veuillez saisir une quantité comprise entre 1 et 100");
  } else {

    // Vérifiez si un produit similaire existe déjà dans le panier
    const existingProduct = cart.find((item) => {
      return item._id === productId && item.color === selectColor;
    });

    if (existingProduct) {
      // Si le produit existe déjà, mettez à jour la quantité au lieu d'ajouter un doublon
      existingProduct.quantity += parseInt(selectQuantity, 10);
    } else {
      // Sinon, ajoutez le produit au panier
      const productToAdd = {
        _id: productId,
        quantity: parseInt(selectQuantity, 10),
        color: selectColor,
      };

      cart.push(productToAdd);
    }

    // Sauvegardez le panier mis à jour dans le localStorage
    saveCartToLocalStorage();

    alert("Le produit a été ajouté au panier avec succès !");
  }
}


// Fonction pour afficher les détails du produit
function displayProduct(product) {
  console.log(product);
  let dynamicHTML = '';
  let productImage = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  // Affichage des couleurs 
  product.colors.forEach((color) => {
    console.log(color);
    document.getElementById("colors").innerHTML += `<option value="${color}">${color}</option>`;
  });

  const container = document.getElementById('item');
  document.getElementById("title").innerText = product.name;
  document.getElementById("price").innerText = product.price;
  document.getElementById("description").innerText = product.description;
  document.querySelector(".item__img").innerHTML = productImage;

  let btn = document.getElementById("addToCart");
  btn.addEventListener("click", addToCart);
}

// Fonction pour obtenir les détails du produit depuis l'API
function getProduct() {
  return fetch(`http://localhost:3000/api/products/${productId}`)
    .then(response => response.json());
}

// Appel de la fonction principale
function main() {
  getProduct()
    .then(product => displayProduct(product));
}

main();




