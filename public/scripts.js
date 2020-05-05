const recipes = document.querySelectorAll('.recipe');

for (let recipe of recipes) {
    recipe.addEventListener("click", function () {
        const recipePosition = recipes[recipe]

        window.location.href = `http://localhost:5000/details/${recipe}`
    })

}