document.addEventListener("DOMContentLoaded", function () {
  const sendBtn = document.getElementById("sendBtn");
  const userInput = document.getElementById("userInput");
  const chatBody = document.querySelector(".chat-body");

  function appendMessage(content, sender = "bot") {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender);
    messageDiv.innerHTML = content;
    chatBody.appendChild(messageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function fetchRecipes(ingredient) {
    appendMessage("🔄 Loading recipes...", "bot");

    try {
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
      );
      const data = await response.json();
      const meals = data.meals;

      // Remove "Loading..." message
      const loadingMessages = document.querySelectorAll(".message.bot");
      loadingMessages.forEach((msg) => {
        if (msg.textContent.includes("Loading")) msg.remove();
      });

      if (!meals) {
        appendMessage(
          `Sorry, I couldn't find any recipes for those ingredients. 🍽️`,
          "bot"
        );
        return;
      }

      // Limit to 3 meals for display
      const limitedMeals = meals.slice(0, 3);

      for (const meal of limitedMeals) {
        const mealDetailsRes = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
        );
        const mealDetailsData = await mealDetailsRes.json();
        const mealDetails = mealDetailsData.meals[0];

        const ingredientsList = [];
        for (let i = 1; i <= 20; i++) {
          const ingredient = mealDetails[`strIngredient${i}`];
          const measure = mealDetails[`strMeasure${i}`];
          if (ingredient && ingredient.trim() !== "") {
            ingredientsList.push(`• ${ingredient} - ${measure}`);
          }
        }

        const recipeCard = `
          <div class="recipe-card">
            <h3>🍽️ ${mealDetails.strMeal}</h3>
            <img src="${mealDetails.strMealThumb}" alt="Meal Image" />
            <p><strong>Ingredients:</strong><br>${ingredientsList.join("<br>")}</p>
            <p><strong>Instructions:</strong><br>${mealDetails.strInstructions}</p>
          </div>
        `;
        appendMessage(recipeCard, "bot");
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
      appendMessage("Oops! Something went wrong. Please try again later. ❌", "bot");
    }
  }

  function handleSend() {
    const userText = userInput.value.trim();
    if (userText === "") return;

    appendMessage(userText, "user");
    userInput.value = "";
    fetchRecipes(userText);
  }

  sendBtn.addEventListener("click", handleSend);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });
});









