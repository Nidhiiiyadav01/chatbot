document.getElementById("send-btn").addEventListener("click", () => {
  const input = document.getElementById("user-input");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    fetchRecipe(message);
    input.value = "";
  }
});

function addMessage(sender, text) {
  const chatBody = document.getElementById("chat-body");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function fetchRecipe(ingredient) {
  addMessage("bot", "Loading recipe... 🍳");

  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then(res => res.json())
    .then(data => {
      if (data.meals) {
        const meal = data.meals[0];
        getMealDetails(meal.idMeal);
      } else {
        addMessage("bot", "Sorry, I couldn't find any recipes for those ingredients. 🍽️");
      }
    })
    .catch(err => {
      console.error(err);
      addMessage("bot", "Oops! Something went wrong.");
    });
}

function getMealDetails(id) {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(data => {
      const meal = data.meals[0];

      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ing = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ing && ing.trim()) {
          ingredientsList += `• ${measure} ${ing}\n`;
        }
      }

      const instructions = meal.strInstructions;
      const response = `
🍽️ ${meal.strMeal}
📝 Ingredients:
${ingredientsList}

📖 Instructions:
${instructions}
      `;

      addMessage("bot", response);
    })
    .catch(err => {
      console.error(err);
      addMessage("bot", "Couldn't load recipe details.");
    });
}











