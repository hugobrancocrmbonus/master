(function () {
  var sidebar = document.getElementById("sidebar");
  var sidebarToggle = document.getElementById("sidebarToggle");
  var brandDrawer = document.getElementById("brandDrawer");
  var brandScrim = document.getElementById("brandScrim");
  var openBrandBtn = document.getElementById("openBrandDrawer");
  var closeBrandBtn = document.getElementById("closeBrandDrawer");
  var carouselTrack = document.getElementById("brandCarousel");
  var carouselNext = document.getElementById("carouselNext");

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

  function openBrandDrawer() {
    if (!brandDrawer || !brandScrim) return;
    brandDrawer.classList.add("is-open");
    brandScrim.classList.add("is-open");
    brandDrawer.setAttribute("aria-hidden", "false");
    brandScrim.hidden = false;
    document.body.classList.add("app--drawer-open");
    if (closeBrandBtn) closeBrandBtn.focus();
  }

  function closeBrandDrawerFn() {
    if (!brandDrawer || !brandScrim) return;
    brandDrawer.classList.remove("is-open");
    brandScrim.classList.remove("is-open");
    brandDrawer.setAttribute("aria-hidden", "true");
    brandScrim.hidden = true;
    document.body.classList.remove("app--drawer-open");
    if (openBrandBtn) openBrandBtn.focus();
  }

  if (openBrandBtn) {
    openBrandBtn.addEventListener("click", openBrandDrawer);
  }
  if (closeBrandBtn) {
    closeBrandBtn.addEventListener("click", closeBrandDrawerFn);
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

  var brandItems = document.querySelectorAll(".app-brand-drawer__item");
  brandItems.forEach(function (btn) {
    btn.addEventListener("click", function () {
      brandItems.forEach(function (b) {
        b.classList.remove("is-selected");
      });
      btn.classList.add("is-selected");
    });
  });
})();
