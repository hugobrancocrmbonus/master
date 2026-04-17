(function () {
  var root = document.getElementById("dashRoot");
  var trigger = document.getElementById("dashDateTrigger");
  var popover = document.getElementById("dashDatePopover");
  var inputStart = document.getElementById("dashDateStart");
  var inputEnd = document.getElementById("dashDateEnd");
  var btnApply = document.getElementById("dashDateApply");
  var btnCancel = document.getElementById("dashDateCancel");
  var labelEl = document.getElementById("dashDateLabel");
  var emptyEl = document.getElementById("dashEmpty");
  var loadedEl = document.getElementById("dashLoaded");
  var btnFilter = document.getElementById("dashBtnFilter");
  var btnExport = document.getElementById("dashBtnExport");

  if (!root || !trigger || !popover) return;

  var fmt = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

  function openPopover() {
    popover.hidden = false;
    trigger.setAttribute("aria-expanded", "true");
    if (inputStart) inputStart.focus();
  }

  function closePopover() {
    popover.hidden = true;
    trigger.setAttribute("aria-expanded", "false");
  }

  function isOpen() {
    return !popover.hidden;
  }

  trigger.addEventListener("click", function (e) {
    e.stopPropagation();
    if (isOpen()) closePopover();
    else openPopover();
  });

  if (btnCancel) {
    btnCancel.addEventListener("click", function () {
      closePopover();
    });
  }

  document.addEventListener("click", function (e) {
    if (!isOpen()) return;
    if (popover.contains(e.target) || trigger.contains(e.target)) return;
    closePopover();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen()) {
      closePopover();
    }
  });

  function parseISODate(s) {
    if (!s) return null;
    var d = new Date(s + "T12:00:00");
    return isNaN(d.getTime()) ? null : d;
  }

  function applyRange() {
    var start = inputStart ? inputStart.value : "";
    var end = inputEnd ? inputEnd.value : "";
    if (!start || !end) {
      return;
    }
    var ds = parseISODate(start);
    var de = parseISODate(end);
    if (!ds || !de || ds > de) {
      return;
    }

    if (labelEl) {
      labelEl.textContent =
        fmt.format(ds) + " – " + fmt.format(de);
    }

    root.setAttribute("data-state", "loaded");
    if (emptyEl) {
      emptyEl.hidden = true;
      emptyEl.setAttribute("aria-hidden", "true");
    }
    if (loadedEl) {
      loadedEl.hidden = false;
    }
    if (btnFilter) {
      btnFilter.disabled = false;
    }
    if (btnExport) {
      btnExport.disabled = false;
    }
    closePopover();
  }

  if (btnApply) {
    btnApply.addEventListener("click", applyRange);
  }

  if (inputStart && inputEnd) {
    inputStart.addEventListener("change", function () {
      if (inputEnd.value && inputStart.value > inputEnd.value) {
        inputEnd.value = inputStart.value;
      }
      inputEnd.min = inputStart.value || "";
    });
    inputEnd.addEventListener("change", function () {
      if (inputStart.value && inputEnd.value < inputStart.value) {
        inputStart.value = inputEnd.value;
      }
      inputStart.max = inputEnd.value || "";
    });
  }
})();
