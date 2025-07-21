document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("userInput");
  const sendBtn = document.getElementById("sendBtn");
  const chatBody = document.querySelector(".chat-body");

  function addMessage(sender, text) {
    const msg = document.createElement("div");
    msg.className = `message ${sender}`;
    msg.textContent = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  function loadingMessage() {
    const msg = document.createElement("div");
    msg.className = "message bot loading";
    msg.textContent = "Loading...";
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
    return msg;
  }

  function getBotReply(message) {
    const msg = message.toLowerCase();

    // Step 1: Veg/non-veg detection
    if (msg.includes("veg") || msg.includes("vegetarian")) {
      return "Got it! Please tell me the ingredients you have. 🥕🧄🧅";
    }
    if (msg.includes("non veg") || msg.includes("chicken") || msg.includes("egg") || msg.includes("meat")) {
      return "Great! Send me the ingredients for your non-veg recipe. 🍗🍳";
    }

    // Step 2: Ingredient-based responses
    if (msg.includes("pasta") || msg.includes("tomato") || msg.includes("cheese")) {
      return "Here's a simple pasta recipe:\n1. Boil pasta\n2. Sauté garlic and tomato\n3. Add cheese\n4. Mix and serve hot! 🍝";
    } else if (msg.includes("egg") && msg.includes("bread")) {
      return "Try this: Bread Egg Toast\n1. Beat eggs, add salt\n2. Dip bread\n3. Fry both sides till golden.";
    } else if (msg.includes("paneer")) {
      return "Make Paneer Bhurji:\n1. Crumble paneer\n2. Sauté onion, tomato\n3. Add paneer + spices\n4. Cook & serve!";
    } else if (msg.includes("potato") || msg.includes("aloo")) {
      return "Aloo Fry:\n1. Chop potatoes\n2. Fry in oil with spices (jeera, haldi, salt)\n3. Done! 🥔";
    } else if (msg.includes("rice") || msg.includes("dal")) {
      return "Dal Chawal:\n1. Cook rice separately\n2. Boil dal with salt, turmeric\n3. Temper with garlic, jeera, chili\n4. Serve hot!";
    }

    // Default reply
    return "Hmm... Tell me the ingredients (e.g. potato, paneer, tomato) and whether veg or non-veg. I’ll suggest a recipe!";
  }

  sendBtn.addEventListener("click", () => {
    const userMsg = input.value.trim();
    if (userMsg === "") return;
    addMessage("user", userMsg);
    input.value = "";

    const loading = loadingMessage();

    setTimeout(() => {
      chatBody.removeChild(loading);
      const reply = getBotReply(userMsg);
      addMessage("bot", reply);
    }, 800);
  });
});




