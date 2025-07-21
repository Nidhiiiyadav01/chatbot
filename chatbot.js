document.getElementById("sendBtn").addEventListener("click", async function () {
  const userInput = document.getElementById("userInput").value;
  if (!userInput) return;

  addMessage("user", userInput);
  document.getElementById("userInput").value = "";

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${userInput}`);
    const data = await response.json();

    if (data.meals) {
      const meal = data.meals[0]; // take first meal from result
      const message = `
        <strong>${meal.strMeal}</strong><br/>
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}" style="width:200px; border-radius:10px; margin-top:5px;" />
      `;
      addMessage("bot", message);
    } else {
      addMessage("bot", "Sorry, I couldn't find any recipes for those ingredients. 🍽️");
    }
  } catch (error) {
    console.error(error);
    addMessage("bot", "Oops! Something went wrong. Please try again later.");
  }
});

function addMessage(sender, text) {
  const chatBody = document.querySelector(".chat-body");
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerHTML = text;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}




