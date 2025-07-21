document.getElementById("sendBtn").addEventListener("click", () => {
  const input = document.getElementById("userInput");
  const message = input.value.trim();
  if (message) {
    addMessage("user", message);
    respondToUser(message);
    input.value = "";
  }
});

function addMessage(sender, text) {
  const chatBody = document.getElementById("chatBody");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);
  msgDiv.innerHTML = text; // 👈 Important: allows HTML like images
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function respondToUser(message) {
  const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(message)}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.meals && data.meals.length > 0) {
        const recipe = data.meals[0];
        const response = `
          <strong>${recipe.strMeal}</strong><br>
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" width="250" />
        `;
        addMessage("bot", response);
      } else {
        addMessage("bot", "Sorry, I couldn't find any recipes for those ingredients. 🍽️");
      }
    })
    .catch(error => {
      console.error("API Error:", error);
      addMessage("bot", "Oops! Something went wrong while fetching recipes. 😓");
    });
}
