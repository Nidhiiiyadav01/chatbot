document.getElementById("sendBtn").addEventListener("click", async () => {
  const userInput = document.getElementById("userInput").value.trim();
  if (!userInput) return;

  addMessage(userInput, "user");
  document.getElementById("userInput").value = "";

  addMessage("Loading... 🍽️", "bot");

  const isVeg = confirm("Do you want vegetarian recipes? Click OK for Veg, Cancel for Non-Veg.");

  try {
    const mealType = isVeg ? "vegetarian" : "chicken"; // Default category for non-veg

    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput}`);
    const data = await response.json();

    // Remove "Loading..." message
    removeLastBotMessage();

    if (!data.meals || data.meals.length === 0) {
      addMessage("Sorry, I couldn't find any recipes for those ingredients. 🍽️", "bot");
      return;
    }

    // Pick the first meal found
    const meal = data.meals[0];
    const detailsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
    const detailsData = await detailsRes.json();
    const detailedMeal = detailsData.meals[0];

    let ingredients = "";
    for (let i = 1; i <= 20; i++) {
      const ing = detailedMeal[`strIngredient${i}`];
      const measure = detailedMeal[`strMeasure${i}`];
      if (ing && ing.trim() !== "") {
        ingredients += `• ${ing} - ${measure}\n`;
      }
    }

    const recipeMessage = `
      🍽️ <strong>${detailedMeal.strMeal}</strong><br/>
      <img src="${detailedMeal.strMealThumb}" alt="${detailedMeal.strMeal}" style="max-width:100%; border-radius:10px;"/><br/><br/>
      <strong>Ingredients:</strong><br/>
      <pre>${ingredients}</pre>
      <strong>Instructions:</strong><br/>
      ${detailedMeal.strInstructions}
    `;

    addMessage(recipeMessage, "bot", true);
  } catch (error) {
    console.error("Error fetching recipe:", error);
    removeLastBotMessage();
    addMessage("Oops! Something went wrong while fetching the recipe. 🧑‍🍳", "bot");
  }
});

function addMessage(text, sender, isHTML = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  if (isHTML) {
    messageDiv.innerHTML = text;
  } else {
    messageDiv.textContent = text;
  }
  document.querySelector(".chat-body").appendChild(messageDiv);
  document.querySelector(".chat-body").scrollTop = document.querySelector(".chat-body").scrollHeight;
}

function removeLastBotMessage() {
  const messages = document.querySelectorAll(".message.bot");
  if (messages.length > 0) {
    messages[messages.length - 1].remove();
  }
}

