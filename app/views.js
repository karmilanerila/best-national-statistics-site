// NusaStat — tampilan per halaman (hash routing) dan semua kontrolnya.
// Rute: #/ (Ringkasan), #/demografi, #/ekonomi, #/kesehatan, #/pendidikan,
// #/kerja, #/provinsi. Setiap tautan navigasi adalah <a href="#/..."> yang
// nyata; setiap kontrol di halaman benar-benar mengubah tampilannya.
import {
  META, YEARS, SERIES, SECTORS_2023, PROVINCES_2020,
  CENSUS_TOTAL_2020, JAVA_SHARE_2020, fmt, fmtInt,
} from "./data.js";
import { lineChart, barChart, groupedBarChart, hbarChart, donut } from "./charts.js";

export const ROUTES = [
  { hash: "#/", label: "Ringkasan" },
  { hash: "#/demografi", label: "Demografi" },
  { hash: "#/ekonomi", label: "Ekonomi" },
  { hash: "#/kesehatan", label: "Kesehatan" },
  { hash: "#/pendidikan", label: "Pendidikan" },
  { hash: "#/kerja", label: "Ketenagakerjaan" },
  { hash: "#/provinsi", label: "Provinsi" },
];

function seriesPoints(key, years = YEARS) {
  return years
    .filter((y) => SERIES[key].values[y] !== undefined)
    .map((y) => ({ x: y, y: SERIES[key].values[y] }));
}

function sourceLine(key) {
  return `<p class="source">${SERIES[key].source} · ${META.updated}</p>`;
}

function kpiCard(key, year) {
  const s = SERIES[key];
  const v = s.values[year];
  const prev = s.values[year - 1];
  const delta =
    v !== undefined && prev !== undefined
      ? `<span class="delta">${v > prev ? "▲" : v < prev ? "▼" : "—"} ${fmt(Math.abs(v - prev), 2)} dari ${year - 1}</span>`
      : `<span class="delta">data ${year} terbaru</span>`;
  return `<article class="kpi">
    <h3>${s.label}</h3>
    <p class="kpi-value">${v === undefined ? "—" : fmt(v, key === "population" || key === "gdp" ? 1 : 2)}
      <span class="kpi-unit">${s.unit}</span></p>
    ${delta}
    <p class="kpi-source">${s.source}</p>
  </article>`;
}

function yearSelect(current) {
  return `<label class="year-pick">Tahun data
    <select id="year-select" aria-label="Pilih tahun data">
      ${YEARS.map((y) => `<option value="${y}"${y === current ? " selected" : ""}>${y}</option>`).join("")}
    </select></label>`;
}

function sectionHead(title, intro) {
  return `<header class="page-head"><h1>${title}</h1><p>${intro}</p></header>`;
}

