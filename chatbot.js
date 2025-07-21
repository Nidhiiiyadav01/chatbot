document.getElementById("chatbot-form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  addMessage("user", userInput);
  document.getElementById("user-input").value = "";

  addMessage("bot", "Loading recipe... 🍳");

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput}`);
    const data = await response.json();

    const loadingMessages = document.querySelectorAll(".chat-message.bot");
    loadingMessages[loadingMessages.length - 1].remove();

    if (data.meals) {
      // Get first meal ID
      const mealId = data.meals[0].idMeal;

      // Fetch full recipe details
      const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const detailData = await detailResponse.json();
      const meal = detailData.meals[0];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push(`• ${ingredient} - ${measure}`);
        }
      }

      const recipeHTML = `
        <div class="recipe-card">
          <h3>🍽️ ${meal.strMeal}</h3>
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="recipe-img" />
          <h4>Ingredients:</h4>
          <ul>${ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
          <h4>Instructions:</h4>
          <p>${meal.strInstructions}</p>
        </div>
      `;

      addMessage("bot", recipeHTML, true);
    } else {
      // If not found, show a fallback recipe using default API
      const fallback = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
      const fallbackData = await fallback.json();
      const fallbackMeal = fallbackData.meals[0];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = fallbackMeal[`strIngredient${i}`];
        const measure = fallbackMeal[`strMeasure${i}`];
        if (ingredient && ingredient.trim() !== "") {
          ingredients.push(`• ${ingredient} - ${measure}`);
        }
      }

      const fallbackHTML = `
        <div class="recipe-card">
          <h3>🍽️ Here's something delicious instead!</h3>
          <img src="${fallbackMeal.strMealThumb}" alt="${fallbackMeal.strMeal}" class="recipe-img" />
          <h4>${fallbackMeal.strMeal}</h4>
          <h4>Ingredients:</h4>
          <ul>${ingredients.map(item => `<li>${item}</li>`).join("")}</ul>
          <h4>Instructions:</h4>
          <p>${fallbackMeal.strInstructions}</p>
        </div>
      `;

      addMessage("bot", fallbackHTML, true);
    }
  } catch (error) {
    console.error("Error:", error);
    addMessage("bot", "Oops! Something went wrong. Please try again later. 😔");
  }
});

function addMessage(sender, text, isHTML = false) {
  const chatContainer = document.getElementById("chatbot-messages");
  const message = document.createElement("div");
  message.classList.add("chat-message", sender);
  message.innerHTML = isHTML ? text : `<p>${text}</p>`;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}













