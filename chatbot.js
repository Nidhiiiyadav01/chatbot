document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    fetchRecipe(message);  // <-- Fetch from TheMealDB
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

// 🔥 New function to fetch recipe
function fetchRecipe(ingredient) {
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        const meal = data.meals[0]; // take the first meal
        const reply = `🍽 Try this: ${meal.strMeal}\n👀 View here: ${meal.strMealThumb}`;
        addMessage("bot", reply);
      } else {
        addMessage("bot", "❌ Sorry, no recipe found with that ingredient.");
      }
    })
    .catch((error) => {
      console.error("API error:", error);
      addMessage("bot", "⚠️ Something went wrong. Try again later.");
    });
}