// ---- Ringkasan ---------------------------------------------------------
export function viewOverview(state) {
  const year = state.year;
  const gdpPerCapita = SERIES.gdp.values[year] * 1e12 / (SERIES.population.values[year] * 1e6) / 1e6;
  return `
  ${sectionHead("Indonesia dalam angka", "Ringkasan statistik nasional — pilih tahun untuk melihat angka tahun itu di semua kartu.")}
  <div class="toolbar">${yearSelect(year)}
    <p class="toolbar-note">Semua angka di halaman ini mengikuti tahun yang dipilih.</p></div>
  <section class="kpi-grid" aria-label="Indikator utama">
    ${kpiCard("population", year)}
    ${kpiCard("gdp", year)}
    ${kpiCard("growth", year)}
    ${kpiCard("inflation", year)}
    ${kpiCard("unemployment", year)}
    ${kpiCard("poverty", year)}
    ${kpiCard("hdi", year)}
    <article class="kpi"><h3>PDB per kapita</h3>
      <p class="kpi-value">${fmt(gdpPerCapita, 1)} <span class="kpi-unit">Rp juta</span></p>
      <span class="delta">dihitung dari PDB ÷ penduduk ${year}</span>
      <p class="kpi-source">BPS — dihitung dari PDB dan jumlah penduduk</p></article>
  </section>
  <section class="card">
    <h2>Pertumbuhan penduduk 2020–2024</h2>
    <div class="chart-toggle" role="group" aria-label="Jenis grafik">
      <button type="button" data-chart="bar" class="${state.chart === "bar" ? "active" : ""}">Batang</button>
      <button type="button" data-chart="line" class="${state.chart === "line" ? "active" : ""}">Garis</button>
    </div>
    <div class="chart">${state.chart === "line"
      ? lineChart(seriesPoints("population"), { aria: "Penduduk 2020 sampai 2024", decimals: 1 })
      : barChart(seriesPoints("population"), { aria: "Penduduk 2020 sampai 2024", decimals: 1, highlight: 2024 })}</div>
    ${sourceLine("population")}
  </section>
  <section class="card">
    <h2>Sekilas</h2>
    <ul class="facts">
      <li><strong>${fmtInt(SERIES.population.values[2024] * 1e6)}</strong> jiwa tinggal di Indonesia pada 2024 — negara berpenduduk terbesar keempat di dunia.</li>
      <li><strong>${fmt(SERIES.growth.values[2024])}%</strong> pertumbuhan ekonomi 2024, dengan PDB <strong>Rp ${fmtInt(SERIES.gdp.values[2024])} triliun</strong>.</li>
      <li><strong>${fmt(SERIES.poverty.values[2024])}%</strong> penduduk hidup di bawah garis kemiskinan pada September 2024 — terendah dalam lima tahun terakhir.</li>
      <li><strong>${fmt(SERIES.hdi.values[2024])}</strong> Indeks Pembangunan Manusia 2024, naik dari ${fmt(SERIES.hdi.values[2020])} pada 2020.</li>
    </ul>
  </section>
  <nav class="quick-links" aria-label="Jelajahi lebih jauh">
    ${ROUTES.slice(1).map((r) => `<a href="${r.hash}">${r.label} →</a>`).join("")}
  </nav>`;
}

// ---- Demografi ---------------------------------------------------------
export function viewDemografi(state) {
  const top = [...PROVINCES_2020].sort((a, b) => b.pop - a.pop).slice(0, 8);
  return `
  ${sectionHead("Demografi", "Siapa tinggal di mana, dan bagaimana jumlah penduduk berubah dari tahun ke tahun.")}
  <section class="card">
    <h2>Jumlah penduduk 2020–2024</h2>
    <div class="chart">${lineChart(seriesPoints("population"), { aria: "Penduduk 2020 sampai 2024", decimals: 1 })}</div>
    ${sourceLine("population")}
  </section>
  <div class="two-col">
    <section class="card">
      <h2>Delapan provinsi terpadat</h2>
      <div class="chart">${hbarChart(top.map((p) => ({ name: p.name, value: p.pop, label: fmt(p.pop, 2) + " jt" })), { aria: "Provinsi terpadat 2020" })}</div>
      <p class="source">BPS — Sensus Penduduk 2020</p>
    </section>
    <section class="card">
      <h2>Jawa menampung lebih dari separuh penduduk</h2>
      <div class="chart donut-wrap">${donut([
        { value: JAVA_SHARE_2020, color: "#0e7a6d", label: fmt(JAVA_SHARE_2020, 1) + "%", sub: "di Pulau Jawa" },
        { value: 100 - JAVA_SHARE_2020, color: "#d98e04", label: "", sub: "" },
      ], { aria: "Pangsa penduduk Pulau Jawa" })}</div>
      <p class="source">Dihitung dari Sensus Penduduk 2020: 151,6 juta dari ${fmt(CENSUS_TOTAL_2020, 1)} juta jiwa tinggal di Jawa.</p>
    </section>
  </div>
  <section class="card">
    <h2>Catatan sensus</h2>
    <p>Sensus Penduduk 2020 mencatat <strong>${fmt(CENSUS_TOTAL_2020, 1)} juta</strong> jiwa. Jawa Barat adalah provinsi terpadat dengan
    <strong>${fmt(PROVINCES_2020[0].pop, 2)} juta</strong> jiwa — hampir seperlima penduduk Indonesia tinggal di satu provinsi itu.
    Lihat tabel lengkap semua provinsi di halaman <a href="#/provinsi">Provinsi</a>.</p>
  </section>`;
}

