const API = "http://localhost:3000/api/products/";
let apiData;

let data;
fetch(`http://localhost:3000/api/products/`)
  .then(response =>
    response.json())
  .then(productData => {
    data = productData; // Affecter les données à la variable data
  })

  .catch(error => {
    console.error("Erreur lors de la récupération du produit :", error);
  });

// recupération des produits dans le Local Storage
function getCart() {
  let productsInLocalStorage = JSON.parse(localStorage.getItem("cart"));
  if (productsInLocalStorage == null) {
    return [];
  } else {
    return productsInLocalStorage;
  }
}
console.log(getCart());

//click EventListener pour chaque deleteItem (classe "deleteItem")
const deletes = [...document.getElementsByClassName("deleteItem")];
deletes.forEach(del => {
  del.addEventListener("click", deleteItem);
});

function logCartItem(item) {
  console.log(`ID du produit : ${item._id}`);
  console.log(`Nom du produit : ${item.name}`);
  console.log(`Couleur du produit : ${item.color}`);
  console.log(`Prix du produit : ${item.price}€`);
  console.log(`Quantité du produit : ${item.qtty}`);
}

getKanapList()
  .then(kanapList => {
    kanapList.forEach(product => {
      const idProduct = product._id;
      const ClrProduct = product.color;
      const qttyProduct = 10;


      // utilisation de la fonction logCartItem pour afficher les détails du produit
      logCartItem({
        _id: idProduct,
        name: product.name,
        color: ClrProduct,
        price: product.price,
        qtty: qttyProduct,
      });
    });
  })
  .catch(error => {
    console.error("Erreur lors de la récupération des produits :", error);
  });

function getKanapList() {
  // récupérer à partir du panier depuis le Local Storage
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  console.log("CART", cart);
  return fetch("http://localhost:3000/api/products/")
    .then(response => response.json())
    .then(data => {
      apiData = data


      const productInCart = cart.map(item => {
        const _id = item._id
        //const color = item.color

        const product = data.find(product => {
          return product._id === _id
        });

        const obj = Object.assign({}, item, product);
        console.log(obj);
        return obj;
      });


      productInCart.forEach(product => {
        if (product) {
          const blocHTML = `
                  <article class="cart__item" data-id="${product._id} ${product.color}">
                  <div class="cart__item__img">
                    <img src="${product.imageUrl}" alt="${product.altTxt}">
                  </div>
                  <div class="cart__item__content">
                    <div class="cart__item__content__titlePrice">
                      <h2>${product.name}, ${product.color}</h2>
                      <p>${product.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                      <div class="cart__item__content__settings__quantity">
                        <p>Qté :</p>
                        <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                      </div>
                      <div class="cart__item__content__settings__delete">
                        <p class="deleteItem">Supprimer</p>
                      </div>
                    </div>
                  </div>
                </article>
              `;


          // Utilisation de innerHTML pour ajouter le bloc HTML au panier
          document.getElementById("cart__items").innerHTML += blocHTML;
        }

        // mettre à jour l'affichage du panier
        updateTotalPriceDisplay(productInCart);
      });
      //creation eventlistener suppression
      testdelete()

      //listener pour changer la quantité
      const quantityInputs = [...document.getElementsByClassName("itemQuantity")];
      console.log("changement de quantité", quantityInputs);
      quantityInputs.forEach(input => {
        console.log("INPUT",)
        input.addEventListener("change", changeQuantity);
        console.log("changement de quantité");
      });

      return data;
    })
    .catch(error => {
      console.error("Erreur lors de la récupération des produits depuis l'API :", error);
      throw error;
    });
}

// fonction affichage du prix total
function updateTotalPriceDisplay(cart) {
  const totalQuantityElement = document.getElementById("totalQuantity");
  const totalPriceElement = document.getElementById("totalPrice");
  // retrouver prix des canapés du localstorage
  const productInCart = cart.map(item => {
    const _id = item._id
    //const color = item.color

    const product = apiData.find(product => {
      return product._id === _id
    });

    const obj = Object.assign({}, item, product);
    console.log(obj);
    return obj;
  })
  const totalQuantity = cart.reduce((total, item) => total += parseInt(item.quantity), 0);//accumulateur
  const totalPrice = calculateTotalPrice(productInCart);

  totalQuantityElement.textContent = totalQuantity;
  totalPriceElement.textContent = totalPrice + "";

}// récupération du panier 
let cart = getCart();

// fonction calculer le prix total du panier
function calculateTotalPrice(cart) {
  return cart.reduce((total, item) => total += (parseFloat(item.quantity) * parseFloat(item.price)) || 0, 0);
}

// supprimer un produit du panier (classe "deleteItem")
function deleteItem(itemId) {
  const [id, color] = itemId.split(' ');


  // Utilisation de la méthode find pour trouver l'élément correspondant
  const itemInCart = cart.find(item => item._id === id && item.color === color);

  cart = cart.filter(item => item._id !== id || item.color !== color);
  // mise à jour du panier dans le Local Storage
  localStorage.setItem('cart', JSON.stringify(cart));
  // mise à jour du prix total après la suppression
  updateTotalPriceDisplay(cart);
}

