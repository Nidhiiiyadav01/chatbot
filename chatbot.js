const chatContainer = document.querySelector('.chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => {
  const message = userInput.value.trim();
  if (message) {
    addMessage(message, 'user');
    fetchRecipes(message);
    userInput.value = '';
  }
});

function addMessage(text, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  messageElement.innerHTML = text;
  chatContainer.appendChild(messageElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function addLoadingMessage() {
  const loading = document.createElement('div');
  loading.classList.add('message', 'bot-message');
  loading.setAttribute('id', 'loading-msg');
  loading.innerHTML = "Loading recipes... 🍳";
  chatContainer.appendChild(loading);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function removeLoadingMessage() {
  const loading = document.getElementById('loading-msg');
  if (loading) chatContainer.removeChild(loading);
}

async function fetchRecipes(ingredientText) {
  addLoadingMessage();

  const ingredients = ingredientText
    .toLowerCase()
    .split(/[ ,]+/)
    .filter(word => word.length > 2); // Avoid filler words

  let found = false;

  for (const ing of ingredients) {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ing}`);
      const data = await res.json();

      if (data.meals) {
        found = true;

        const mealsToShow = data.meals.slice(0, 3); // Limit to 3 recipes
        for (const meal of mealsToShow) {
          const detailRes = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
          const detailData = await detailRes.json();
          const mealInfo = detailData.meals[0];

          const recipeCard = `
            <div class="recipe-card">
              <h3>🍽️ ${mealInfo.strMeal}</h3>
              <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}" class="recipe-img">
              <div><strong>Ingredients:</strong><ul>
                ${getIngredientsList(mealInfo)}
              </ul></div>
              <div><strong>Instructions:</strong><p>${mealInfo.strInstructions}</p></div>
            </div>
          `;
          addMessage(recipeCard, 'bot');
        }
      }
    } catch (err) {
      console.error("API error for ingredient:", ing, err);
    }
  }

  removeLoadingMessage();

  if (!found) {
    addMessage("Sorry, I couldn't find any recipes for those ingredients. 🍽️", 'bot');
  }
}

function getIngredientsList(meal) {
  let list = '';
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      list += `<li>${ingredient} - ${measure}</li>`;
    }
  }
  return list;
}










