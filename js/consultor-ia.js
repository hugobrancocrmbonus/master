(function () {
  var chat = document.getElementById("iaChat");
  var hero = document.getElementById("iaHero");
  var thread = document.getElementById("iaThread");
  var input = document.getElementById("iaInput");
  var sendBtn = document.getElementById("iaSend");
  var suggestions = document.getElementById("iaSuggestions");

  var demoReply =
    "Esta é uma resposta de demonstração. Em produção, o Consultor IA usaria o contexto da marca selecionada e a API de IA configurada para o Master.";

  function updateSendState() {
    if (!sendBtn || !input) return;
    var ok = input.value.trim().length > 0;
    sendBtn.disabled = !ok;
    sendBtn.setAttribute("aria-disabled", ok ? "false" : "true");
  }

  function appendMessage(role, text) {
    if (!thread) return;
    var wrap = document.createElement("div");
    wrap.className = "ia-chat__msg ia-chat__msg--" + role;
    var bubble = document.createElement("div");
    bubble.className = "ia-chat__bubble";
    bubble.textContent = text;
    wrap.appendChild(bubble);
    thread.appendChild(wrap);
    thread.hidden = false;
    thread.scrollTop = thread.scrollHeight;
  }

  function activateChatLayout() {
    if (!chat || chat.classList.contains("ia-chat--active")) return;
    chat.classList.add("ia-chat--active");
    if (hero) hero.hidden = true;
    if (suggestions) suggestions.hidden = true;
  }

  function sendMessage() {
    if (!input || !sendBtn || sendBtn.disabled) return;
    var text = input.value.trim();
    if (!text) return;
    activateChatLayout();
    appendMessage("user", text);
    input.value = "";
    updateSendState();
    window.setTimeout(function () {
      appendMessage("assistant", demoReply);
    }, 550);
  }

  if (input) {
    input.addEventListener("input", updateSendState);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  document.querySelectorAll("[data-ia-prompt]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var t = btn.getAttribute("data-ia-prompt");
      if (input && t) {
        input.value = t;
        updateSendState();
        input.focus();
      }
    });
  });

  updateSendState();
})();
