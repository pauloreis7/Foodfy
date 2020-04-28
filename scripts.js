const recipes = document.querySelectorAll('.recipe');

const modalFull = document.querySelector('.modal_full');
const modal = modalFull.querySelector('.modal')
const contents = modal.querySelectorAll('.modal_content')

const maximized = document.querySelector('.maximized')

for (let recipe of recipes) {
    recipe.addEventListener("click", function () {
        modalFull.classList.add('active')
        
        const courseId = recipe.getAttribute('id');
        modal.querySelector('img').src = `assets/${courseId}.png`;

        for (let content of contents) {
            let contentId = content.getAttribute('id')

            if (contentId === courseId) {
                content.classList.add('active')
            } else {
                content.classList.remove('active')
            }
        } 
            modalFull.querySelector('.expand_modal').addEventListener("click", function () {
                maximized.classList.add('maximize')
                modal.classList.add('none')
        
            maximized.querySelector('img').src = `assets/${courseId}.png`;
        })
    })

}

modalFull.querySelector('.close_modal').addEventListener("click", function () {
    modalFull.classList.remove('active')
})

maximized.querySelector('.expand_modal').addEventListener("click", function () {
    maximized.classList.remove('maximize')
    modal.classList.remove('none')
})