// ---- Ekonomi -----------------------------------------------------------
export function viewEkonomi(state) {
  const tab = state.tab || "pdb";
  const tabs = [
    { id: "pdb", label: "PDB & pertumbuhan" },
    { id: "harga", label: "Harga" },
    { id: "dagang", label: "Perdagangan" },
  ];
  let body = "";
  if (tab === "pdb") {
    body = `
    <h2>PDB 2020–2024</h2>
    <div class="chart">${barChart(seriesPoints("gdp"), { aria: "PDB 2020 sampai 2024", decimals: 0, color: "#0e7a6d" })}</div>
    ${sourceLine("gdp")}
    <h2>Pertumbuhan ekonomi</h2>
    <div class="chart">${lineChart(seriesPoints("growth"), { aria: "Pertumbuhan ekonomi 2020 sampai 2024", decimals: 2, min: -3 })}</div>
    ${sourceLine("growth")}
    <h2>Empat sektor terbesar, 2023</h2>
    <div class="chart">${hbarChart(SECTORS_2023.map((s) => ({ name: s.name, value: s.share, label: fmt(s.share, 2) + "%" })), { aria: "Pangsa sektor terhadap PDB 2023", color: "#d98e04", labelWidth: 260 })}</div>
    <p class="source">BPS — PDB menurut lapangan usaha, 2023</p>`;
  } else if (tab === "harga") {
    body = `
    <h2>Inflasi tahunan (Desember)</h2>
    <div class="chart">${lineChart(seriesPoints("inflation"), { aria: "Inflasi 2020 sampai 2024", decimals: 2, color: "#b3261e" })}</div>
    ${sourceLine("inflation")}
    <p>Inflasi melonjak ke <strong>${fmt(SERIES.inflation.values[2022])}%</strong> pada 2022 — tertinggi dalam lima tahun —
    lalu turun ke <strong>${fmt(SERIES.inflation.values[2024])}%</strong> pada 2024, terendah dalam periode yang sama.</p>`;
  } else {
    body = `
    <h2>Ekspor dan impor 2020–2024</h2>
    <div class="chart">${groupedBarChart(seriesPoints("exports"), seriesPoints("imports"), { aria: "Ekspor dan impor 2020 sampai 2024" })}</div>
    <p class="legend"><span class="swatch teal"></span> Ekspor &nbsp; <span class="swatch amber"></span> Impor</p>
    ${sourceLine("exports")}
    <p>Neraca perdagangan 2024 surplus <strong>US$ ${fmt(SERIES.exports.values[2024] - SERIES.imports.values[2024], 1)} miliar</strong>
    (ekspor US$ ${fmt(SERIES.exports.values[2024], 1)} miliar dikurangi impor US$ ${fmt(SERIES.imports.values[2024], 1)} miliar).</p>
    <h2>Wisatawan mancanegara kembali</h2>
    <div class="chart">${barChart(seriesPoints("visitors"), { aria: "Kunjungan wisatawan 2020 sampai 2024", decimals: 1, color: "#0e7a6d" })}</div>
    ${sourceLine("visitors")}`;
  }
  return `
  ${sectionHead("Ekonomi", "Seberapa besar ekonomi Indonesia, seberapa cepat ia tumbuh, dan berapa harga yang dibayar penduduknya.")}
  <div class="tabs" role="tablist" aria-label="Topik ekonomi">
    ${tabs.map((t) => `<button type="button" role="tab" data-tab="${t.id}" aria-selected="${t.id === tab}" class="${t.id === tab ? "active" : ""}">${t.label}</button>`).join("")}
  </div>
  <section class="card">${body}</section>`;
}

