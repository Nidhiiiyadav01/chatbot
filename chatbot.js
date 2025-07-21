document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    fetchRecipe(message);  // <-- NEW: API call
    input.value = "";
  }
});

function addMessage(sender, text) {
  const chatBody = document.querySelector(".chat-body");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// 🔥 This fetches real data from TheMealDB
function fetchRecipe(ingredient) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        const meal = data.meals[0];
        const reply = `🍽 Recipe: ${meal.strMeal}\n📷 Image: ${meal.strMealThumb}`;
        addMessage("bot", reply);
      } else {
        addMessage("bot", "❌ No recipes found for that ingredient.");
      }
    })
    .catch((error) => {
      console.error("API error:", error);
      addMessage("bot", "⚠️ Error fetching recipe. Try again later.");
    });
}


