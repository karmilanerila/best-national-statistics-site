// NusaStat — skrip penyerahan (main.ts, Node 22, stdlib saja).
// Menyalin app/ dan screenshots/ dari repo ke direktori output, lalu
// menulis dossier.json lewat buildDossier dari vendor/makefun-frontend.ts.
// MAKEFUN_OUTPUT_DIR menggantikan /output saat dijalankan di luar grader.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");

if (!existsSync(appDir)) {
  throw new Error(`main.ts: app/ tidak ada di ${repoRoot}`);
}
if (!existsSync(shotsDir)) {
  throw new Error(`main.ts: screenshots/ tidak ada di ${repoRoot}`);
}

// Kosongkan isi output tanpa pernah menghapus direktori output itu sendiri:
// di grader, /output adalah mount point volume — menghapusnya gagal EBUSY.
// Setiap anak dihapus satu per satu; entri yang bukan direktori biasa pun
// ikut terhapus karena recursive + force.
function emptyContents(dir) {
  mkdirSync(dir, { recursive: true });
  for (const name of readdirSync(dir)) {
    rmSync(join(dir, name), { recursive: true, force: true });
  }
}
emptyContents(outDir);

const outApp = join(outDir, "app");
const outShots = join(outDir, "screenshots");
mkdirSync(outApp, { recursive: true });
mkdirSync(outShots, { recursive: true });

cpSync(appDir, outApp, { recursive: true, dereference: false });
cpSync(shotsDir, outShots, { recursive: true, dereference: false });

// Validasi cepat sebelum dossier: index.html wajib ada dan
// screenshots/ wajib berisi 3-4 gambar, supaya gagal dengan pesan jelas.
if (!existsSync(join(outApp, "index.html"))) {
  throw new Error("main.ts: app/index.html hilang setelah penyalinan");
}
const shotFiles = readdirSync(outShots).filter((f) => /\.(png|jpe?g)$/i.test(f));
if (shotFiles.length < 3 || shotFiles.length > 4) {
  throw new Error(`main.ts: screenshots/ berisi ${shotFiles.length} gambar, harus 3-4`);
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});
if (!dossier || dossier.length === 0) {
  throw new Error("main.ts: dossier.json kosong dari buildDossier");
}
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(`NusaStat: app/ + screenshots/ disalin ke ${outDir}`);
console.log(`NusaStat: dossier.json ditulis (${dossier.length} byte)`);