// ---- Kesehatan ---------------------------------------------------------
export function viewKesehatan() {
  return `
  ${sectionHead("Kesehatan", "Berapa lama orang Indonesia hidup, dan bagaimana gizi anak-anaknya.")}
  <section class="card">
    <h2>Angka harapan hidup saat lahir</h2>
    <div class="chart">${lineChart(seriesPoints("lifeExpectancy", [2022, 2023, 2024]), { aria: "Harapan hidup 2022 sampai 2024", decimals: 2 })}</div>
    ${sourceLine("lifeExpectancy")}
    <p>Seorang bayi lahir pada 2024 diperkirakan hidup <strong>${fmt(SERIES.lifeExpectancy.values[2024])} tahun</strong>.</p>
  </section>
  <section class="card">
    <h2>Stunting balita terus turun</h2>
    <div class="chart">${barChart(seriesPoints("stunting", [2021, 2022, 2023, 2024]), { aria: "Stunting balita 2021 sampai 2024", decimals: 1, color: "#0e7a6d" })}</div>
    ${sourceLine("stunting")}
    <p>Prevalensi stunting turun dari <strong>${fmt(SERIES.stunting.values[2021], 1)}%</strong> (2021) menjadi
    <strong>${fmt(SERIES.stunting.values[2024], 1)}%</strong> (2024) — penurunan 4,6 poin dalam tiga tahun.</p>
  </section>`;
}

// ---- Pendidikan --------------------------------------------------------
export function viewPendidikan() {
  return `
  ${sectionHead("Pendidikan", "Berapa lama orang Indonesia bersekolah, dan bagaimana pembangunan manusianya.")}
  <section class="card">
    <h2>Rata-rata lama sekolah</h2>
    <div class="chart">${barChart(seriesPoints("schooling", [2022, 2023, 2024]), { aria: "Rata-rata lama sekolah 2022 sampai 2024", decimals: 2, min: 0, color: "#d98e04" })}</div>
    ${sourceLine("schooling")}
    <p>Penduduk usia 25 tahun ke atas rata-rata bersekolah <strong>${fmt(SERIES.schooling.values[2024])} tahun</strong> pada 2024 —
    setara tamat kelas 9 (SMP).</p>
  </section>
  <section class="card">
    <h2>Indeks Pembangunan Manusia</h2>
    <div class="chart">${lineChart(seriesPoints("hdi"), { aria: "IPM 2020 sampai 2024", decimals: 2, min: 70 })}</div>
    ${sourceLine("hdi")}
    <p>IPM naik dari <strong>${fmt(SERIES.hdi.values[2020])}</strong> (2020) ke <strong>${fmt(SERIES.hdi.values[2024])}</strong> (2024),
    melewati ambang kategori “tinggi” (70–80) dengan nyaman.</p>
  </section>
  <section class="card">
    <h2>Terhubung: pengguna internet</h2>
    <div class="chart">${barChart(seriesPoints("internet", [2022, 2023, 2024]), { aria: "Pengguna internet 2022 sampai 2024", decimals: 0, color: "#0e7a6d" })}</div>
    ${sourceLine("internet")}
    <p>Pada 2024, <strong>${fmt(SERIES.internet.values[2024], 2)} juta</strong> orang Indonesia memakai internet — sekitar
    <strong>79,5%</strong> penduduk (APJII, 2024).</p>
  </section>`;
}

