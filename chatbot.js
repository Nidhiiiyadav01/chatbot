const chatBody = document.querySelector(".chat-body");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

// Scroll to bottom helper
const scrollToBottom = () => {
  chatBody.scrollTop = chatBody.scrollHeight;
};

// Append message to chat
function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerHTML = text;
  chatBody.appendChild(messageDiv);
  scrollToBottom();
}

// Handle Send Button
sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (input) {
    appendMessage("user", input);
    getRecipes(input);
    userInput.value = "";
  }
});

// Also allow Enter key to send
userInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Get Recipes from TheMealDB
async function getRecipes(ingredient) {
  appendMessage("bot", "🔍 Searching recipes...");
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );
    const data = await response.json();

    // Remove loading message
    const loadingMessages = document.querySelectorAll(".bot");
    if (loadingMessages.length) {
      const lastMsg = loadingMessages[loadingMessages.length - 1];
      if (lastMsg.textContent.includes("Searching recipes")) {
        lastMsg.remove();
      }
    }

    if (!data.meals) {
      appendMessage("bot", `😔 Sorry, I couldn't find any recipes for those ingredients.`);
      return;
    }

    for (let meal of data.meals.slice(0, 3)) {
      const detailsRes = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      const detailsData = await detailsRes.json();
      const details = detailsData.meals[0];

      // Get ingredients
      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = details[`strIngredient${i}`];
        const measure = details[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
      }

      // Create recipe card
      const recipeCard = `
        <div class="recipe-card">
          <h3>🍽️ ${details.strMeal}</h3>
          <img src="${details.strMealThumb}" alt="${details.strMeal}" />
          <p><strong>Ingredients:</strong></p>
          <ul>${ingredientsList}</ul>
          <p><strong>Instructions:</strong><br>${details.strInstructions}</p>
        </div>
      `;

      appendMessage("bot", recipeCard);
    }
  } catch (error) {
    console.error("Error fetching recipe:", error);
    appendMessage("bot", "❌ Oops! Something went wrong while fetching the recipes.");
  }
}







