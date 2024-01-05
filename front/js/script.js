async function getKanapList() {
    return fetch("http://localhost:3000/api/products")
        .then(response => {
            if (response.ok)
                return response.json()
        })
        .then(data => data)
        .catch(error => console.log('Une erreur est survenue: ' + error))
}

function displayKanapList(kanapList) {
    let dynamicHTML = ''


    const container = document.getElementById('items')

    for (const kanap of kanapList) {
        dynamicHTML += `<a href="./product.html?id=${kanap._id}">
        <article>
          <img src="${kanap.imageUrl}" alt="${kanap.altTxt}">
          <h3 class="productName">${kanap.name}</h3>
          <p class="productDescription">${kanap.description}</p>
        </article>
      </a>`
    }

    container.innerHTML = dynamicHTML
}


function main() {
    getKanapList()
        .then(kanapList => displayKanapList(kanapList))
}

main()
