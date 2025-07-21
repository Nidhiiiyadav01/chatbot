document.getElementById('sendBtn').addEventListener('click', async () => {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim();
  if (message === '') return;

  appendMessage('user', message);
  userInput.value = '';

  appendMessage('bot', 'Loading recipes... 🍳');

  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${message}`);
    const data = await response.json();

    const botMessages = document.querySelectorAll('.message.bot');
    botMessages[botMessages.length - 1].remove(); // remove "Loading..." message

    if (!data.meals) {
      appendMessage('bot', "Sorry, I couldn't find any recipes for those ingredients. 🍽️");
      return;
    }

    // Show top 3 recipes
    data.meals.slice(0, 3).forEach(async meal => {
      const mealDetails = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
      const mealData = await mealDetails.json();
      const recipe = mealData.meals[0];

      const recipeCard = `
        <div class="recipe-card">
          <h3>🍽️ ${recipe.strMeal}</h3>
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
          <p><strong>Instructions:</strong> ${recipe.strInstructions}</p>
        </div>
      `;
      appendMessage('bot', recipeCard, true);
    });
  } catch (error) {
    console.error('Error:', error);
    appendMessage('bot', "Oops! Something went wrong. Please try again later.");
  }
});

function appendMessage(sender, message, isHTML = false) {
  const chatBody = document.querySelector('.chat-body');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  if (isHTML) {
    messageDiv.innerHTML = message;
  } else {
    messageDiv.textContent = message;
  }
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}






