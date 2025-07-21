const chatBody = document.querySelector('.chat-body');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

let isVegSelected = null;

// Show loading message
function showLoadingMessage() {
  const loadingDiv = document.createElement('div');
  loadingDiv.classList.add('message', 'bot');
  loadingDiv.id = 'loading';
  loadingDiv.innerHTML = 'Loading recipes... 🍲';
  chatBody.appendChild(loadingDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Remove loading message
function removeLoadingMessage() {
  const loadingDiv = document.getElementById('loading');
  if (loadingDiv) chatBody.removeChild(loadingDiv);
}

// Display message in chat
function displayMessage(message, sender = 'bot') {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  messageDiv.innerHTML = message;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Ask veg/non-veg choice inside chat
function askVegPreference() {
  displayMessage("Would you like vegetarian or non-vegetarian recipes? Type <b>veg</b> or <b>non-veg</b> 🍛");
}

async function fetchRecipe(ingredient) {
  try {
    showLoadingMessage();

    let apiURL;
    if (isVegSelected === 'veg') {
      apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    } else {
      apiURL = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`;
    }

    const response = await fetch(apiURL);
    const data = await response.json();
    removeLoadingMessage();

    if (data.meals) {
      const randomMeal = data.meals[Math.floor(Math.random() * data.meals.length)];

      // Get meal details
      const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${randomMeal.idMeal}`);
      const detailData = await detailRes.json();
      const meal = detailData.meals[0];

      displayMessage(`
        <b>${meal.strMeal}</b><br>
        <img src="${meal.strMealThumb}" alt="Recipe Image" width="200"><br>
        <b>Instructions:</b> ${meal.strInstructions.slice(0, 300)}...
      `);
    } else {
      displayMessage("Sorry, I couldn't find any recipes for those ingredients. 🍽️");
    }
  } catch (error) {
    removeLoadingMessage();
    displayMessage("Oops! Something went wrong. Please try again.");
  }
}

// Handle user input
sendBtn.addEventListener('click', () => {
  const input = userInput.value.trim().toLowerCase();
  if (!input) return;

  displayMessage(input, 'user');
  userInput.value = '';

  if (isVegSelected === null) {
    if (input.includes('veg')) {
      isVegSelected = 'veg';
      displayMessage("Great! I'll show you vegetarian recipes. 🥦");
    } else if (input.includes('non')) {
      isVegSelected = 'non-veg';
      displayMessage("Got it! I'll show you non-vegetarian recipes. 🍗");
    } else {
      askVegPreference();
      return;
    }
    return;
  }

  fetchRecipe(input);
});



