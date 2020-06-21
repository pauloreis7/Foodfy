//UserDetails
const recipes = document.querySelectorAll(".recipe")

for ( recipe of recipes) {
  const recipeId = recipe.getAttribute('id')

  recipe.addEventListener("click", function () {
      window.location.href = `details/${ recipeId }`
  })
}

//showAndhide
const hidden = document.querySelectorAll('.hide')
const details = document.querySelectorAll('.make')

for (let i = 0; i < hidden.length; i++) {
  hidden[i].addEventListener("click", function() {
    if (hidden[i].textContent == "ESCONDER") {
      hidden[i].textContent = "Mostrar";
      details[i].classList.add("none");
    }
    else {
      hidden[i].textContent = "ESCONDER";
      details[i].classList.remove("none");
    }
  })
}

//MenuUser
const page = location.pathname

const menuItens = document.querySelectorAll("header a")
for ( item of menuItens) {
  let link = item.getAttribute("href").slice(1)
  let currentPage = page.slice(1)

  if (link == currentPage || link =="" && currentPage=="loob") {
    item.classList.add("home")
  }
}