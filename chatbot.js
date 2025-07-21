document.getElementById("chat-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const userInput = document.getElementById("user-input").value.trim();
  if (!userInput) return;

  appendMessage("user", userInput);
  document.getElementById("user-input").value = "";

  appendMessage("bot", "Loading recipes... 🍳");

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(userInput)}`);
    const data = await response.json();

    clearLoading();

    if (!data.meals) {
      appendMessage("bot", "Sorry, I couldn't find any recipes for those ingredients. 🍽️");
      return;
    }

    const maxResults = 2; // number of recipes to show
    const mealsToShow = data.meals.slice(0, maxResults);

    for (let meal of mealsToShow) {
      const detailsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const detailsData = await detailsRes.json();
      const detailedMeal = detailsData.meals[0];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = detailedMeal[`strIngredient${i}`];
        const measure = detailedMeal[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredients.push(`${ingredient} - ${measure}`.trim());
        }
      }

      const recipeHTML = `
        <div class="recipe-card">
          <img src="${detailedMeal.strMealThumb}" alt="${detailedMeal.strMeal}" />
          <h3>🍽️ ${detailedMeal.strMeal}</h3>
          <p><strong>Ingredients:</strong></p>
          <ul>${ingredients.map(i => `<li>${i}</li>`).join("")}</ul>
          <p><strong>Instructions:</strong><br>${detailedMeal.strInstructions}</p>
        </div>
      `;

      appendCustomMessage(recipeHTML);
    }
  } catch (error) {
    clearLoading();
    appendMessage("bot", "Oops! Something went wrong. Please try again later. ⚠️");
  }
});

function appendMessage(sender, message) {
  const chatBox = document.getElementById("chat-box");
  const messageDiv = document.createElement("div");
  messageDiv.className = sender === "user" ? "user-message" : "bot-message";
  messageDiv.innerHTML = `<p>${message}</p>`;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function appendCustomMessage(html) {
  const chatBox = document.getElementById("chat-box");
  const customDiv = document.createElement("div");
  customDiv.className = "bot-message";
  customDiv.innerHTML = html;
  chatBox.appendChild(customDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function clearLoading() {
  const chatBox = document.getElementById("chat-box");
  const last = chatBox.lastChild;
  if (last && last.innerText.includes("Loading recipes")) {
    chatBox.removeChild(last);
  }
}









