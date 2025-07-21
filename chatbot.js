// chatbot.js

const chatBody = document.querySelector('.chat-body');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');

// ✅ Helper to append messages
function appendMessage(sender, message) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.innerHTML = message;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// ✅ Add loading message
function showLoading() {
  appendMessage('bot', 'Loading recipes... 🍳');
}

// ✅ Replace loading message
function replaceLoading(newContent) {
  const messages = document.querySelectorAll('.message.bot');
  const lastMsg = messages[messages.length - 1];
  if (lastMsg && lastMsg.innerText === 'Loading recipes... 🍳') {
    lastMsg.innerHTML = newContent;
  } else {
    appendMessage('bot', newContent);
  }
}

// ✅ API Call
async function fetchRecipes(ingredientList, isVeg) {
  const type = isVeg ? 'vegetarian' : 'non_vegetarian';
  try {
    const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredientList}`);
    const data = await response.json();

    if (data.meals) {
      let html = `<strong>Here are some ${type} recipes:</strong><br><br>`;
      data.meals.slice(0, 3).forEach(meal => {
        html += `🍽️ <strong>${meal.strMeal}</strong><br>`;
        html += `<img src="${meal.strMealThumb}" width="200"/><br><br>`;
      });
      return html;
    } else {
      return "Sorry, I couldn't find any recipes for those ingredients. 🍽️";
    }
  } catch (error) {
    return "Something went wrong! Please try again later. ❌";
  }
}

// ✅ Ask veg/non-veg first, then recipe
let isAskingDiet = false;
let tempIngredients = '';

sendBtn.addEventListener('click', async () => {
  const userMsg = userInput.value.trim();
  if (!userMsg) return;

  appendMessage('user', userMsg);
  userInput.value = '';

  // 🔁 Check if asking for veg/non-veg
  if (!isAskingDiet) {
    tempIngredients = userMsg;
    isAskingDiet = true;
    appendMessage('bot', 'Would you like vegetarian or non-vegetarian recipes?');
    return;
  }

  const preference = userMsg.toLowerCase();
  const isVeg = preference.includes('veg');
  showLoading();

  const reply = await fetchRecipes(tempIngredients, isVeg);
  replaceLoading(reply);
  isAskingDiet = false;
});

