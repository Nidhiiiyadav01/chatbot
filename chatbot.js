const chatContainer = document.querySelector(".chat-container");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");

sendButton.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (input) {
    appendMessage("user", input);
    fetchRecipe(input);
    userInput.value = "";
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    sendButton.click();
  }
});

function appendMessage(sender, message) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", `${sender}-message`);
  messageDiv.innerHTML = message;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function fetchRecipe(ingredient) {
  appendMessage("bot", "🔄 Searching recipes...");

  try {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`);
    const data = await res.json();
    chatContainer.lastChild.remove(); // Remove "loading..." message

    if (!data.meals) {
      appendMessage("bot", "❌ Sorry, I couldn't find any recipes for those ingredients.");
      return;
    }

    let count = 1;
    for (let meal of data.meals) {
      const detailsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const detailsData = await detailsRes.json();
      const details = detailsData.meals[0];

      let ingredientsList = "";
      for (let i = 1; i <= 20; i++) {
        const ingredient = details[`strIngredient${i}`];
        const measure = details[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ingredientsList += `<li>${ingredient} - ${measure}</li>`;
        }
      }

      const recipeCard = `
        <div class="recipe-card">
          <h3>🍽️ Recipe ${count}: ${details.strMeal}</h3>
          <img src="${details.strMealThumb}" alt="${details.strMeal}" />
          <h4>Ingredients:</h4>
          <ul>${ingredientsList}</ul>
          <h4>Instructions:</h4>
          <p>${details.strInstructions.replace(/\r\n/g, "<br>")}</p>
        </div>
      `;

      appendMessage("bot", recipeCard);
      count++;
    }
  } catch (error) {
    chatContainer.lastChild.remove(); // Remove loading message on error
    appendMessage("bot", "⚠️ Something went wrong. Please try again.");
    console.error(error);
  }
}








