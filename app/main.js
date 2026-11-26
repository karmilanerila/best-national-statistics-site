// NusaStat — titik masuk situs: routing hash, state halaman, dan semua
// pendengar kontrol (pemilih tahun, pengalih grafik, tab, cari & urut provinsi).
import { META } from "./data.js";
import { ROUTES, VIEWS } from "./views.js";

const root = document.getElementById("app");
const navList = document.getElementById("nav-list");
const yearBadge = document.getElementById("year-badge");

// State halaman: tahun aktif, jenis grafik ringkasan, tab ekonomi,
// kata kunci dan urutan tabel provinsi.
const state = {
  year: 2024,
  chart: "bar",
  tab: "pdb",
  q: "",
  sort: "pop-desc",
};

function navHtml(activeHash) {
  return ROUTES.map(
    (r) =>
      `<li><a href="${r.hash}"${r.hash === activeHash ? ' aria-current="page"' : ""}>${r.label}</a></li>`
  ).join("");
}

function route() {
  const hash = window.location.hash || "#/";
  const path = hash.slice(1) || "/";
  const view = VIEWS[path] || VIEWS["/"];
  const activeHash = VIEWS[path] ? hash : "#/";
  navList.innerHTML = navHtml(activeHash);
  root.innerHTML = view(state);
  yearBadge.textContent = `Data ${state.year}`;
  wireControls();
  document.title = `${META.siteName} — Statistik Indonesia`;
  window.scrollTo(0, 0);
}

function wireControls() {
  const yearSelect = document.getElementById("year-select");
  if (yearSelect) {
    yearSelect.addEventListener("change", () => {
      state.year = Number(yearSelect.value);
      route();
    });
  }
  root.querySelectorAll("[data-chart]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.chart = btn.dataset.chart;
      route();
    });
  });
  root.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.tab = btn.dataset.tab;
      route();
    });
  });
  const search = document.getElementById("province-search");
  if (search) {
    search.addEventListener("input", () => {
      state.q = search.value;
      renderProvinceTableOnly();
    });
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        state.q = "";
        route();
      }
    });
  }
  const sort = document.getElementById("province-sort");
  if (sort) {
    sort.addEventListener("change", () => {
      state.sort = sort.value;
      route();
    });
  }
}

// Menulis ulang hanya tabel provinsi saat mengetik, supaya fokus input
// tidak hilang di tengah kata.
function renderProvinceTableOnly() {
  const hash = window.location.hash || "#/";
  if (hash !== "#/provinsi") return;
  const keepFocus = document.activeElement === document.getElementById("province-search");
  const pos = keepFocus ? document.getElementById("province-search").selectionStart : 0;
  root.innerHTML = VIEWS["/provinsi"](state);
  const search = document.getElementById("province-search");
  if (search) {
    search.addEventListener("input", () => {
      state.q = search.value;
      renderProvinceTableOnly();
    });
    search.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        state.q = "";
        route();
      }
    });
    if (keepFocus) {
      search.focus();
      search.setSelectionRange(pos, pos);
    }
  }
  const sort = document.getElementById("province-sort");
  if (sort) {
    sort.addEventListener("change", () => {
      state.sort = sort.value;
      route();
    });
  }
}

window.addEventListener("hashchange", route);
route();
