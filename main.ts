// NusaStat — program penyerahan (main.ts, Node 22, stdlib saja).
// Menyalin app/ dan screenshots/ dari repositori ke direktori output lalu
// menulis dossier.json dengan buildDossier dari vendor/makefun-frontend.ts.
// Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output.
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const appDir = join(repoRoot, "app");
const shotsDir = join(repoRoot, "screenshots");
if (!existsSync(appDir)) {
  throw new Error(`main.ts: app/ tidak ditemukan di ${repoRoot}`);
}
if (!existsSync(shotsDir)) {
  throw new Error(`main.ts: screenshots/ tidak ditemukan di ${repoRoot}`);
}

// Mulai dari output kosong supaya tidak ada berkas basi yang ikut terkirim.
rmSync(outDir, { recursive: true, force: true });
mkdirSync(join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });

cpSync(appDir, join(outDir, "app"), { recursive: true, dereference: false });
cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true, dereference: false });

// Validasi sebelum membangun dossier: index.html wajib ada, dan
// screenshots/ wajib berisi 3–4 gambar — kalau tidak, gagal cepat dengan
// pesan yang jelas, bukan lewat dossier yang menolak belakangan.
if (!existsSync(join(outDir, "app", "index.html"))) {
  throw new Error("main.ts: app/index.html hilang setelah penyalinan");
}
const shotCount = readdirSync(join(outDir, "screenshots")).filter((f) =>
  /\.(png|jpe?g)$/i.test(f)
).length;
if (shotCount < 3 || shotCount > 4) {
  throw new Error(`main.ts: screenshots/ berisi ${shotCount} gambar, harus 3–4`);
}

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log(`NusaStat: app/ + screenshots/ disalin ke ${outDir}`);
console.log(`NusaStat: dossier.json ditulis (${dossier.length} byte)`);
