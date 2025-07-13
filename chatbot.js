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

  function getBotReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes("recipe")) {
      return "Tell me the ingredients, and I’ll suggest something yummy! 🍝";
    } else if (msg.includes("hello") || msg.includes("hi")) {
      return "Hi there! I’m ForkBot 🤖🍴";
    } else if (msg.includes("thank")) {
      return "You're welcome! 😊";
    } else {
      return "I'm your food buddy! Ask me for recipes or food tips.";
    }
  }

  sendBtn.addEventListener("click", () => {
    const userMsg = input.value.trim();
    if (userMsg === "") return;
    addMessage("user", userMsg);
    const reply = getBotReply(userMsg);
    setTimeout(() => addMessage("bot", reply), 500);
    input.value = "";
  });
});
