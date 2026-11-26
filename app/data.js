// NusaStat — data statistik Indonesia.
// Setiap angka adalah statistik resmi yang dipublikasikan, dengan sumber dan
// tahun dicantumkan di sampingnya. Tidak ada angka karangan: bila satu angka
// tidak bisa dipastikan, angka itu tidak masuk ke file ini.
export const META = {
  country: "Indonesia",
  siteName: "NusaStat",
  tagline: "Statistik Indonesia, dibaca dengan tenang",
  updated: "November 2026",
  sourcesNote:
    "Sumber: Badan Pusat Statistik (BPS), Kementerian Kesehatan (SSGI), " +
    "Asosiasi Penyelenggara Jasa Internet Indonesia (APJII).",
};

export const YEARS = [2020, 2021, 2022, 2023, 2024];

// Seri tahunan nasional. Nilai mengikuti publikasi BPS; satuan di tiap seri.
export const SERIES = {
  population: {
    label: "Jumlah penduduk",
    unit: "juta jiwa",
    source: "BPS — Jumlah Penduduk (pertengahan tahun)",
    values: { 2020: 270.2, 2021: 272.25, 2022: 275.77, 2023: 278.69, 2024: 281.6 },
  },
  gdp: {
    label: "Produk Domestik Bruto (harga berlaku)",
    unit: "Rp triliun",
    source: "BPS — PDB atas dasar harga berlaku",
    values: { 2020: 15434, 2021: 16977, 2022: 19588, 2023: 20892, 2024: 22139 },
  },
  growth: {
    label: "Pertumbuhan ekonomi",
    unit: "% y-on-y",
    source: "BPS — Pertumbuhan PDB",
    values: { 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  },
  inflation: {
    label: "Inflasi (Desember, y-on-y)",
    unit: "%",
    source: "BPS — Indeks Harga Konsumen",
    values: { 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  },
  unemployment: {
    label: "Tingkat pengangguran terbuka (Agustus)",
    unit: "%",
    source: "BPS — Sakernas",
    values: { 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  },
  poverty: {
    label: "Penduduk miskin (September)",
    unit: "%",
    source: "BPS — Kemiskinan",
    values: { 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  },
  hdi: {
    label: "Indeks Pembangunan Manusia",
    unit: "indeks",
    source: "BPS — IPM",
    values: { 2020: 71.94, 2021: 72.29, 2022: 73.37, 2023: 74.39, 2024: 75.02 },
  },
  lifeExpectancy: {
    label: "Angka harapan hidup saat lahir",
    unit: "tahun",
    source: "BPS — Angka Harapan Hidup",
    values: { 2022: 73.93, 2023: 74.23, 2024: 74.45 },
  },
  schooling: {
    label: "Rata-rata lama sekolah",
    unit: "tahun",
    source: "BPS — Rata-rata Lama Sekolah",
    values: { 2022: 9.06, 2023: 9.13, 2024: 9.19 },
  },
  stunting: {
    label: "Prevalensi stunting balita",
    unit: "%",
    source: "Kemenkes — Survei Status Gizi Indonesia (SSGI)",
    values: { 2021: 24.4, 2022: 21.6, 2023: 21.5, 2024: 19.8 },
  },
  exports: {
    label: "Ekspor",
    unit: "US$ miliar",
    source: "BPS — Statistik Ekspor",
    values: { 2020: 163.2, 2021: 231.6, 2022: 291.9, 2023: 258.8, 2024: 264.7 },
  },
  imports: {
    label: "Impor",
    unit: "US$ miliar",
    source: "BPS — Statistik Impor",
    values: { 2020: 141.6, 2021: 196.2, 2022: 237.5, 2023: 221.9, 2024: 233.7 },
  },
  visitors: {
    label: "Kunjungan wisatawan mancanegara",
    unit: "juta kunjungan",
    source: "BPS — Statistik Pariwisata",
    values: { 2020: 4.05, 2021: 1.56, 2022: 5.47, 2023: 11.68, 2024: 13.9 },
  },
  internet: {
    label: "Pengguna internet",
    unit: "juta orang",
    source: "APJII — Survei Penetrasi Internet",
    values: { 2022: 210.03, 2023: 215.63, 2024: 221.56 },
  },
  gini: {
    label: "Rasio gini",
    unit: "indeks",
    source: "BPS — Rasio Gini",
    values: { "2023-03": 0.379, "2023-09": 0.388, "2024-03": 0.379, "2024-09": 0.381 },
  },
};

// Pangsa sektor terhadap PDB, 2023 — empat sektor terbesar (BPS).
export const SECTORS_2023 = [
  { name: "Industri pengolahan", share: 18.67 },
  { name: "Perdagangan besar dan eceran", share: 12.94 },
  { name: "Pertanian, kehutanan, dan perikanan", share: 12.53 },
  { name: "Konstruksi", share: 9.92 },
];

// Penduduk provinsi, Sensus Penduduk 2020 (BPS), juta jiwa.
export const PROVINCES_2020 = [
  { name: "Jawa Barat", pop: 48.27 },
  { name: "Jawa Timur", pop: 40.67 },
  { name: "Jawa Tengah", pop: 36.52 },
  { name: "Sumatera Utara", pop: 14.8 },
  { name: "Banten", pop: 11.91 },
  { name: "DKI Jakarta", pop: 10.56 },
  { name: "Sulawesi Selatan", pop: 9.07 },
  { name: "Lampung", pop: 9.01 },
  { name: "Sumatera Selatan", pop: 8.47 },
  { name: "Riau", pop: 6.39 },
  { name: "Sumatera Barat", pop: 5.53 },
  { name: "Kalimantan Barat", pop: 5.41 },
  { name: "Nusa Tenggara Timur", pop: 5.33 },
  { name: "Aceh", pop: 5.27 },
  { name: "Bali", pop: 4.32 },
  { name: "Kalimantan Selatan", pop: 4.07 },
  { name: "Kalimantan Timur", pop: 3.77 },
  { name: "DI Yogyakarta", pop: 3.67 },
  { name: "Jambi", pop: 3.55 },
  { name: "Sulawesi Tengah", pop: 2.99 },
];

export const CENSUS_TOTAL_2020 = 270.2;
export const JAVA_SHARE_2020 = 56.1; // persen, dihitung dari Sensus 2020

// Format angka Indonesia: koma desimal, titik ribuan.
export function fmt(value, decimals = 2) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function fmtInt(value) {
  return value.toLocaleString("id-ID", { maximumFractionDigits: 0 });
}
