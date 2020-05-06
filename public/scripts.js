const recipes = document.querySelectorAll('.recipe');

const hidden = document.querySelectorAll('.hide')
const details = document.querySelectorAll('.make')

for (let i = 0; i < recipes.length; i++) {
    recipes[i].addEventListener('click', function () {
      window.location.href = `/details/${i}`;
    });
}
for (let hide of hidden)
    hide.addEventListener('click', function () {

    
})