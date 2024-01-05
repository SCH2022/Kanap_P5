let params = new URL(document.location).searchParams;
var id = params.get('orderId');
console.log(id);

//récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL
const urlOrderId = new URLSearchParams(window.location.search).get("orderId");

//si il n'y a pas d'orderId dans l'URL alors on redirige sur la page d'accueil du site
if (id === null || id === "") {
  alert("Une erreur s'est produite lors de la validation de votre commande.");
  window.location.href = "index.html";
}
//else on affiche la confirmation de la commande et le numéro de commande
else {
  const idCommande = document.getElementById("orderId");
  idCommande.innerText = id;
  console.log(idCommande);
}