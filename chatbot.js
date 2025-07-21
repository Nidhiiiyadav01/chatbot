document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    fetchRecipe(message);
    input.value = "";
  }
});

function addMessage(sender, content) {
  const chatBody = document.getElementById("chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = content;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function fetchRecipe(ingredient) {
  addMessage("bot", "🔄 Loading recipes, please wait...");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals && data.meals.length > 0) {
        // Get first 2 meals (to show more than one recipe)
        const mealIds = data.meals.slice(0, 2).map((meal) => meal.idMeal);
        mealIds.forEach((id) => getMealDetails(id));
      } else {
        addMessage("bot", "❌ Sorry, I couldn't find any recipes for those ingredients. 🍽️");
      }
    })
    .catch((err) => {
      console.error(err);
      addMessage("bot", "⚠️ Error fetching recipe.");
    });
}

function getMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
      const meal = data.meals[0];

      // Build ingredients list
      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredientsList += `<li>${measure} ${ing}</li>`;
        }
      }

      const recipeCard = `
        <div class="recipe-card">
          <h3>🍽️ ${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img"/>
          <strong>📝 Ingredients:</strong>
          <ul>${ingredientsList}</ul>
          <strong>📖 Instructions:</strong>
          <p>${meal.strInstructions}</p>
        </div>
      `;
      addMessage("bot", recipeCard);
    })
    .catch((err) => {
      console.error(err);
      addMessage("bot", "⚠️ Failed to load recipe details.");
    });
}













