const modalFull = document.querySelector('.modal_full');
const recipes = document.querySelectorAll('.recipe')

for (let recipe of recipes) {
    recipe.addEventListener("click", function apear () {
        const courseId = recipe.getAttribute('id');
        modalFull.classList.add('active')

        modalFull.querySelector('.modal').id = courseId
    })
}

modalFull.querySelector('.close_modal').addEventListener("click", function () {
    modalFull.classList.remove('active')
})