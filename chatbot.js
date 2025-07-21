document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatBody = document.querySelector(".chat-body");

  let currentIngredients = "";

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function addRecipeCard(title, image, instructions) {
    const card = document.createElement("div");
    card.className = "message bot";
    card.innerHTML = `
      <strong>${title}</strong><br/>
      <img src="${image}" alt="${title}" style="max-width: 100%; border-radius: 10px; margin: 8px 0;" /><br/>
      <p>${instructions}</p>
    `;
    chatBody.appendChild(card);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function showLoading() {
    const loading = document.createElement("div");
    loading.className = "message bot loading";
    loading.textContent = "Loading recipe...";
    chatBody.appendChild(loading);
    chatBody.scrollTop = chatBody.scrollHeight;
    return loading;
  }

  async function fetchRecipe(ingredients, type) {
    const loadingElem = showLoading();
    let query = ingredients.split(",")[0].trim();

    const url =
      type.toLowerCase() === "veg"
        ? `https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`
        : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      loadingElem.remove();

      if (!data.meals || data.meals.length === 0) {
        addMessage("bot", "Sorry, I couldn’t find a recipe with those ingredients.");
        return;
      }

      const meal = data.meals[0];
      const mealId = meal.idMeal;

      const fullDetailsRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`);
      const fullDetailsData = await fullDetailsRes.json();
      const mealDetails = fullDetailsData.meals[0];

      addRecipeCard(mealDetails.strMeal, mealDetails.strMealThumb, mealDetails.strInstructions);
    } catch (error) {
      loadingElem.remove();
      addMessage("bot", "Oops! Something went wrong.");
    }
  }

  sendBtn.addEventListener("click", () => {
    const userMsg = input.value.trim();
    if (!userMsg) return;

    addMessage("user", userMsg);

    if (!currentIngredients) {
      currentIngredients = userMsg;
      addMessage("bot", "Got it! Is this for a vegetarian or non-vegetarian recipe?");
    } else if (["veg", "non-veg", "vegetarian", "non vegetarian"].includes(userMsg.toLowerCase())) {
      fetchRecipe(currentIngredients, userMsg);
      currentIngredients = ""; // reset after recipe is fetched
    } else {
      addMessage("bot", "Please tell me the ingredients you'd like to cook with.");
    }

    input.value = "";
  });
});


