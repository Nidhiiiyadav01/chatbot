const chatBody = document.querySelector(".chat-body");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const API_URL = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";

function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.innerText = text;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function fetchMealFromAPI(ingredient) {
  try {
    const response = await fetch(`${API_URL}${ingredient}`);
    const data = await response.json();

    if (!data.meals) {
      appendMessage("bot", "Sorry, I couldn't find a recipe with that ingredient.");
      return;
    }

    const meal = data.meals[0];
    const recipeText = `🍽️ ${meal.strMeal}\n\nYou can view it here:\n${meal.strMealThumb}`;
    appendMessage("bot", recipeText);
  } catch (error) {
    console.error(error);
    appendMessage("bot", "Oops! Something went wrong.");
  }
}

sendBtn.addEventListener("click", () => {
  const input = userInput.value.trim();
  if (input) {
    appendMessage("user", input);
    fetchMealFromAPI(input.toLowerCase());
    userInput.value = "";
  }
});



