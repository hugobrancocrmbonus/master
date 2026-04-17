(function () {
  var STORAGE_KEY = "carumds-theme";

  function getToggle() {
    return document.getElementById("md-theme-toggle");
  }

  function apply(theme) {
    var root = document.documentElement;
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme === "light" ? "light" : "dark";
    var btn = getToggle();
    if (!btn) return;
    var icon = btn.querySelector(".ms");
    var isLight = theme === "light";
    btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      isLight ? "Mudar para tema escuro" : "Mudar para tema claro"
    );
    btn.setAttribute(
      "title",
      isLight ? "Tema claro — clicar para escuro" : "Tema escuro — clicar para claro"
    );
    if (icon) {
      icon.textContent = isLight ? "dark_mode" : "light_mode";
    }
  }

  function init() {
    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {}
    var initial =
      stored === "light" || stored === "dark"
        ? stored
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark";
    apply(initial);

    var btn = getToggle();
    if (btn) {
      btn.addEventListener("click", function () {
        var cur =
          document.documentElement.getAttribute("data-theme") || "dark";
        var next = cur === "light" ? "dark" : "light";
        try {
          localStorage.setItem(STORAGE_KEY, next);
        } catch (e) {}
        apply(next);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
