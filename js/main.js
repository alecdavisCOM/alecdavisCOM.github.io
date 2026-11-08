/* ============================================================
   ALEC DAVIS — site interactions
   Vanilla JS · no dependencies · deferred.
   Enhancements only; page is fully usable without JS.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var body = document.body;
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = body.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      body.classList.toggle("noscroll", open);
    });
    document.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        body.classList.remove("menu-open", "noscroll");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- nav border intensifies on scroll ---------- */
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 10) nav.style.borderBottomColor = "rgba(0,0,255,.55)";
      else nav.style.borderBottomColor = "";
      document.body.classList.toggle("scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- reveal on scroll ---------- */
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window && !reduce) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-visible"); ro.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- glitch image activate in view ---------- */
  var glitches = document.querySelectorAll(".glitch");
  if (glitches.length && "IntersectionObserver" in window) {
    var go = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("is-active");
      });
    }, { threshold: 0.2 });
    glitches.forEach(function (el) { go.observe(el); });
  } else {
    glitches.forEach(function (el) { el.classList.add("is-active"); });
  }

  /* ---------- minimal code-glyph scramble / decode ---------- */
  // charset: code symbols only (no foreign scripts)
  var GLYPH = "01<>[]{}/\\=+*!#$%&|^~_-".split("");
  function scrambleEl(el) {
    if (reduce) return;
    var full = el.getAttribute("data-scramble") || el.textContent;
    el.setAttribute("data-scramble", full);
    var chars = full.split("");
    var frame = 0;
    var total = 16;               // short + subtle
    var revealAt = chars.map(function (_, i) {
      return Math.floor((i / chars.length) * (total - 6)) + (Math.random() * 4 | 0);
    });
    function tick() {
      var out = "";
      for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        if (c === " ") { out += " "; continue; }
        if (frame >= revealAt[i]) {
          out += c;
        } else {
          out += '<span class="ch sc">' + GLYPH[(Math.random() * GLYPH.length) | 0] + "</span>";
        }
      }
      el.innerHTML = out;
      frame++;
      if (frame <= total) requestAnimationFrame(tick);
      else el.textContent = full;
    }
    tick();
  }
  var scramblers = document.querySelectorAll("[data-scramble]");
  if (scramblers.length && "IntersectionObserver" in window && !reduce) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { scrambleEl(e.target); so.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    scramblers.forEach(function (el) { so.observe(el); });
  }

  /* ---------- copy buttons ---------- */
  function flash(btn) {
    var label = btn.querySelector(".copy-label");
    var prev = label ? label.textContent : null;
    btn.classList.add("copied");
    if (label) label.textContent = "Copied";
    setTimeout(function () {
      btn.classList.remove("copied");
      if (label && prev !== null) label.textContent = prev;
    }, 1600);
  }
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var sel = btn.getAttribute("data-copy");
      var src = document.getElementById(sel);
      var text = src ? (src.getAttribute("data-value") || src.textContent) : btn.getAttribute("data-value");
      if (!text) return;
      text = text.trim();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { flash(btn); }).catch(function () { legacyCopy(text, btn); });
      } else { legacyCopy(text, btn); }
    });
  });
  function legacyCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", "");
    ta.style.position = "absolute"; ta.style.left = "-9999px";
    document.body.appendChild(ta); ta.select();
    try { document.execCommand("copy"); flash(btn); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- footer year ---------- */
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();
})();
