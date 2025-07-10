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
  msgDiv.textContent = text;
  chatBody.appendChild(msgDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function respondToUser(message) {
  let response = "";

  if (message.toLowerCase().includes("pasta")) {
    response = "Here's a simple pasta recipe: Boil pasta, sauté garlic in olive oil, add tomatoes and mix with pasta.";
  } else if (message.toLowerCase().includes("egg")) {
    response = "You can make a classic omelette: beat eggs, add salt, pour in pan, flip once, and serve hot!";
  } else if (message.toLowerCase().includes("paneer")) {
    response = "Try making Paneer Bhurji: crumble paneer, cook with onions, tomatoes, and spices.";
  } else if (message.toLowerCase().includes("hi") || message.toLowerCase().includes("hello")) {
    response = "Hello! I'm ForkBot 🍴. Tell me an ingredient and I’ll suggest a recipe!";
  } else {
    response = "Sorry, I'm still learning! Try asking for a recipe with pasta, egg, or paneer.";
  }

  setTimeout(() => addMessage("bot", response), 600);
}