// event listener pour supprimer un article
function testdelete() {
  const deleteItems = document.querySelectorAll('.deleteItem');
  deleteItems.forEach(item => {
    item.addEventListener('click', () => {
      const cartItem = item.closest('.cart__item');
      console.log("cartItem", cartItem)
      const itemId = cartItem.getAttribute('data-id');
      console.log("itemId", itemId)
      deleteItem(itemId);
      cartItem.remove();
      console.log('Article supprimé du panier');
    });
  });
}

//let cart = getCart();
console.log(cart);

// fonction pour changer la quantité d'un produit
function changeQuantity(e) {
  const newQuantity = parseInt(e.target.value);
  if (newQuantity >= 1 && newQuantity <= 100) {
    const itemId = e.target.parentElement.parentElement.parentElement.parentElement.dataset.id;
    const [id, color] = itemId.split(' ');

    const itemInCart = cart.find(item => item._id === id && item.color === color);

    if (itemInCart) {
      itemInCart.quantity = newQuantity;
      // mettre à jour le panier dans le Local Storage
      localStorage.setItem('cart', JSON.stringify(cart));

      // mettre à jour le prix total
      updateTotalPriceDisplay(cart);
      console.log("Quantity Updated");
    }
  } else {
    alert("Quantité non valide!");
  }
}

async function sendOrderToAPI(orderData) {
  const url = "http://localhost:3000/api/products/order";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP! Statut : ${response.status}`);
    }

    const orderConfirmation = await response.json();
    handleOrderConfirmation(orderConfirmation);
  } catch (error) {
    console.error("Erreur lors de l'envoi de la commande :", error);
  }
}

async function handleOrderConfirmation(orderConfirmation) {
  // Vérifier si la commande a été traitée avec succès
  if (orderConfirmation && orderConfirmation.orderId) {
    // Vider le panier dans le localStorage
    localStorage.removeItem("cart");

    // Vider le formulaire (supprimer les valeurs des champs)
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("address").value = "";
    document.getElementById("city").value = "";
    document.getElementById("email").value = "";

    // Rediriger vers la page de confirmation avec l'ID de commande
    window.location.href = `./confirmation.html?orderId=${orderConfirmation.orderId}`;
  } else {
    // Afficher un message d'erreur en cas d'échec du traitement de la commande
    console.error("Erreur lors de la confirmation de la commande. Veuillez réessayer.");
  }
}

// récupération des éléments du formulaire
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const addressInput = document.getElementById("address");
const cityInput = document.getElementById("city");
const emailInput = document.getElementById("email");

// recupération de l'élément "order"
const orderButton = document.getElementById("order");

// event listener pour le bouton "commander"
orderButton.addEventListener("click", function (event) {
  event.preventDefault();


  // Récupération des valeurs du formulaire
  const firstName = firstNameInput.value;
  const lastName = lastNameInput.value;
  const address = addressInput.value;
  const city = cityInput.value;
  const email = emailInput.value;

  // Expressions régulières (regex)
  const nameRegex = /^[a-zA-ZÀ-ÖØ-öø-ÿ-]+(?: [a-zA-ZÀ-ÖØ-öø-ÿ-]+)*$/;
  const addressRegex = /^[a-zA-Z0-9\s,'-]*$/;
  const cityRegex = /^[a-zA-Z\s,'-]*$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation des champs
  if (nameRegex.test(firstName)) {
    console.log('Prénom valide');
  } else {
    console.log('Prénom invalide');
    document.getElementById("firstNameErrorMsg").innerText = "Champ invalide";
  }

  if (nameRegex.test(lastName)) {
    console.log('Nom valide');
  } else {
    console.log('Nom invalide');
    document.getElementById("lastNameErrorMsg").innerText = "Champ invalide";
  }

  if (addressRegex.test(address)) {
    console.log('Adresse valide');
  } else {
    console.log('Adresse invalide');
    document.getElementById("addressErrorMsg").innerText = "Champ invalide";
  }

  if (cityRegex.test(city)) {
    console.log('Ville valide');
  } else {
    console.log('Ville invalide');
    document.getElementById("cityErrorMsg").innerText = "Champ invalide";
  }

  if (emailRegex.test(email)) {
    console.log('Email valide');
  } else {
    console.log('Email invalide');
    document.getElementById("emailErrorMsg").innerText = "Champ invalide";
  }

  // Validation des champs
  validateField(firstName, nameRegex, "firstNameErrorMsg", "Prénom");
  validateField(lastName, nameRegex, "lastNameErrorMsg", "Nom");
  validateField(address, addressRegex, "addressErrorMsg", "Adresse");
  validateField(city, cityRegex, "cityErrorMsg", "Ville");
  validateField(email, emailRegex, "emailErrorMsg", "Email");


  function extractId(cartvalue) {
    const tableauIds = cartvalue.map(element => element._id);
    return tableauIds;
  }

  const orderData = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: extractId(cart),

  };

  // envoyer la commande à l'API 
  sendOrderToAPI(orderData);


  // Fonction pour valider un champ avec une expression régulière
  function validateField(value, regex, errorMsgId, fieldName) {
    if (regex.test(value)) {
      console.log(`${fieldName} valide`);
      document.getElementById(errorMsgId).innerText = "";
    } else {
      console.log(`${fieldName} invalide`);
      document.getElementById(errorMsgId).innerText = `Champ ${fieldName} invalide`;
    }
  }
});