// ---- Ketenagakerjaan ----------------------------------------------------
export function viewKerja() {
  const giniRows = Object.entries(SERIES.gini.values).map(([k, v]) => {
    const [y, m] = k.split("-");
    return { label: `${m === "03" ? "Maret" : "September"} ${y}`, value: v };
  });
  return `
  ${sectionHead("Ketenagakerjaan", "Siapa bekerja, siapa mencari kerja, dan seberapa timpang penghasilan.")}
  <section class="card">
    <h2>Pengangguran terbuka terus turun</h2>
    <div class="chart">${lineChart(seriesPoints("unemployment"), { aria: "Pengangguran 2020 sampai 2024", decimals: 2, color: "#b3261e" })}</div>
    ${sourceLine("unemployment")}
    <p>Pada Agustus 2024, <strong>${fmt(SERIES.unemployment.values[2024])}%</strong> angkatan kerja menganggur —
    turun dari <strong>${fmt(SERIES.unemployment.values[2020])}%</strong> pada Agustus 2020.</p>
  </section>
  <section class="card">
    <h2>Ketimpangan penghasilan (rasio gini)</h2>
    <div class="chart">${lineChart(giniRows.map((r) => ({ x: r.label, y: r.value })), { aria: "Rasio gini 2023 sampai 2024", decimals: 3, min: 0.35, max: 0.4 })}</div>
    ${sourceLine("gini")}
    <p>Rasio gini bergerak di kisaran <strong>0,38</strong> — 0 berarti semua orang berpenghasilan sama, 1 berarti satu orang menguasai segalanya.</p>
  </section>`;
}

// ---- Provinsi ----------------------------------------------------------
export function viewProvinsi(state) {
  const q = (state.q || "").toLowerCase();
  const sort = state.sort || "pop-desc";
  let rows = PROVINCES_2020.filter((p) => p.name.toLowerCase().includes(q));
  rows = [...rows].sort((a, b) =>
    sort === "name" ? a.name.localeCompare(b.name, "id") :
    sort === "pop-asc" ? a.pop - b.pop : b.pop - a.pop);
  const totalShown = rows.reduce((a, p) => a + p.pop, 0);
  return `
  ${sectionHead("Provinsi", "Penduduk tiap provinsi menurut Sensus Penduduk 2020 — cari, lalu urutkan.")}
  <section class="card">
    <div class="toolbar">
      <label class="search">Cari provinsi
        <input id="province-search" type="search" placeholder="mis. Jawa Barat" value="${state.q || ""}" aria-label="Cari provinsi">
      </label>
      <label class="year-pick">Urutkan
        <select id="province-sort" aria-label="Urutkan provinsi">
          <option value="pop-desc"${sort === "pop-desc" ? " selected" : ""}>Terpadat dulu</option>
          <option value="pop-asc"${sort === "pop-asc" ? " selected" : ""}>Tersedikit dulu</option>
          <option value="name"${sort === "name" ? " selected" : ""}>Nama A–Z</option>
        </select></label>
    </div>
    <p class="toolbar-note">${rows.length} provinsi ditampilkan · total ${fmt(totalShown, 2)} juta jiwa dari ${fmt(CENSUS_TOTAL_2020, 1)} juta (Sensus 2020).</p>
    <div class="table-wrap"><table>
      <thead><tr><th>#</th><th>Provinsi</th><th>Penduduk (juta)</th><th>Pangsa (%)</th></tr></thead>
      <tbody>
        ${rows.map((p, i) => `<tr><td>${i + 1}</td><td>${p.name}</td><td>${fmt(p.pop, 2)}</td><td>${fmt((p.pop / CENSUS_TOTAL_2020) * 100, 2)}</td></tr>`).join("")}
      </tbody>
    </table></div>
    ${rows.length === 0 ? `<p class="empty">Tidak ada provinsi bernama “${state.q}”. Coba kata lain.</p>` : ""}
    <p class="source">BPS — Sensus Penduduk 2020 · Daftar ini memuat 20 provinsi terbesar; Indonesia memiliki 38 provinsi (2024).</p>
  </section>`;
}

export const VIEWS = {
  "/": viewOverview,
  "/demografi": viewDemografi,
  "/ekonomi": viewEkonomi,
  "/kesehatan": viewKesehatan,
  "/pendidikan": viewPendidikan,
  "/kerja": viewKerja,
  "/provinsi": viewProvinsi,
};
