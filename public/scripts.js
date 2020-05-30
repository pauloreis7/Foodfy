const recipes = document.querySelectorAll('.recipe');

const hidden = document.querySelectorAll('.hide')
const details = document.querySelectorAll('.make')

//View by user
for (let i = 0; i < recipes.length; i++) {
  recipes[i].addEventListener('click', function () {
    window.location.href = `/details/${i}`;
  });
}

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

//View by admin
const views = document.querySelectorAll("#view")

for (let i = 0; i < views.length; i++) {
    views[i].addEventListener('click', function () {
      window.location.href = `/admin/${i}`;
    });
}