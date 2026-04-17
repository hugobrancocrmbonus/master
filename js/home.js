(function () {
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var brandDrawer = document.getElementById("brandDrawer");
  var brandScrim = document.getElementById("brandScrim");
  var closeBrandBtn = document.getElementById("closeBrandDrawer");
  var cancelBrandBtn = document.getElementById("cancelBrandDrawer");
  var confirmBrandBtn = document.getElementById("confirmBrandDrawer");
  var carouselTrack = document.getElementById("brandCarousel");
  var carouselNext = document.getElementById("carouselNext");
  var tabMine = document.getElementById("tabMine");
  var tabAll = document.getElementById("tabAll");
  var brandSearchInput = document.getElementById("brandSearchInput");
  var brandDrawerList = document.getElementById("brandDrawerList");
  var headerLeftDefault = document.getElementById("headerLeftDefault");
  var headerLeftApplied = document.getElementById("headerLeftApplied");
  var headerLinkSelectBrand = document.getElementById("headerLinkSelectBrand");
  var headerBrandApplied = document.getElementById("headerBrandApplied");
  var headerBrandLogo = document.getElementById("headerBrandLogo");
  var headerBrandName = document.getElementById("headerBrandName");
  var headerBtnSwapBrand = document.getElementById("headerBtnSwapBrand");
  var headerIconMessages = document.getElementById("headerIconMessages");
  var appHeader = document.getElementById("appHeader");
  var isConsultorPage = appHeader && appHeader.getAttribute("data-page") === "consultor";
  var isDashboardPage = appHeader && appHeader.getAttribute("data-page") === "dashboard";

  /** Marca aplicada no header (null = ainda não escolheu) */
  var appliedBrand = null;

  function setExpanded(expanded) {
    if (!sidebar) return;
    sidebar.classList.toggle("is-expanded", expanded);
    if (sidebarToggle) sidebarToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener("click", function () {
      setExpanded(!sidebar.classList.contains("is-expanded"));
    });
  }

  function updateConfirmButtonState() {
    if (!confirmBrandBtn) return;
    var selected = document.querySelector(".app-brand-drawer__card.is-selected");
    var ok = false;
    if (selected) {
      var li = selected.closest("li");
      ok = li && !li.hidden;
    }
    confirmBrandBtn.disabled = !ok;
    confirmBrandBtn.setAttribute("aria-disabled", ok ? "false" : "true");
  }

  function clearDrawerCardSelection() {
    document.querySelectorAll(".app-brand-drawer__card").forEach(function (card) {
      card.classList.remove("is-selected");
    });
  }

  function syncDrawerSelectionFromApplied() {
    clearDrawerCardSelection();
    if (appliedBrand && appliedBrand.id) {
      var match = document.querySelector(
        '.app-brand-drawer__card[data-brand="' + appliedBrand.id + '"]'
      );
      if (match) {
        match.classList.add("is-selected");
      }
    }
    updateConfirmButtonState();
  }

  function updateHeaderBrandUI() {
    if (!appliedBrand) {
      if (appHeader) appHeader.setAttribute("data-state", "default");
      if (isConsultorPage || isDashboardPage) {
        if (headerLeftDefault) headerLeftDefault.hidden = true;
        if (headerLeftApplied) headerLeftApplied.hidden = false;
      } else {
        if (headerLeftDefault) headerLeftDefault.hidden = false;
        if (headerLeftApplied) headerLeftApplied.hidden = true;
      }
      if (headerLinkSelectBrand) headerLinkSelectBrand.hidden = false;
      if (headerBrandApplied) headerBrandApplied.hidden = true;
      if (headerIconMessages) headerIconMessages.hidden = true;
      if (headerBrandLogo) {
        headerBrandLogo.removeAttribute("src");
        headerBrandLogo.alt = "";
      }
      if (headerBrandName) headerBrandName.textContent = "";
    } else {
      if (appHeader) appHeader.setAttribute("data-state", "applied");
      if (headerLeftDefault) headerLeftDefault.hidden = true;
      if (headerLeftApplied) headerLeftApplied.hidden = false;
      if (headerLinkSelectBrand) headerLinkSelectBrand.hidden = true;
      if (headerBrandApplied) headerBrandApplied.hidden = false;
      if (headerIconMessages) headerIconMessages.hidden = false;
      if (headerBrandLogo) {
        headerBrandLogo.src = appliedBrand.img;
        headerBrandLogo.alt = "";
      }
      if (headerBrandName) headerBrandName.textContent = appliedBrand.name;
    }
  }

  function focusBrandTrigger() {
    if (appliedBrand && headerBtnSwapBrand) {
      headerBtnSwapBrand.focus();
    } else if (headerLinkSelectBrand) {
      headerLinkSelectBrand.focus();
    }
  }

  function openBrandDrawer() {
    if (!brandDrawer || !brandScrim) return;
    brandDrawer.classList.add("is-open");
    brandScrim.classList.add("is-open");
    brandDrawer.setAttribute("aria-hidden", "false");
    brandScrim.hidden = false;
    document.body.classList.add("app--drawer-open");
    syncDrawerSelectionFromApplied();
    if (closeBrandBtn) closeBrandBtn.focus();
  }

  function closeBrandDrawerFn() {
    if (!brandDrawer || !brandScrim) return;
    brandDrawer.classList.remove("is-open");
    brandScrim.classList.remove("is-open");
    brandDrawer.setAttribute("aria-hidden", "true");
    brandScrim.hidden = true;
    document.body.classList.remove("app--drawer-open");
    focusBrandTrigger();
  }

  function applyBrandSelection() {
    var selected = document.querySelector(".app-brand-drawer__card.is-selected");
    if (!selected) return;
    var li = selected.closest("li");
    if (li && li.hidden) return;
    var id = selected.getAttribute("data-brand");
    var nameEl = selected.querySelector(".app-brand-drawer__card-name");
    var imgEl = selected.querySelector(".app-brand-drawer__card-media img");
    if (!id || !nameEl || !imgEl) return;
    appliedBrand = {
      id: id,
      name: nameEl.textContent.trim(),
      img: imgEl.getAttribute("src") || "",
    };
    updateHeaderBrandUI();
    closeBrandDrawerFn();
  }

  /**
   * Seleciona marca a partir do carrossel (botão do card). Reutiliza nome/logo do drawer
   * quando existe `data-brand` correspondente; caso contrário usa o cartão (ex.: Apple, BMW).
   */
  function applyBrandFromCarouselCard(brandId) {
    if (!brandId) return;
    var drawerCard = document.querySelector(
      '.app-brand-drawer__card[data-brand="' + brandId + '"]'
    );
    if (drawerCard) {
      var dName = drawerCard.querySelector(".app-brand-drawer__card-name");
      var dImg = drawerCard.querySelector(".app-brand-drawer__card-media img");
      if (dName && dImg) {
        appliedBrand = {
          id: brandId,
          name: dName.textContent.trim(),
          img: dImg.getAttribute("src") || "",
        };
        updateHeaderBrandUI();
        syncDrawerSelectionFromApplied();
        return;
      }
    }
    var carouselCard = document.querySelector('.home-brand-card[data-brand="' + brandId + '"]');
    if (!carouselCard) return;
    var cName = carouselCard.querySelector(".home-brand-card__name");
    var cImg = carouselCard.querySelector(".home-brand-card__logo");
    if (!cName || !cImg) return;
    appliedBrand = {
      id: brandId,
      name: cName.textContent.trim(),
      img: cImg.getAttribute("src") || "",
    };
    updateHeaderBrandUI();
    syncDrawerSelectionFromApplied();
  }

  document.querySelectorAll(".js-open-brand-drawer").forEach(function (el) {
    el.addEventListener("click", openBrandDrawer);
  });

  if (closeBrandBtn) {
    closeBrandBtn.addEventListener("click", closeBrandDrawerFn);
  }
  if (cancelBrandBtn) {
    cancelBrandBtn.addEventListener("click", closeBrandDrawerFn);
  }
  if (confirmBrandBtn) {
    confirmBrandBtn.addEventListener("click", applyBrandSelection);
  }
  if (brandScrim) {
    brandScrim.addEventListener("click", closeBrandDrawerFn);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && brandDrawer && brandDrawer.classList.contains("is-open")) {
      closeBrandDrawerFn();
    }
  });

  if (carouselNext && carouselTrack) {
    carouselNext.addEventListener("click", function () {
      carouselTrack.scrollBy({ left: 280, behavior: "smooth" });
    });
  }

  document.querySelectorAll(".home-brand-card__icon-btn").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var card = btn.closest(".home-brand-card");
      if (!card) return;
      var brandId = card.getAttribute("data-brand");
      applyBrandFromCarouselCard(brandId);
    });
  });

  function activateTab(mine) {
    if (!tabMine || !tabAll) return;
    if (mine) {
      tabMine.classList.add("is-active");
      tabMine.setAttribute("aria-selected", "true");
      tabAll.classList.remove("is-active");
      tabAll.setAttribute("aria-selected", "false");
    } else {
      tabAll.classList.add("is-active");
      tabAll.setAttribute("aria-selected", "true");
      tabMine.classList.remove("is-active");
      tabMine.setAttribute("aria-selected", "false");
    }
  }

  if (tabMine) {
    tabMine.addEventListener("click", function () {
      activateTab(true);
    });
  }
  if (tabAll) {
    tabAll.addEventListener("click", function () {
      activateTab(false);
    });
  }

  document.querySelectorAll(".app-brand-drawer__card").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".app-brand-drawer__card").forEach(function (b) {
        b.classList.remove("is-selected");
      });
      btn.classList.add("is-selected");
      updateConfirmButtonState();
    });
  });

  if (brandSearchInput && brandDrawerList) {
    brandSearchInput.addEventListener("input", function () {
      var q = brandSearchInput.value.trim().toLowerCase();
      var items = brandDrawerList.querySelectorAll("li");
      items.forEach(function (li) {
        var nameEl = li.querySelector(".app-brand-drawer__card-name");
        var name = nameEl ? nameEl.textContent.toLowerCase() : "";
        li.hidden = !!(q && name.indexOf(q) === -1);
      });
      updateConfirmButtonState();
    });
  }

  updateHeaderBrandUI();
})();
